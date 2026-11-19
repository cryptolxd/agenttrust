"use client";

import { Tag } from "antd";
import { trustColor, trustLevel } from "@/lib/score";

export default function ScoreBadge({
  score,
  count,
}: {
  score: number;
  count: number;
}) {
  const color = trustColor(score, count);
  return (
    <Tag color={color} style={{ fontWeight: 600, fontSize: 14, padding: "2px 10px" }}>
      {count === 0 ? "暂无评价" : `${score.toFixed(1)} · 信任${trustLevel(score, count)}`}
    </Tag>
  );
}
