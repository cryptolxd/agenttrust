"use client";

import { Button, Dropdown, App } from "antd";
import { WalletOutlined, DisconnectOutlined } from "@ant-design/icons";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

function short(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

const pillStyle: React.CSSProperties = { borderRadius: 20, fontWeight: 500 };

export default function ConnectButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { t } = useT();
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { message } = App.useApp();

  if (!mounted) {
    return <Button style={pillStyle} icon={<WalletOutlined />} loading />;
  }

  if (!isConnected || !address) {
    const connector = connectors[0];
    return (
      <Button
        type="primary"
        style={pillStyle}
        icon={<WalletOutlined />}
        loading={isPending}
        onClick={() => {
          if (!connector) {
            message.warning(t("nav.noWallet"));
            return;
          }
          connect({ connector });
        }}
      >
        {t("nav.connect")}
      </Button>
    );
  }

  if (chainId !== bsc.id) {
    return (
      <Button danger style={pillStyle} onClick={() => switchChain({ chainId: bsc.id })}>
        {t("nav.switchChain")}
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
            label: t("nav.disconnect"),
            onClick: () => disconnect(),
          },
        ],
      }}
    >
      <Button style={pillStyle} icon={<WalletOutlined />}>
        {short(address)}
      </Button>
    </Dropdown>
  );
}
