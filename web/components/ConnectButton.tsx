"use client";

import { Button, Dropdown, App } from "antd";
import { WalletOutlined, DisconnectOutlined } from "@ant-design/icons";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { useEffect, useState } from "react";

function short(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ConnectButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { message } = App.useApp();

  if (!mounted) {
    return <Button icon={<WalletOutlined />} loading />;
  }

  if (!isConnected || !address) {
    const connector = connectors[0];
    return (
      <Button
        type="primary"
        icon={<WalletOutlined />}
        loading={isPending}
        onClick={() => {
          if (!connector) {
            message.warning("未检测到钱包，请在币安 App Web3 浏览器或币安钱包插件中打开");
            return;
          }
          connect({ connector });
        }}
      >
        连接钱包
      </Button>
    );
  }

  if (chainId !== bsc.id) {
    return (
      <Button danger onClick={() => switchChain({ chainId: bsc.id })}>
        切换到 BNB Chain
      </Button>
    );
  }

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "disconnect",
            icon: <DisconnectOutlined />,
            label: "断开连接",
            onClick: () => disconnect(),
          },
        ],
      }}
    >
      <Button icon={<WalletOutlined />}>{short(address)}</Button>
    </Dropdown>
  );
}
