"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme as antdTheme, App as AntApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import { wagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();

// Binance 设计语言：近黑深底 + 单一币安黄强调 + 胶囊按钮 + 大留白
const binanceTheme = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: "#F0B90B",
    colorInfo: "#F0B90B",
    colorLink: "#F0B90B",
    colorBgBase: "#0B0E11",
    colorBgContainer: "#161A1E",
    colorBgElevated: "#1E2329",
    colorBorder: "#2B3139",
    colorBorderSecondary: "#1E2329",
    colorText: "#EAECEF",
    colorTextSecondary: "#848E9C",
    colorTextTertiary: "#5E6673",
    colorTextLightSolid: "#0B0E11",
    colorSuccess: "#2EBD85",
    colorError: "#F6465D",
    colorWarning: "#F0B90B",
    borderRadius: 8,
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`,
  },
  components: {
    Button: { borderRadius: 20, controlHeight: 38, fontWeight: 500 },
    Card: { colorBgContainer: "#161A1E" },
    Table: { colorBgContainer: "transparent", headerBg: "transparent" },
    Input: { colorBgContainer: "#0B0E11" },
    InputNumber: { colorBgContainer: "#0B0E11" },
    Select: { colorBgContainer: "#0B0E11" },
    Slider: { colorPrimaryBorder: "#F0B90B" },
    Tag: { borderRadiusSM: 12 },
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={zhCN} theme={binanceTheme}>
          <AntApp>{children}</AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
