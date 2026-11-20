"use client";

import { Card, Col, Row, Typography } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const FEATURES = [
  {
    icon: <SearchOutlined style={{ fontSize: 26, color: "#F0B90B" }} />,
    title: "查信用分",
    desc: "输入 Agent ID，秒出信任评分、评价人数和评价明细，数据全部来自链上。",
  },
  {
    icon: <EditOutlined style={{ fontSize: 26, color: "#F0B90B" }} />,
    title: "写评价",
    desc: "Agent ID 持有者一人一票，评价实时写入链上声誉层，全生态可查可复用。",
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 26, color: "#F0B90B" }} />,
    title: "防刷评",
    desc: "一个 KYC 一个 Agent ID，小号刷分在这里行不通——信用分才有意义。",
  },
];

export default function Features() {
  return (
    <Row gutter={[16, 16]}>
      {FEATURES.map((f) => (
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
