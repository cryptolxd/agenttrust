"use client";

import { Table, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ScoreBadge from "./ScoreBadge";
import { useT } from "@/lib/i18n";

export type LeaderboardRow = {
  agentId: string;
  reviewCount: number;
  avgScore: number;
  trustScore: number;
};

export default function Leaderboard() {
  const { t } = useT();
  const { data, isLoading, error } = useQuery<{ rows: LeaderboardRow[]; source: string }>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("leaderboard fetch failed");
      return res.json();
    },
  });

  return (
    <div>
      <Typography.Title level={4} style={{ color: "#EAECEF", fontWeight: 600 }}>
        {t("leaderboard.title")}
      </Typography.Title>
      {error && (
        <Typography.Paragraph style={{ color: "#5E6673" }}>
          {t("leaderboard.error")}
        </Typography.Paragraph>
      )}
      <Table<LeaderboardRow>
        rowKey="agentId"
        loading={isLoading}
        dataSource={data?.rows || []}
        pagination={false}
        size="middle"
        locale={{ emptyText: t("leaderboard.empty") }}
        onRow={(r) => ({
          style: { cursor: "pointer" },
          onClick: () => (window.location.href = `/agent/${r.agentId}`),
        })}
        columns={[
          {
            title: "#",
            width: 56,
            render: (_v, _r, i) => (
              <span style={{ color: "#5E6673" }}>{i + 1}</span>
            ),
          },
          {
            title: t("table.agentId"),
            render: (_v, r) => (
              <Link href={`/agent/${r.agentId}`}>
                <span style={{ color: "#F0B90B", fontWeight: 600 }}>#{r.agentId}</span>
              </Link>
            ),
          },
          {
            title: t("table.trustScore"),
            render: (_v, r) => (
              <ScoreBadge score={r.trustScore} count={r.reviewCount} />
            ),
          },
          {
            title: t("table.reviewCount"),
            dataIndex: "reviewCount",
            width: 90,
            render: (v: number) => <span style={{ color: "#EAECEF" }}>{v}</span>,
          },
          {
            title: t("table.avgScore"),
            width: 90,
            render: (_v, r) => (
              <span style={{ color: "#EAECEF" }}>{r.avgScore.toFixed(1)}</span>
            ),
          },
        ]}
      />
    </div>
  );
}
