"use client";

import { trustLevel } from "@/lib/score";
import { useT } from "@/lib/i18n";

// Binance 配色语义：黄=关注/中，绿=优，红=差，灰=未知
const LEVEL_STYLE: Record<string, { bg: string; color: string }> = {
  高: { bg: "rgba(46,189,133,0.14)", color: "#2EBD85" },
  中: { bg: "rgba(240,185,11,0.14)", color: "#F0B90B" },
  低: { bg: "rgba(246,70,93,0.14)", color: "#F6465D" },
  未知: { bg: "rgba(94,102,115,0.18)", color: "#848E9C" },
};

const LEVEL_KEY: Record<string, string> = {
  高: "score.trustHigh",
  中: "score.trustMid",
  低: "score.trustLow",
  未知: "score.unknown",
};

export default function ScoreBadge({
  score,
  count,
}: {
  score: number;
  count: number;
}) {
  const { t } = useT();
  const level = trustLevel(score, count);
  const s = LEVEL_STYLE[level];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 12px",
        borderRadius: 12,
        background: s.bg,
        color: s.color,
        fontWeight: 600,
        fontSize: 13,
        whiteSpace: "nowrap",
      }}
    >
      {count === 0 ? t("score.empty") : `${score.toFixed(1)} · ${t(LEVEL_KEY[level])}`}
    </span>
  );
}
