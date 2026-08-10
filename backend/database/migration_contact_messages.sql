-- Safe Migration SQL for updating contact_messages table in production / InfinityFree / phpMyAdmin
-- Run this in your MySQL / phpMyAdmin database console.

USE `portfolio_cms`;

-- Add missing columns safely if they do not exist
ALTER TABLE `contact_messages`
  ADD COLUMN IF NOT EXISTS `phone` VARCHAR(50) DEFAULT NULL AFTER `message`,
  ADD COLUMN IF NOT EXISTS `company` VARCHAR(150) DEFAULT NULL AFTER `phone`,
  ADD COLUMN IF NOT EXISTS `project_type` VARCHAR(100) DEFAULT NULL AFTER `company`,
  ADD COLUMN IF NOT EXISTS `is_read` TINYINT(1) NOT NULL DEFAULT 0 AFTER `status`,
  ADD COLUMN IF NOT EXISTS `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- Modify status column to support all statuses ('unread', 'new', 'read', 'replied', 'archived')
ALTER TABLE `contact_messages`
  MODIFY COLUMN `status` VARCHAR(30) NOT NULL DEFAULT 'unread';

-- Add index on is_read if not already present
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'contact_messages' AND index_name = 'idx_is_read');
SET @sqlstmt := IF(@exist = 0, 'CREATE INDEX idx_is_read ON contact_messages(is_read)', 'SELECT "Index idx_is_read already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
