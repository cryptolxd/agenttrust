"use client";

import { Input, Typography, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Leaderboard from "@/components/Leaderboard";
import Features from "@/components/Features";
import Faq from "@/components/Faq";
import { useT } from "@/lib/i18n";

export default function Home() {
  const router = useRouter();
  const { t } = useT();

  return (
    <Space direction="vertical" size={0} style={{ width: "100%" }}>
      <div style={{ textAlign: "center", padding: "48px 0 40px" }}>
        <Typography.Title
          level={1}
          style={{
            marginBottom: 16,
            fontSize: 44,
            fontWeight: 600,
            color: "#EAECEF",
            letterSpacing: -0.5,
          }}
        >
          {t("hero.titleA")}
          <span style={{ color: "#F0B90B" }}>{t("hero.titleB")}</span>
        </Typography.Title>
        <Typography.Paragraph
          style={{ color: "#848E9C", fontSize: 16, marginBottom: 32 }}
        >
          {t("hero.sub1")}
          <br />
          {t("hero.sub2")}
        </Typography.Paragraph>
        <Input.Search
          className="hero-search"
          size="large"
          placeholder={t("hero.searchPlaceholder")}
          prefix={<SearchOutlined style={{ color: "#848E9C" }} />}
          style={{ maxWidth: 440 }}
          onSearch={(value) => {
            const id = value.trim();
            if (/^\d+$/.test(id)) router.push(`/agent/${id}`);
          }}
        />
      </div>

      <Features />

      <hr className="divider-fade" />
      <Leaderboard />

      <hr className="divider-fade" />
      <Faq />
    </Space>
  );
}
