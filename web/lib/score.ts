/**
 * 信任分：贝叶斯平均，防止"1 条满分评价 = 100 分"的刷分。
 * trust = (avg * count + PRIOR_MEAN * PRIOR_WEIGHT) / (count + PRIOR_WEIGHT)
 */
export const PRIOR_MEAN = 50;
export const PRIOR_WEIGHT = 5;

export function trustScore(avg: number, count: number): number {
  if (count <= 0) return PRIOR_MEAN;
  return Math.round(
    ((avg * count + PRIOR_MEAN * PRIOR_WEIGHT) / (count + PRIOR_WEIGHT)) * 10
  ) / 10;
}

export type TrustLevel = "高" | "中" | "低" | "未知";

export function trustLevel(score: number, count: number): TrustLevel {
  if (count === 0) return "未知";
  if (score >= 75) return "高";
  if (score >= 50) return "中";
  return "低";
}

export function trustColor(score: number, count: number): string {
  const level = trustLevel(score, count);
  switch (level) {
    case "高":
      return "#16a34a";
    case "中":
      return "#d97706";
    case "低":
      return "#dc2626";
    default:
      return "#6b7280";
  }
}
