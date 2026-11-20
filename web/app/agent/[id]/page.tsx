"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Descriptions,
  Space,
  Spin,
  Typography,
  Result,
  Table,
  Tag,
  Button,
} from "antd";
import Link from "next/link";
import ScoreBadge from "@/components/ScoreBadge";
import ReviewForm from "@/components/ReviewForm";
import { useT } from "@/lib/i18n";

type AgentDetail = {
  exists: boolean;
  agentId: string;
  owner?: string;
  agentURI?: string;
  avgScore: number;
  reviewCount: number;
  trustScore: number;
  reviews: {
    reviewer: string;
    score: number;
    tag: string;
    commentURI: string;
    updatedAt: number;
  }[];
};

export default function AgentPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { t } = useT();

  // data:application/json;base64 形式的注册信息，解码出 agent 名字展示；否则截断长 URI
  const formatAgentURI = (uri?: string) => {
    if (!uri) return "—";
    const m = uri.match(/^data:application\/json;base64,(.+)$/);
    if (m) {
      try {
        const json = JSON.parse(atob(m[1]));
        return json.name ? `${json.name}（${t("agent.embedded")}）` : t("agent.embedded");
      } catch {
        return t("agent.embedded");
      }
    }
    return uri.length > 60 ? `${uri.slice(0, 60)}…` : uri;
  };

  const { data, isLoading, refetch } = useQuery<AgentDetail>({
    queryKey: ["agent", id],
    queryFn: async () => {
      const res = await fetch(`/api/agent/${id}`);
      if (!res.ok) throw new Error("fetch failed");
      return res.json();
    },
    enabled: /^\d+$/.test(id),
  });

  if (!/^\d+$/.test(id)) {
    return <Result status="404" title="Invalid Agent ID" />;
  }

  if (isLoading || !data) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data.exists) {
    return (
      <Result
        status="warning"
        title={`Agent #${id} ${t("agent.notFound")}`}
        subTitle={t("agent.notFoundDesc")}
        extra={
          <Link href="/">
            <Button type="primary" style={{ borderRadius: 20 }}>
              {t("agent.backHome")}
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space align="center" wrap>
            <Typography.Title level={3} style={{ margin: 0, color: "#EAECEF" }}>
              Agent #{data.agentId}
            </Typography.Title>
            <ScoreBadge score={data.trustScore} count={data.reviewCount} />
          </Space>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 2 }}
            size="small"
            items={[
              { key: "owner", label: t("agent.owner"), children: data.owner },
              { key: "uri", label: t("agent.uri"), children: formatAgentURI(data.agentURI) },
              { key: "count", label: t("agent.reviewCount"), children: data.reviewCount },
              {
                key: "avg",
                label: t("agent.avgScore"),
                children: data.reviewCount ? data.avgScore.toFixed(1) : "—",
              },
            ]}
          />
        </Space>
      </Card>

      <ReviewForm agentId={BigInt(id)} onSuccess={() => refetch()} />

      <Card title={`${t("agent.reviews")}（${data.reviews.length}）`} size="small">
        <Table
          rowKey="reviewer"
          dataSource={data.reviews}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          size="small"
          locale={{ emptyText: t("agent.noReviews") }}
          columns={[
            {
              title: t("table.reviewer"),
              dataIndex: "reviewer",
              render: (v: string) => `${v.slice(0, 6)}...${v.slice(-4)}`,
            },
            {
              title: t("table.score"),
              dataIndex: "score",
              width: 80,
              sorter: (a, b) => a.score - b.score,
            },
            { title: t("table.tag"), dataIndex: "tag", render: (v: string) => v && <Tag>{v}</Tag> },
            {
              title: t("table.time"),
              dataIndex: "updatedAt",
              width: 110,
              render: (v: number) =>
                v ? new Date(v * 1000).toLocaleDateString() : "—",
            },
          ]}
        />
      </Card>
    </Space>
  );
}
