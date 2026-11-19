"use client";

import { Card, Form, Slider, Select, Input, Button, App, Alert, Switch } from "antd";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect } from "react";
import { HUB_ADDRESS, HUB_ABI, AGENT_ID_CONTRACT, AGENT_ID_ABI } from "@/lib/contracts";

const TAGS = ["trading", "payment", "defi", "social", "slow", "scam"];

export default function ReviewForm({
  agentId,
  onSuccess,
}: {
  agentId: bigint;
  onSuccess?: () => void;
}) {
  const { address, isConnected } = useAccount();
  const { data: agentIdBalance, isLoading: checkingAgentId } = useReadContract({
    address: AGENT_ID_CONTRACT,
    abi: AGENT_ID_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });
  const hasAgentID = !!agentIdBalance && agentIdBalance > 0n;
  const { message } = App.useApp();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      message.success("评价已上链");
      onSuccess?.();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) message.error(`交易失败：${error.message.slice(0, 120)}`);
  }, [error]);

  if (!HUB_ADDRESS) {
    return (
      <Alert type="warning" showIcon message="评价合约尚未部署，暂时只能查分。" />
    );
  }

  if (isConnected && !checkingAgentId && !hasAgentID) {
    return (
      <Card title="写评价" size="small">
        <Alert
          type="warning"
          showIcon
          message="你还没有 Agent ID"
          description={
            <>
              评价功能仅对 Agent ID 持有者开放（一个 KYC 一个，防刷评）。领取方式：
              打开币安 App → 钱包 → 首页横幅 → Agent ID，领取后回到本页刷新即可。
            </>
          }
        />
      </Card>
    );
  }

  return (
    <Card title="写评价" size="small">
      {!isConnected && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="请先连接币安钱包。提交时会弹出钱包确认窗口，由你亲手签名。"
        />
      )}
      <Form
        layout="vertical"
        disabled={!isConnected || checkingAgentId || isPending || confirming}
        initialValues={{ score: 80, tag: "trading", forward: true }}
        onFinish={(values) => {
          message.info("请在币安钱包中确认这笔交易");
          writeContract({
            address: HUB_ADDRESS,
            abi: HUB_ABI,
            functionName: "submitReview",
            args: [
              agentId,
              values.score,
              values.tag,
              values.commentURI || "",
              values.forward,
            ],
          });
        }}
      >
        <Form.Item name="score" label="评分（1-100）" rules={[{ required: true }]}>
          <Slider min={1} max={100} marks={{ 1: "1", 50: "50", 100: "100" }} />
        </Form.Item>
        <Form.Item name="tag" label="标签" rules={[{ required: true }]}>
          <Select options={TAGS.map((t) => ({ value: t, label: t }))} />
        </Form.Item>
        <Form.Item name="commentURI" label="评论链接（可选，IPFS / HTTPS）">
          <Input placeholder="https:// 或 ipfs://" />
        </Form.Item>
        <Form.Item
          name="forward"
          label="同步写入 ERC-8004 官方声誉注册表"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={isPending || confirming}>
          {confirming ? "等待区块确认..." : "提交评价（钱包确认）"}
        </Button>
      </Form>
    </Card>
  );
}
