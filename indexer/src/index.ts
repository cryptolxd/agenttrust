import "dotenv/config";
import { createPublicClient, http, parseAbiItem } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import mysql from "mysql2/promise";

const RPC_URL = process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org";
const HUB_ADDRESS = process.env.HUB_ADDRESS as `0x${string}`;
const CHAIN_ID = Number(process.env.CHAIN_ID || 56);
const START_BLOCK = BigInt(process.env.START_BLOCK || "0");
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 15000);
const CHUNK = 4500n;

if (!HUB_ADDRESS) throw new Error("HUB_ADDRESS is required");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const client = createPublicClient({
  chain: CHAIN_ID === 97 ? bscTestnet : bsc,
  transport: http(RPC_URL),
});

const events = [
  parseAbiItem(
    "event ReviewSubmitted(uint256 indexed agentId, address indexed reviewer, uint8 score, string tag, string commentURI)"
  ),
  parseAbiItem(
    "event ReviewUpdated(uint256 indexed agentId, address indexed reviewer, uint8 score, string tag, string commentURI)"
  ),
];

async function main() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 3,
  });

  const [stateRows] = await pool.query(
    "SELECT last_block FROM indexer_state WHERE id = 1"
  );
  let cursor = BigInt((stateRows as any[])[0]?.last_block ?? 0);
  if (cursor < START_BLOCK) cursor = START_BLOCK;

  console.log(`indexer started, cursor=${cursor}`);

  for (;;) {
    try {
      const latest = await client.getBlockNumber();
      while (cursor <= latest) {
        const to = cursor + CHUNK - 1n > latest ? latest : cursor + CHUNK - 1n;
        let maxProcessed = to;

        for (const event of events) {
          const logs = await client.getLogs({
            address: HUB_ADDRESS,
            event,
            fromBlock: cursor,
            toBlock: to,
          });
          for (const log of logs) {
            await pool.query(
              `INSERT INTO reviews
                 (agent_id, reviewer, score, tag, comment_uri, tx_hash, block_number, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
               ON DUPLICATE KEY UPDATE
                 score = VALUES(score), tag = VALUES(tag),
                 comment_uri = VALUES(comment_uri), tx_hash = VALUES(tx_hash),
                 block_number = VALUES(block_number), updated_at = NOW(), revoked = 0`,
              [
                log.args.agentId!.toString(),
                log.args.reviewer,
                Number(log.args.score),
                log.args.tag ?? "",
                log.args.commentURI ?? "",
                log.transactionHash,
                Number(log.blockNumber),
              ]
            );
          }
        }

        await pool.query(
          "UPDATE indexer_state SET last_block = ? WHERE id = 1",
          [Number(maxProcessed)]
        );
        cursor = maxProcessed + 1n;
      }
    } catch (err) {
      console.error("index round failed, retrying:", (err as Error).message);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
