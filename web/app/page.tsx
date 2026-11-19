"use client";

import { Input, Typography, Space, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Leaderboard from "@/components/Leaderboard";

export default function Home() {
  const router = useRouter();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div style={{ textAlign: "center", padding: "32px 0 8px" }}>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          交易之前，先查分
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          BNB 链上每个 Agent（ERC-8004 Agent ID）的公开信用分，
          来自真实用户的链上评价。
        </Typography.Paragraph>
        <Input.Search
          size="large"
          placeholder="输入 Agent ID（数字），如 111648"
          prefix={<SearchOutlined />}
          style={{ maxWidth: 420 }}
          onSearch={(value) => {
            const id = value.trim();
            if (/^\d+$/.test(id)) router.push(`/agent/${id}`);
          }}
        />
      </div>
      <Alert
        type="info"
        showIcon
        message="你的每一笔评价都是链上交易，由你在币安钱包中亲手确认——我们不碰私钥、不存会话、不代下单。"
      />
      <Leaderboard />
    </Space>
  );
}
