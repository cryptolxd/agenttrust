// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IIdentityRegistry {
    function exists(uint256 agentId) external view returns (bool);

    function ownerOf(uint256 tokenId) external view returns (address);
}

interface IReputationRegistry {
    function giveFeedback(
        uint256 agentId,
        int128 value,
        uint8 valueDecimals,
        string calldata tag1,
        string calldata tag2,
        string calldata endpoint,
        string calldata feedbackURI,
        bytes32 feedbackHash
    ) external;
}

/// @dev Binance Agentic Wallet 的链上名字（SPACE ID Agent ID，ERC-721，不可转让，一个 KYC 一个）
interface IAgentID {
    function balanceOf(address owner) external view returns (uint256);
}

/// @title AgentReputationHub
/// @notice 面向 ERC-8004 Agent 的信用评价聚合合约，以 Binance Agent ID 作为评价者准入：
///         只有持有 Agent ID（一个 KYC 一个）的地址才能提交评价，一人一票抗女巫。
///         评价可同步转发至官方 ERC-8004 ReputationRegistry。
contract AgentReputationHub {
    uint8 public constant MIN_SCORE = 1;
    uint8 public constant MAX_SCORE = 100;

    IIdentityRegistry public immutable identityRegistry;
    IReputationRegistry public immutable reputationRegistry;
    IAgentID public immutable agentID;

    struct Review {
        uint8 score;
        string tag;
        string commentURI;
        uint40 updatedAt;
        bool exists;
    }

    /// @dev agentId => reviewer => review。每人对每个 Agent 仅一条有效评价，可覆盖更新。
    mapping(uint256 => mapping(address => Review)) public reviews;
    mapping(uint256 => uint256) public totalScore;
    mapping(uint256 => uint256) public reviewCount;

    mapping(uint256 => address[]) private _reviewers;

    event ReviewSubmitted(
        uint256 indexed agentId,
        address indexed reviewer,
        uint8 score,
        string tag,
        string commentURI
    );
    event ReviewUpdated(
        uint256 indexed agentId,
        address indexed reviewer,
        uint8 score,
        string tag,
        string commentURI
    );

    error AgentNotFound(uint256 agentId);
    error ScoreOutOfRange(uint8 score);
    /// @dev 禁止给自己的 Agent 刷好评
    error SelfReviewNotAllowed(uint256 agentId);
    error ReviewNotFound(uint256 agentId, address reviewer);
    /// @dev 评价者必须持有 Binance Agent ID（黑客松要求实际使用 Agent ID；也是一人一票的抗女巫基础）
    error NoAgentID(address reviewer);

    constructor(
        address identityRegistry_,
        address reputationRegistry_,
        address agentID_
    ) {
        require(identityRegistry_ != address(0), "identity registry = 0");
        require(reputationRegistry_ != address(0), "reputation registry = 0");
        require(agentID_ != address(0), "agent id = 0");
        identityRegistry = IIdentityRegistry(identityRegistry_);
        reputationRegistry = IReputationRegistry(reputationRegistry_);
        agentID = IAgentID(agentID_);
    }

    /// @notice 提交或更新对某个 Agent 的评价（仅 Agent ID 持有者）
    /// @param agentId ERC-8004 Agent ID（IdentityRegistry 的 tokenId）
    /// @param score 1-100
    /// @param tag 评价标签，如 "trading" / "payment" / "scam"
    /// @param commentURI 评论内容 URI（IPFS / HTTPS），可为空
    /// @param forwardToRegistry 是否同步写入官方 ERC-8004 ReputationRegistry（失败不回滚主流程）
    function submitReview(
        uint256 agentId,
        uint8 score,
        string calldata tag,
        string calldata commentURI,
        bool forwardToRegistry
    ) external {
        if (agentID.balanceOf(msg.sender) == 0) revert NoAgentID(msg.sender);
        if (!identityRegistry.exists(agentId)) revert AgentNotFound(agentId);
        if (score < MIN_SCORE || score > MAX_SCORE) revert ScoreOutOfRange(score);
        if (identityRegistry.ownerOf(agentId) == msg.sender)
            revert SelfReviewNotAllowed(agentId);

        Review storage r = reviews[agentId][msg.sender];
        if (r.exists) {
            totalScore[agentId] = totalScore[agentId] - r.score + score;
            r.score = score;
            r.tag = tag;
            r.commentURI = commentURI;
            r.updatedAt = uint40(block.timestamp);
            emit ReviewUpdated(agentId, msg.sender, score, tag, commentURI);
        } else {
            reviews[agentId][msg.sender] = Review({
                score: score,
                tag: tag,
                commentURI: commentURI,
                updatedAt: uint40(block.timestamp),
                exists: true
            });
            totalScore[agentId] += score;
            reviewCount[agentId] += 1;
            _reviewers[agentId].push(msg.sender);
            emit ReviewSubmitted(agentId, msg.sender, score, tag, commentURI);
        }

        if (forwardToRegistry) {
            // 官方注册表失败（如限流/权限）不影响本地聚合，只损失 canonical 副本
            try
                reputationRegistry.giveFeedback(
                    agentId,
                    int128(uint128(score)),
                    0,
                    tag,
                    "agent-trust-hub",
                    "",
                    commentURI,
                    bytes32(0)
                )
            {} catch {}
        }
    }

    function averageScore(uint256 agentId)
        external
        view
        returns (uint256 avg, uint256 count)
    {
        count = reviewCount[agentId];
        avg = count == 0 ? 0 : totalScore[agentId] / count;
    }

    function getReview(uint256 agentId, address reviewer)
        external
        view
        returns (Review memory)
    {
        if (!reviews[agentId][reviewer].exists)
            revert ReviewNotFound(agentId, reviewer);
        return reviews[agentId][reviewer];
    }

    function getReviewers(
        uint256 agentId,
        uint256 offset,
        uint256 limit
    ) external view returns (address[] memory out, uint256 total) {
        total = _reviewers[agentId].length;
        if (offset >= total) return (new address[](0), total);
        uint256 end = offset + limit;
        if (end > total) end = total;
        out = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            out[i - offset] = _reviewers[agentId][i];
        }
    }
}
