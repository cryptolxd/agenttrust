import { createPublicClient, http } from "viem";
import { bsc, bscTestnet } from "viem/chains";

const isTestnet = process.env.NEXT_PUBLIC_CHAIN_ID === "97";

export const publicClient = createPublicClient({
  chain: isTestnet ? bscTestnet : bsc,
  transport: http(
    process.env.BSC_RPC_URL || process.env.NEXT_PUBLIC_BSC_RPC_URL || undefined
  ),
});
