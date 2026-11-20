"use client";

import { Table, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ScoreBadge from "./ScoreBadge";

export type LeaderboardRow = {
  agentId: string;
  reviewCount: number;
  avgScore: number;
  trustScore: number;
};

export default function Leaderboard() {
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
        信用榜
      </Typography.Title>
      {error && (
        <Typography.Paragraph style={{ color: "#5E6673" }}>
          榜单加载失败，可直接搜索 Agent ID 查分。
        </Typography.Paragraph>
      )}
      <Table<LeaderboardRow>
        rowKey="agentId"
        loading={isLoading}
        dataSource={data?.rows || []}
        pagination={false}
        size="middle"
        locale={{ emptyText: "暂无评价数据，来做第一个评价的人" }}
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
            title: "Agent ID",
            render: (_v, r) => (
              <Link href={`/agent/${r.agentId}`}>
                <span style={{ color: "#F0B90B", fontWeight: 600 }}>#{r.agentId}</span>
              </Link>
            ),
          },
          {
            title: "信用分",
            render: (_v, r) => (
              <ScoreBadge score={r.trustScore} count={r.reviewCount} />
            ),
          },
          {
            title: "评价数",
            dataIndex: "reviewCount",
            width: 90,
            render: (v: number) => <span style={{ color: "#EAECEF" }}>{v}</span>,
          },
          {
            title: "平均分",
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
