"use client";

import { Layout, Typography, Space, Grid, Dropdown, Button } from "antd";
import { SafetyCertificateOutlined, GlobalOutlined } from "@ant-design/icons";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import { useT, LOCALE_LABELS, Locale } from "@/lib/i18n";

const { Header, Content, Footer } = Layout;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const screens = Grid.useBreakpoint();
  const { t, locale, setLocale } = useT();

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
        <Space size={12}>
          <Dropdown
            menu={{
              items: (Object.keys(LOCALE_LABELS) as Locale[]).map((l) => ({
                key: l,
                label: LOCALE_LABELS[l],
                onClick: () => setLocale(l),
              })),
              selectedKeys: [locale],
            }}
          >
            <Button
              style={{ borderRadius: 20 }}
              icon={<GlobalOutlined />}
              aria-label="language"
            >
              {screens.md ? LOCALE_LABELS[locale] : undefined}
            </Button>
          </Dropdown>
          <ConnectButton />
        </Space>
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
        {t("footer")}
      </Footer>
    </Layout>
  );
}
