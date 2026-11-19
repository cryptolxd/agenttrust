import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { scanReviewEvents } from "@/lib/scan";
import { trustScore } from "@/lib/score";

export const dynamic = "force-dynamic";

export type LeaderboardRow = {
  agentId: string;
  reviewCount: number;
  avgScore: number;
  trustScore: number;
};

/** 排行榜：优先读索引器 MySQL；未配置或失败时回退为实时扫链 */
export async function GET(_req: NextRequest) {
  const pool = getPool();
  if (pool) {
    try {
      const [rows] = await pool.query(
        `SELECT agent_id AS agentId, COUNT(*) AS reviewCount, AVG(score) AS avgScore
         FROM reviews
         WHERE revoked = 0
         GROUP BY agent_id
         ORDER BY COUNT(*) DESC, AVG(score) DESC
         LIMIT 50`
      );
      const data = (rows as any[]).map((r) => ({
        agentId: String(r.agentId),
        reviewCount: Number(r.reviewCount),
        avgScore: Number(r.avgScore),
        trustScore: trustScore(Number(r.avgScore), Number(r.reviewCount)),
      }));
      if (data.length > 0) return NextResponse.json({ rows: data, source: "db" });
    } catch {
      // 落回扫链
    }
  }

  try {
    const rows = await scanReviewEvents();
    return NextResponse.json({ rows, source: "chain" });
  } catch {
    return NextResponse.json({ rows: [], source: "none" });
  }
}
