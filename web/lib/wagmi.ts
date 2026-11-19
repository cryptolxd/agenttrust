import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// 合规要求：仅注入式钱包（币安 App Web3 浏览器 / 币安钱包插件），
// 不提供 WalletConnect 二维码等网页扫码登录方式。
export const wagmiConfig = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [injected()],
  transports: {
    [bsc.id]: http(process.env.NEXT_PUBLIC_BSC_RPC_URL || undefined),
    [bscTestnet.id]: http(),
  },
});

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 56);
