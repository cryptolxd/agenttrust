// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @dev 测试用 mock：模拟 ERC-8004 IdentityRegistry 的最小接口
contract MockIdentityRegistry {
    mapping(uint256 => address) private _owners;
    uint256 public totalSupply;

    function register(address owner) external returns (uint256 agentId) {
        agentId = ++totalSupply;
        _owners[agentId] = owner;
    }

    function exists(uint256 agentId) external view returns (bool) {
        return _owners[agentId] != address(0);
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        require(_owners[tokenId] != address(0), "nonexistent token");
        return _owners[tokenId];
    }
}

/// @dev 测试用 mock：记录 giveFeedback 调用次数
contract MockReputationRegistry {
    uint256 public feedbackCount;

    function giveFeedback(
        uint256,
        int128,
        uint8,
        string calldata,
        string calldata,
        string calldata,
        string calldata,
        bytes32
    ) external {
        feedbackCount++;
    }
}

/// @dev 测试用 mock：giveFeedback 永远失败，验证 try/catch 不阻塞主流程
contract RevertingReputationRegistry {
    function giveFeedback(
        uint256,
        int128,
        uint8,
        string calldata,
        string calldata,
        string calldata,
        string calldata,
        bytes32
    ) external pure {
        revert("registry unavailable");
    }
}

/// @dev 测试用 mock：模拟 Binance Agent ID（ERC-721 balanceOf）
contract MockAgentID {
    mapping(address => uint256) public balanceOf;

    function mint(address to) external {
        balanceOf[to] = 1;
    }
}
