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

## 二、Agent ID 集成信息（已填）

**6. 请描述项目如何使用 Agent ID（3-5 句）**
AgentTrust 将 Agent ID 作为评价者准入与身份层：合约 AgentReputationHub.submitReview 第一行即校验 Agent ID 合约（0x60b9262456de011f7d15a54cdd8c48baaa8b022f）的 balanceOf(msg.sender) > 0，无 Agent ID 直接 revert。这保证每条 Agent 信用评价都来自经过币安 KYC 的真人（一个 KYC 一个 Agent ID），一人一票、天然抗女巫，让信用分无法被批量小号污染。前端检测到钱包无 Agent ID 时会引导用户到币安 App 领取。每笔评价交易都来自 Agent ID 持有地址，为 Agent ID 生态沉淀真实交互数据与声誉资产。

**7. 应用场景（多选）**：身份识别/身份验证 + 权限管理/访问控制
**8. 产品已上线？**：Yes

## 三、BNB Chain 合约信息（已填）

**9. 合约地址**：0xE269D575c0EDd8aa02078FC7Fb01053C17FC66dd
**10. BscScan 验证链接**：https://bscscan.com/address/0xE269D575c0EDd8aa02078FC7Fb01053C17FC66dd#code
**11. 已完成集成并产生链上交互？**：No（提交时诚实状态；交互起来后无需改表，链上数据自动统计）

## 四、项目展示材料

**12. 产品演示视频（必填）**：⚠️ 待录制，分镜脚本见 docs/demo-video-script.md
**13. 代码仓库**：https://github.com/cryptolxd/agenttrust ✅ 已填
**14. 其他补充材料**（选填）：可考虑放 README 英文版或本文件的链接
