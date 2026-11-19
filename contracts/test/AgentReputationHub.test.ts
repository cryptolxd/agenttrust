import { expect } from "chai";
import { ethers } from "hardhat";

async function deployFixture(reputationKind: "ok" | "revert" = "ok") {
  const [deployer, agentOwner, alice, bob, noIdUser] = await ethers.getSigners();

  const Identity = await ethers.getContractFactory("MockIdentityRegistry");
  const identity = await Identity.deploy();

  const Reputation = await ethers.getContractFactory(
    reputationKind === "ok" ? "MockReputationRegistry" : "RevertingReputationRegistry"
  );
  const reputation = await Reputation.deploy();

  const AgentID = await ethers.getContractFactory("MockAgentID");
  const agentID = await AgentID.deploy();

  const Hub = await ethers.getContractFactory("AgentReputationHub");
  const hub = await Hub.deploy(
    await identity.getAddress(),
    await reputation.getAddress(),
    await agentID.getAddress()
  );

  // agentId 1 属于 agentOwner；alice / bob / agentOwner 持有 Agent ID，noIdUser 没有
  await identity.register(agentOwner.address);
  for (const signer of [agentOwner, alice, bob]) {
    await agentID.mint(signer.address);
  }

  return { hub, identity, reputation, agentID, deployer, agentOwner, alice, bob, noIdUser };
}

describe("AgentReputationHub", function () {
  it("submits a review and aggregates score", async function () {
    const { hub, alice } = await deployFixture();
    await hub.connect(alice).submitReview(1, 80, "trading", "", true);

    const [avg, count] = await hub.averageScore(1);
    expect(avg).to.equal(80n);
    expect(count).to.equal(1n);

    const review = await hub.getReview(1, alice.address);
    expect(review.score).to.equal(80);
    expect(review.tag).to.equal("trading");
  });

  it("rejects reviewers without an Agent ID", async function () {
    const { hub, noIdUser } = await deployFixture();
    await expect(
      hub.connect(noIdUser).submitReview(1, 80, "trading", "", false)
    ).to.be.revertedWithCustomError(hub, "NoAgentID");
  });

  it("updates an existing review instead of double counting", async function () {
    const { hub, alice } = await deployFixture();
    await hub.connect(alice).submitReview(1, 60, "trading", "", false);
    await hub.connect(alice).submitReview(1, 90, "trading", "ipfs://x", false);

    const [avg, count] = await hub.averageScore(1);
    expect(avg).to.equal(90n);
    expect(count).to.equal(1n);
  });

  it("averages across multiple reviewers", async function () {
    const { hub, alice, bob } = await deployFixture();
    await hub.connect(alice).submitReview(1, 100, "good", "", false);
    await hub.connect(bob).submitReview(1, 50, "slow", "", false);

    const [avg, count] = await hub.averageScore(1);
    expect(avg).to.equal(75n);
    expect(count).to.equal(2n);

    const [reviewers, total] = await hub.getReviewers(1, 0, 10);
    expect(total).to.equal(2n);
    expect(reviewers.length).to.equal(2);
  });

  it("reverts for unknown agent / bad score / self review", async function () {
    const { hub, alice, agentOwner } = await deployFixture();
    await expect(
      hub.connect(alice).submitReview(999, 50, "", "", false)
    ).to.be.revertedWithCustomError(hub, "AgentNotFound");
    await expect(
      hub.connect(alice).submitReview(1, 0, "", "", false)
    ).to.be.revertedWithCustomError(hub, "ScoreOutOfRange");
    await expect(
      hub.connect(alice).submitReview(1, 101, "", "", false)
    ).to.be.revertedWithCustomError(hub, "ScoreOutOfRange");
    await expect(
      hub.connect(agentOwner).submitReview(1, 100, "", "", false)
    ).to.be.revertedWithCustomError(hub, "SelfReviewNotAllowed");
  });

  it("forwards feedback to the canonical reputation registry", async function () {
    const { hub, reputation, alice } = await deployFixture();
    await hub.connect(alice).submitReview(1, 70, "payment", "", true);
    expect(await reputation.feedbackCount()).to.equal(1n);
  });

  it("does not revert when the canonical registry fails", async function () {
    const { hub, alice } = await deployFixture("revert");
    await expect(
      hub.connect(alice).submitReview(1, 70, "payment", "", true)
    ).to.not.be.reverted;
    const [avg, count] = await hub.averageScore(1);
    expect(avg).to.equal(70n);
    expect(count).to.equal(1n);
  });
});
