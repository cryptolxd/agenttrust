"use client";

import { Layout, Typography, Space, Grid } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import Link from "next/link";
import ConnectButton from "./ConnectButton";

const { Header, Content, Footer } = Layout;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const screens = Grid.useBreakpoint();

  return (
    <Layout style={{ minHeight: "100vh", background: "#0B0E11" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: screens.md ? "0 24px" : "0 16px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(11,14,17,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #1E2329",
          height: 60,
          lineHeight: "60px",
        }}
      >
        <Link href="/">
          <Space size={8}>
            <SafetyCertificateOutlined style={{ fontSize: 22, color: "#F0B90B" }} />
            <Typography.Text strong style={{ color: "#EAECEF", fontSize: 18 }}>
              AgentTrust
            </Typography.Text>
          </Space>
        </Link>
        <ConnectButton />
      </Header>
      <Content>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
          {children}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          fontSize: 12,
          background: "transparent",
          color: "#5E6673",
          borderTop: "1px solid #1E2329",
        }}
      >
        Built on BNB Chain · 数据来自 ERC-8004 声誉层 · 每笔交易由你在币安钱包中确认
      </Footer>
    </Layout>
  );
}
