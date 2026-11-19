# AgentTrust — BNB 链上 Agent 信用分

> Binance Wallet × BNB Chain Agent ID 黑客松参赛作品
> 提交窗口：2026-11-18 16:00 ~ 2026-12-09 16:00（东八区）
> 官方公告：https://www.binance.com/zh-CN/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf

## 一句话介绍

给 BNB 链上每个 ERC-8004 Agent 算一个公开、可验证的信用分——与陌生 Agent 交易之前，先查分。
**只有持有 Binance Agent ID 的用户才能写评价**：一个 KYC 一个 Agent ID，一人一票，天然抗女巫。

## Agent ID 使用说明（报名材料直接用）

- Agent ID 合约（BSC 主网）：`0x60b9262456de011f7d15a54cdd8c48baaa8b022f`（SPACE ID Agent ID，ERC-721，不可转让，一个 KYC 仅能领取一个）
- **集成方式**：`AgentReputationHub.submitReview` 第一行即校验 `IAgentID.balanceOf(msg.sender) > 0`，无 Agent ID 的地址直接 revert（`NoAgentID`）
- **产品价值**：评价者身份 = 经过币安 KYC 的真人，信用分不可被批量小号污染；同时每笔评价交易都来自 Agent ID 持有地址，直接贡献生态交互数据
- **用户引导**：前端检测钱包无 Agent ID 时，提示"币安 App → 钱包 → 首页横幅 → Agent ID"领取路径

## 产品逻辑

- **查分**：输入 ERC-8004 Agent ID → 身份信息（owner / 注册 URI）+ 信任评分（贝叶斯加权）+ 评价明细
- **评分**：Agent ID 持有者连接币安钱包，对用过的 Agent 打分（1-100）+ 标签 + 评论 URI，**每笔交易均由用户在币安钱包中逐笔确认**
- **双写**：评价同时存入本项目 `AgentReputationHub` 合约（聚合统计）与官方 ERC-8004 `ReputationRegistry`（canonical 声誉层）

## 对齐评审标准（创新奖 100 分制）

| 维度 | 权重 | 我们的对应 |
|---|---|---|
| Agent ID 应用深度 | 30% | Agent ID 是评价准入的硬门控，融入核心业务流，不是贴皮 |
| 实用性与合理性 | 25% | 解决"与陌生 Agent 交易前无法判断可信度"的真实需求 |
| 产品完成度 | 25% | 合约 + 前端 + 索引器全栈上线，可查可评 |
| 创新性 | 20% | 首个把 Agent ID 用作"链上声誉一人一票"抗女巫身份的应用 |

⚠️ 创新奖参评门槛：**活动期内至少 30 个 Agent ID 地址与参赛合约交互过**——上线后要重点拉真实用户评价。

## 合规设计（对应官方安全红线）

| 红线 | 我们的设计 |
|---|---|
| 不得网页扫码登录 / 存会话代下单 | 仅注入式钱包连接（币安 App Web3 浏览器 / 钱包插件），服务端零会话零私钥 |
| 不得绕过用户确认交易 | 每笔评价/更新都触发钱包确认弹窗，无 meta-tx / 代付 |
| 不得无感转移资产 | 合约无任何转账/授权逻辑，只写评价数据 |
| 合约开源 + 披露 owner 权限 | 合约无 owner、无管理员函数、不可升级、无增发/暂停/冻结权限——源码 BscScan 验证，权限说明即本节 |
| 不得冒用币安品牌 | 独立品牌 AgentTrust，仅注明 "Built on BNB Chain" |
| 不得收集助记词/私钥/API Secret/配对码 | 前端无任何此类输入框 |
| 不得承诺收益 | 全站无收益类表述 |
| 不做"按名字查钱包"工具 | 产品按 ERC-8004 Agent ID 查 Agent 的社区评价，不提供按名字反查个人钱包的功能 |

## 目录结构

```
contracts/   Hardhat + Solidity：AgentReputationHub（部署 BSC，BscScan 验证开源）
web/         Next.js 14 + wagmi + Ant Design：查分 / 评分前端（响应式 + 深色模式）
indexer/     Node + MySQL 8：扫描链上评价事件，聚合排行榜数据
docs/        传播奖帖子草稿（含已发布记录）
```

## 快速开始

### 1. 合约

```bash
cd contracts
cp .env.example .env   # 填 DEPLOYER_PRIVATE_KEY / BSCSCAN_API_KEY
npm install
npm run compile
npm test
npm run deploy:bscTestnet   # 先测网验证（需自行部署 mock 注册表并在 .env 指定三个地址）
npm run deploy:bsc          # 主网（自动使用官方三个合约地址）
npm run verify:bsc -- <HUB_ADDRESS> <IDENTITY_REGISTRY> <REPUTATION_REGISTRY> <AGENT_ID>
```

BSC 主网官方合约：
- ERC-8004 IdentityRegistry: `0xfA09B3397fAC75424422C4D28b1729E3D4f659D7`
- ERC-8004 ReputationRegistry: `0x17860530385Bdde7992c4Da71B9ec7791E474C08`
- SPACE ID Agent ID: `0x60b9262456de011f7d15a54cdd8c48baaa8b022f`

### 2. 索引器

```bash
cd indexer
cp .env.example .env   # 填 DATABASE_URL (MySQL 8) / HUB_ADDRESS / START_BLOCK
mysql -u root -p < schema.sql
npm install && npm run build
npm start
```

### 3. 前端

```bash
cd web
cp .env.example .env.local   # 填 NEXT_PUBLIC_HUB_ADDRESS 等
npm install
npm run dev
```

## 主网部署信息

- **AgentReputationHub**：[`0xE269D575c0EDd8aa02078FC7Fb01053C17FC66dd`](https://bscscan.com/address/0xE269D575c0EDd8aa02078FC7Fb01053C17FC66dd)（BSC 主网，2026-11-19 部署，构造参数已链上核验）
- Deployer：`0xB12E0e43D448B31dC358bD4C4c2EFDDCE2B3f905`

## 提交清单（12/9 16:00 前）

- [x] 传播奖帖子 1 已发布（@jettyleex，2026-11-19）
- [x] 传播奖表单已提交（UID 102842448 + X 链接，提交成功）
- [x] 合约部署 BSC 主网
- [ ] BscScan 源码验证（需 BSCSCAN_API_KEY 填入 contracts/.env，然后跑 `npm run verify:bsc -- 0xE269D575c0EDd8aa02078FC7Fb01053C17FC66dd 0xfA09B3397fAC75424422C4D28b1729E3D4f659D7 0x17860530385Bdde7992c4Da71B9ec7791E474C08 0x60b9262456de011f7d15a54cdd8c48baaa8b022f`）
- [ ] 前端上线（Vercel），币安 App Web3 浏览器内实测
- [ ] 项目报名表提交（需币安登录 + 合约地址）：https://app.binance.com/uni-qr/user-survey/fb26d2bd25e04329b1ba77c7b3811d23
- [ ] 拉 ≥30 个 Agent ID 地址真实交互（创新奖门槛）
- [ ] Demo 视频（3 分钟内）
- [ ] 传播奖帖子 2（~11/25）/ 帖子 3（提交前）
- [ ] README 英文版
