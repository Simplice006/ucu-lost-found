-- UCU Campus Lost-and-Found: database schema (MySQL 8 / TiDB MySQL-compatible)
-- Run this file once on an empty database. It is safe to re-run (DROP IF EXISTS).

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt hash, never plain text',
  role          ENUM('student','admin') NOT NULL DEFAULT 'student' COMMENT 'User role',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Server-side sessions: logging out DELETES the row, so the token stops working at once.
CREATE TABLE sessions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  token_hash  CHAR(64) NOT NULL UNIQUE COMMENT 'SHA-256 of the token, raw token is never stored',
  expires_at  DATETIME NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_expires (expires_at)
);

CREATE TABLE reports (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  type            ENUM('lost','found') NOT NULL,
  title           VARCHAR(120) NOT NULL,
  category        VARCHAR(50)  NOT NULL,
  description     TEXT NOT NULL COMMENT 'PUBLIC',
  private_details TEXT NULL COMMENT 'Reporter and admin ONLY (found items)',
  event_date      DATE NOT NULL,
  location        VARCHAR(100) NOT NULL,
  photo_url       VARCHAR(500) NULL,
  status          ENUM('open','returned') NOT NULL DEFAULT 'open' COMMENT 'open = not collected, returned = given back',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_type (type),
  INDEX idx_category (category),
  INDEX idx_location (location),
  INDEX idx_event_date (event_date),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_status_type (status, type)
);

CREATE TABLE claims (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  report_id     INT NOT NULL,
  claimant_id   INT NOT NULL,
  evidence      TEXT NOT NULL COMMENT 'PRIVATE: claimant and admin only',
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  admin_reason  VARCHAR(500) NULL,
  reviewed_by   INT NULL,
  reviewed_at   DATETIME NULL,
  returned_at   DATETIME NULL COMMENT 'Set only when collection is confirmed',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Database-level guarantee: at most ONE approved claim per report.
  approved_report_id INT GENERATED ALWAYS AS (IF(status = 'approved', report_id, NULL)) STORED,
  UNIQUE KEY uniq_one_approved_per_report (approved_report_id),
  FOREIGN KEY (report_id)   REFERENCES reports(id),
  FOREIGN KEY (claimant_id) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id),
  INDEX idx_claim_report (report_id),
  INDEX idx_claim_claimant (claimant_id),
  INDEX idx_claim_status (status)
);