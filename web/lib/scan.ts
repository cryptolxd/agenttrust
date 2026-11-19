import { parseAbiItem } from "viem";
import { publicClient } from "./rpc";
import { HUB_ADDRESS } from "./contracts";
import { trustScore } from "./score";

const reviewEvent = parseAbiItem(
  "event ReviewSubmitted(uint256 indexed agentId, address indexed reviewer, uint8 score, string tag, string commentURI)"
);
const reviewUpdatedEvent = parseAbiItem(
  "event ReviewUpdated(uint256 indexed agentId, address indexed reviewer, uint8 score, string tag, string commentURI)"
);

const CHUNK = 4500n;

/**
 * 无索引器时的兜底：从 START_BLOCK 起分块扫 Hub 评价事件，内存聚合。
 * 仅取每 (agentId, reviewer) 最新一条，与合约"覆盖更新"语义一致。
 */
export async function scanReviewEvents() {
  if (!HUB_ADDRESS) return [];

  const latest = await publicClient.getBlockNumber();
  const start = BigInt(process.env.START_BLOCK || "0");

  const latestReview = new Map<string, { agentId: bigint; score: number }>();

  for (let from = start; from <= latest; from += CHUNK) {
    const to = from + CHUNK - 1n > latest ? latest : from + CHUNK - 1n;
    for (const event of [reviewEvent, reviewUpdatedEvent]) {
      const logs = await publicClient.getLogs({
        address: HUB_ADDRESS,
        event,
        fromBlock: from,
        toBlock: to,
      });
      for (const log of logs) {
        const key = `${log.args.agentId}-${log.args.reviewer}`;
        latestReview.set(key, {
          agentId: log.args.agentId!,
          score: Number(log.args.score),
        });
      }
    }
  }

  const byAgent = new Map<string, { sum: number; count: number }>();
  for (const { agentId, score } of latestReview.values()) {
    const key = agentId.toString();
    const cur = byAgent.get(key) || { sum: 0, count: 0 };
    cur.sum += score;
    cur.count += 1;
    byAgent.set(key, cur);
  }

  return [...byAgent.entries()]
    .map(([agentId, { sum, count }]) => {
      const avgScore = sum / count;
      return {
        agentId,
        reviewCount: count,
        avgScore,
        trustScore: trustScore(avgScore, count),
      };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount || b.trustScore - a.trustScore)
    .slice(0, 50);
}
