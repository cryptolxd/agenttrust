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
import { useT } from "@/lib/i18n";

const TAGS = ["trading", "payment", "defi", "social", "slow", "scam"];

export default function ReviewForm({
  agentId,
  onSuccess,
}: {
  agentId: bigint;
  onSuccess?: () => void;
}) {
  const { t } = useT();
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
      message.success(t("review.success"));
      onSuccess?.();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) message.error(error.message.slice(0, 120));
  }, [error]);

  if (!HUB_ADDRESS) {
    return (
      <Alert type="warning" showIcon message={t("review.notDeployed")} />
    );
  }

  if (isConnected && !checkingAgentId && !hasAgentID) {
    return (
      <Card title={t("review.title")} size="small">
        <Alert
          type="warning"
          showIcon
          message={t("review.noAgentId.title")}
          description={t("review.noAgentId.desc")}
        />
      </Card>
    );
  }

  return (
    <Card title={t("review.title")} size="small">
      {!isConnected && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message={t("review.connectHint")}
        />
      )}
      <Form
        layout="vertical"
        disabled={!isConnected || checkingAgentId || isPending || confirming}
        initialValues={{ score: 80, tag: "trading", forward: true }}
        onFinish={(values) => {
          message.info(t("review.walletPrompt"));
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
        <Form.Item name="score" label={t("review.score")} rules={[{ required: true }]}>
          <Slider min={1} max={100} marks={{ 1: "1", 50: "50", 100: "100" }} />
        </Form.Item>
        <Form.Item name="tag" label={t("review.tag")} rules={[{ required: true }]}>
          <Select options={TAGS.map((v) => ({ value: v, label: v }))} />
        </Form.Item>
        <Form.Item name="commentURI" label={t("review.comment")}>
          <Input placeholder="https:// 或 ipfs://" />
        </Form.Item>
        <Form.Item
          name="forward"
          label={t("review.forward")}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={isPending || confirming} style={{ borderRadius: 20, fontWeight: 500 }}>
          {confirming ? t("review.confirming") : t("review.submit")}
        </Button>
      </Form>
    </Card>
  );
}
