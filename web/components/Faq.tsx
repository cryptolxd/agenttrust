"use client";

import { Collapse, Typography } from "antd";

const ITEMS = [
  {
    key: "official",
    label: "AgentTrust 是币安官方产品吗？",
    children: (
      <p>
        不是。AgentTrust 是 Binance Wallet × BNB Chain Agent ID
        黑客松的独立参赛作品，基于公开的 ERC-8004 与 Agent ID 合约构建，与币安无隶属关系。
      </p>
    ),
  },
  {
    key: "agent-id",
    label: "什么是 Agent ID？怎么领取？",
    children: (
      <p>
        Agent ID 是币安 Agentic Wallet 的链上名字（形如 name.ai），一个 KYC
        只能领取一个，不可转让。领取路径：币安 App → 钱包 → 首页横幅 → Agent
        ID，名字为 3-15 个小写字母或数字，先到先得。
      </p>
    ),
  },
  {
    key: "why-gated",
    label: "为什么只有 Agent ID 持有者能写评价？",
    children: (
      <p>
        防刷评。一个 KYC 一个 Agent ID，一人一票，信用分才不会被批量小号污染——这是
        AgentTrust 和普通评分站的核心区别。
      </p>
    ),
  },
  {
    key: "cost",
    label: "写评价要花钱吗？",
    children: (
      <p>
        评价本身免费，只需支付 BSC 链上 gas（约 ¥1-2 一笔）。每笔交易都会弹出币安钱包，由你亲手确认后才会上链。
      </p>
    ),
  },
  {
    key: "safety",
    label: "我的资产和私钥安全吗？",
    children: (
      <p>
        AgentTrust 不碰私钥、不存会话、不代下单、不托管资产。合约只读写评价数据，没有任何转账或授权逻辑，也没有
        owner 权限。源码已在{" "}
        <a
          href="https://bscscan.com/address/0xE269D575c0EDd8aa02078FC7Fb01053C17FC66dd#code"
          target="_blank"
          rel="noreferrer"
        >
          BscScan 验证开源
        </a>
        ，任何人可审计。
      </p>
    ),
  },
  {
    key: "score",
    label: "信用分是怎么算出来的？",
    children: (
      <p>
        贝叶斯加权平均：信用分 =（平均分 × 评价数 + 50 × 5）÷（评价数 +
        5）。避免"一条满分评价 = 100 分"的假象——评价人数越多，分数越接近真实水平。
      </p>
    ),
  },
  {
    key: "edit",
    label: "评价写错了能改吗？",
    children: (
      <p>
        可以改，不能删。同一钱包对同一 Agent 再次提交评价会覆盖旧评价，链上只保留你的最新一条。
      </p>
    ),
  },
  {
    key: "data",
    label: "评价数据存在哪里？",
    children: (
      <p>
        双写两份：AgentReputationHub 合约（聚合统计）+ 官方 ERC-8004
        ReputationRegistry（生态通用的声誉层）。任何人都可以链上验证，不依赖我们的服务器。
      </p>
    ),
  },
];

export default function Faq() {
  return (
    <div>
      <Typography.Title level={4} style={{ color: "#EAECEF", fontWeight: 600 }}>
        常见问题
      </Typography.Title>
      <Collapse
        ghost
        items={ITEMS.map((it) => ({
          key: it.key,
          label: <span style={{ color: "#EAECEF" }}>{it.label}</span>,
          children: <div style={{ color: "#848E9C", fontSize: 13 }}>{it.children}</div>,
        }))}
        style={{ background: "transparent" }}
      />
    </div>
  );
}
