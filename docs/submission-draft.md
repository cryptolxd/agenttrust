# 项目报名表答案（草稿，待填）

表单：https://app.binance.com/uni-qr/user-survey/fb26d2bd25e04329b1ba77c7b3811d23
截止：2026-12-09 16:00（东八区）

## 一、项目基本信息

**1. 项目名称**
AgentTrust

**2. 项目简介（1-3 句）**
AgentTrust 为 BNB 链上的 AI Agent（ERC-8004）提供公开可验证的信用分：只有持有 Binance Agent ID 的用户才能提交链上评价，一个 KYC 一票，天然抗女巫。它解决了用户与陌生 Agent 交易前"无法判断其可信度"的问题，所有评价实时写入链上声誉层，供全生态查询复用。

**3. 项目合约地址（BscScan 链接）**
https://bscscan.com/address/0xE269D575c0EDd8aa02078FC7Fb01053C17FC66dd
（AgentReputationHub，无 owner、无管理员函数、不可升级；部署后即完成源码验证开源——验证完成后勾选此项）

**4. 项目官网 / 产品入口**
（Vercel 部署完成后填入，如 https://agenttrust.vercel.app）

**5. 项目社交媒体链接（X）**
https://x.com/jettyleex

## 后续页面（预计：Agent ID 使用说明 / 团队 / 奖励接收地址）

**Agent ID 使用说明**
- 集成方式：AgentReputationHub.submitReview 第一行校验 Agent ID 合约（0x60b9262456de011f7d15a54cdd8c48baaa8b022f）的 balanceOf(msg.sender) > 0，无 Agent ID 直接 revert
- 应用场景：准入（只有 Agent ID 持有者可写评价）+ 身份（评价者 = 币安 KYC 真人，一人一票抗女巫）
- 前端引导：钱包无 Agent ID 时展示领取路径（币安 App → 钱包 → 首页横幅 → Agent ID）
- 每笔评价交易均来自 Agent ID 持有地址，直接贡献生态交互数据

**奖励接收地址**
（待定：建议用你常用的 BSC 地址，别用 deployer）

**合约 owner 权限披露**
合约无 owner、无管理员函数、不可升级、无资产托管逻辑；仅存储评价数据，任何人可验证。
