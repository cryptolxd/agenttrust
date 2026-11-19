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

  // data:application/json;base64 形式的注册信息，解码出 agent 名字展示；否则截断长 URI
  const formatAgentURI = (uri?: string) => {
    if (!uri) return "—";
    const m = uri.match(/^data:application\/json;base64,(.+)$/);
    if (m) {
      try {
        const json = JSON.parse(atob(m[1]));
        return json.name ? `${json.name}（内嵌注册信息）` : "内嵌注册信息";
      } catch {
        return "内嵌注册信息";
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
    return <Result status="404" title="无效的 Agent ID" />;
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
        title={`Agent #${id} 不存在`}
        subTitle="该 Agent ID 尚未在 ERC-8004 IdentityRegistry 注册"
        extra={
          <Link href="/">
            <Button type="primary">返回首页</Button>
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
            <Typography.Title level={3} style={{ margin: 0 }}>
              Agent #{data.agentId}
            </Typography.Title>
            <ScoreBadge score={data.trustScore} count={data.reviewCount} />
          </Space>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 2 }}
            size="small"
            items={[
              { key: "owner", label: "Owner", children: data.owner },
              { key: "uri", label: "注册信息 URI", children: formatAgentURI(data.agentURI) },
              { key: "count", label: "评价数", children: data.reviewCount },
              {
                key: "avg",
                label: "平均分",
                children: data.reviewCount ? data.avgScore.toFixed(1) : "—",
              },
            ]}
          />
        </Space>
      </Card>

      <ReviewForm agentId={BigInt(id)} onSuccess={() => refetch()} />

      <Card title={`评价明细（${data.reviews.length}）`} size="small">
        <Table
          rowKey="reviewer"
          dataSource={data.reviews}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          size="small"
          locale={{ emptyText: "还没有评价" }}
          columns={[
            {
              title: "评价者",
              dataIndex: "reviewer",
              render: (v: string) => `${v.slice(0, 6)}...${v.slice(-4)}`,
            },
            {
              title: "评分",
              dataIndex: "score",
              width: 80,
              sorter: (a, b) => a.score - b.score,
            },
            { title: "标签", dataIndex: "tag", render: (v: string) => v && <Tag>{v}</Tag> },
            {
              title: "时间",
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
