import { ethers } from "hardhat";

// BSC 主网官方合约
const MAINNET_IDENTITY = "0xfA09B3397fAC75424422C4D28b1729E3D4f659D7"; // ERC-8004 IdentityRegistry
const MAINNET_REPUTATION = "0x17860530385Bdde7992c4Da71B9ec7791E474C08"; // ERC-8004 ReputationRegistry
const MAINNET_AGENT_ID = "0x60b9262456de011f7d15a54cdd8c48baaa8b022f"; // SPACE ID Agent ID (ERC-721, 不可转让)

async function main() {
  const network = await ethers.provider.getNetwork();
  const isMainnet = network.chainId === 56n;

  const identity =
    process.env.IDENTITY_REGISTRY || (isMainnet ? MAINNET_IDENTITY : "");
  const reputation =
    process.env.REPUTATION_REGISTRY || (isMainnet ? MAINNET_REPUTATION : "");
  const agentID = process.env.AGENT_ID || (isMainnet ? MAINNET_AGENT_ID : "");

  if (!identity || !reputation || !agentID) {
    throw new Error(
      "测试网部署请先设置 IDENTITY_REGISTRY / REPUTATION_REGISTRY / AGENT_ID 环境变量"
    );
  }

  console.log(`Network chainId:    ${network.chainId}`);
  console.log(`IdentityRegistry:   ${identity}`);
  console.log(`ReputationRegistry: ${reputation}`);
  console.log(`AgentID:            ${agentID}`);

  const Hub = await ethers.getContractFactory("AgentReputationHub");
  const hub = await Hub.deploy(identity, reputation, agentID);
  await hub.waitForDeployment();

  const address = await hub.getAddress();
  console.log(`AgentReputationHub deployed: ${address}`);
  console.log(
    `Verify: npx hardhat verify --network ${
      isMainnet ? "bsc" : "bscTestnet"
    } ${address} ${identity} ${reputation} ${agentID}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
