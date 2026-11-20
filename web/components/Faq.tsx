"use client";

import { Collapse, Typography } from "antd";
import { useT } from "@/lib/i18n";

export default function Faq() {
  const { t } = useT();
  const items = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    key: String(n),
    label: <span style={{ color: "#EAECEF" }}>{t(`faq.${n}.q`)}</span>,
    children: (
      <div style={{ color: "#848E9C", fontSize: 13, whiteSpace: "pre-wrap" }}>
        {t(`faq.${n}.a`)}
      </div>
    ),
  }));

  return (
    <div>
      <Typography.Title level={4} style={{ color: "#EAECEF", fontWeight: 600 }}>
        {t("faq.title")}
      </Typography.Title>
      <Collapse ghost items={items} style={{ background: "transparent" }} />
    </div>
  );
}
