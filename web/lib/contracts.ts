export const HUB_ADDRESS = (process.env.NEXT_PUBLIC_HUB_ADDRESS ||
  "") as `0x${string}`;

export const IDENTITY_REGISTRY = (process.env.NEXT_PUBLIC_IDENTITY_REGISTRY ||
  "0xfA09B3397fAC75424422C4D28b1729E3D4f659D7") as `0x${string}`;

export const REPUTATION_REGISTRY = (process.env
  .NEXT_PUBLIC_REPUTATION_REGISTRY ||
  "0x17860530385Bdde7992c4Da71B9ec7791E474C08") as `0x${string}`;

// Binance Agentic Wallet 的链上名字（SPACE ID Agent ID，ERC-721，不可转让，一个 KYC 一个）
export const AGENT_ID_CONTRACT = (process.env.NEXT_PUBLIC_AGENT_ID_CONTRACT ||
  "0x60b9262456de011f7d15a54cdd8c48baaa8b022f") as `0x${string}`;

export const AGENT_ID_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const HUB_ABI = [
  {
    name: "submitReview",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "score", type: "uint8" },
      { name: "tag", type: "string" },
      { name: "commentURI", type: "string" },
      { name: "forwardToRegistry", type: "bool" },
    ],
    outputs: [],
  },
  {
    name: "averageScore",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [
      { name: "avg", type: "uint256" },
      { name: "count", type: "uint256" },
    ],
  },
  {
    name: "getReviewers",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "offset", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    outputs: [
      { name: "out", type: "address[]" },
      { name: "total", type: "uint256" },
    ],
  },
  {
    name: "getReview",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "reviewer", type: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "score", type: "uint8" },
          { name: "tag", type: "string" },
          { name: "commentURI", type: "string" },
          { name: "updatedAt", type: "uint40" },
          { name: "exists", type: "bool" },
        ],
      },
    ],
  },
  {
    name: "ReviewSubmitted",
    type: "event",
    inputs: [
      { name: "agentId", type: "uint256", indexed: true },
      { name: "reviewer", type: "address", indexed: true },
      { name: "score", type: "uint8", indexed: false },
      { name: "tag", type: "string", indexed: false },
      { name: "commentURI", type: "string", indexed: false },
    ],
  },
] as const;

export const IDENTITY_ABI = [
  {
    name: "exists",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getAgentWallet",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
] as const;
