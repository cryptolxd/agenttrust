"use client";

import { Layout, Typography, Space, Button, Grid } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import Link from "next/link";
import ConnectButton from "./ConnectButton";

const { Header, Content, Footer } = Layout;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const screens = Grid.useBreakpoint();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: screens.md ? "0 24px" : "0 12px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Link href="/">
          <Space>
            <SafetyCertificateOutlined style={{ fontSize: 22, color: "#f0b90b" }} />
            <Typography.Text strong style={{ color: "#fff", fontSize: 18 }}>
              AgentTrust
            </Typography.Text>
          </Space>
        </Link>
        <ConnectButton />
      </Header>
      <Content>
        <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center", fontSize: 12 }}>
        Built on BNB Chain · 数据来自 ERC-8004 Agent ID 声誉层 ·
        每笔交易由你在币安钱包中确认
      </Footer>
    </Layout>
  );
}
