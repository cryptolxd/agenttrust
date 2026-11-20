"use client";

import { Card, Col, Row, Typography } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useT } from "@/lib/i18n";

export default function Features() {
  const { t } = useT();
  const features = [
    {
      icon: <SearchOutlined style={{ fontSize: 26, color: "#F0B90B" }} />,
      title: t("features.1.title"),
      desc: t("features.1.desc"),
    },
    {
      icon: <EditOutlined style={{ fontSize: 26, color: "#F0B90B" }} />,
      title: t("features.2.title"),
      desc: t("features.2.desc"),
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 26, color: "#F0B90B" }} />,
      title: t("features.3.title"),
      desc: t("features.3.desc"),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {features.map((f) => (
        <Col xs={24} sm={8} key={f.title}>
          <Card
            style={{
              background: "#161A1E",
              border: "1px solid #1E2329",
              borderRadius: 12,
              height: "100%",
            }}
            styles={{ body: { padding: "20px 20px 16px" } }}
          >
            <div style={{ marginBottom: 12 }}>{f.icon}</div>
            <Typography.Text strong style={{ color: "#EAECEF", fontSize: 15 }}>
              {f.title}
            </Typography.Text>
            <Typography.Paragraph
              style={{ color: "#848E9C", fontSize: 13, marginTop: 6, marginBottom: 0 }}
            >
              {f.desc}
            </Typography.Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
