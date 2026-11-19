-- AgentTrust 索引器数据库（MySQL 8.x）
CREATE DATABASE IF NOT EXISTS agent_trust
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE agent_trust;

-- 每个 (agent_id, reviewer) 仅一条最新评价，与合约"覆盖更新"语义一致
CREATE TABLE IF NOT EXISTS reviews (
  agent_id    VARCHAR(78)  NOT NULL,
  reviewer    VARCHAR(42)  NOT NULL,
  score       TINYINT UNSIGNED NOT NULL,
  tag         VARCHAR(64)  NOT NULL DEFAULT '',
  comment_uri VARCHAR(512) NOT NULL DEFAULT '',
  tx_hash     VARCHAR(66)  NOT NULL,
  block_number BIGINT UNSIGNED NOT NULL,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked     TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (agent_id, reviewer),
  KEY idx_agent (agent_id),
  KEY idx_block (block_number)
) ENGINE = InnoDB;

-- 索引进度
CREATE TABLE IF NOT EXISTS indexer_state (
  id          TINYINT PRIMARY KEY,
  last_block  BIGINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE = InnoDB;

INSERT IGNORE INTO indexer_state (id, last_block) VALUES (1, 0);
