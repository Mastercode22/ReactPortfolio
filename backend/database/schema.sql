-- ============================================================
-- Portfolio CMS Database Schema
-- MySQL 8+ | InnoDB | utf8mb4
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `portfolio_cms`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `portfolio_cms`;

-- ─── Admins ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `admins` (
  `id`               INT AUTO_INCREMENT PRIMARY KEY,
  `name`             VARCHAR(255) NOT NULL,
  `email`            VARCHAR(255) NOT NULL UNIQUE,
  `password`         VARCHAR(255) NOT NULL,
  `auth_token`       VARCHAR(128) DEFAULT NULL,
  `token_expires_at` DATETIME     DEFAULT NULL,
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Site Settings ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key`   VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Navigation Items ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `navigation_items` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `label`      VARCHAR(100) NOT NULL,
  `path`       VARCHAR(255) NOT NULL,
  `is_external` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Hero Section ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `hero_sections` (
  `id`                  INT AUTO_INCREMENT PRIMARY KEY,
  `badge_text`          VARCHAR(255) DEFAULT NULL,
  `headline_1`          VARCHAR(255) DEFAULT NULL,
  `headline_2`          VARCHAR(255) DEFAULT NULL,
  `headline_3`          VARCHAR(255) DEFAULT NULL,
  `headline_4`          VARCHAR(255) DEFAULT NULL,
  `bio`                 TEXT DEFAULT NULL,
  `availability_text`   VARCHAR(255) DEFAULT NULL,
  `is_available`        TINYINT(1) NOT NULL DEFAULT 1,
  `cta_primary_text`    VARCHAR(100) DEFAULT 'Hire Me',
  `cta_primary_url`     VARCHAR(255) DEFAULT '/contact',
  `cta_secondary_text`  VARCHAR(100) DEFAULT 'View Projects',
  `cta_secondary_url`   VARCHAR(255) DEFAULT '/projects',
  `stat_1_label`        VARCHAR(100) DEFAULT NULL,
  `stat_1_value`        VARCHAR(50)  DEFAULT NULL,
  `stat_2_label`        VARCHAR(100) DEFAULT NULL,
  `stat_2_value`        VARCHAR(50)  DEFAULT NULL,
  `is_active`           TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── About Section ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `about_sections` (
  `id`                INT AUTO_INCREMENT PRIMARY KEY,
  `badge`             VARCHAR(255) DEFAULT NULL,
  `heading`           VARCHAR(255) DEFAULT NULL,
  `subheading`        VARCHAR(255) DEFAULT NULL,
  `profile_image`     VARCHAR(500) DEFAULT NULL,
  `name`              VARCHAR(255) DEFAULT NULL,
  `job_title`         VARCHAR(255) DEFAULT NULL,
  `location`          VARCHAR(255) DEFAULT NULL,
  `availability_text` VARCHAR(255) DEFAULT NULL,
  `is_available`      TINYINT(1) NOT NULL DEFAULT 1,
  `bio_paragraph_1`   TEXT DEFAULT NULL,
  `bio_paragraph_2`   TEXT DEFAULT NULL,
  `engineering_badge_1` VARCHAR(100) DEFAULT NULL,
  `engineering_badge_2` VARCHAR(100) DEFAULT NULL,
  `is_active`         TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── About Stats ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `about_stats` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `label`      VARCHAR(100) NOT NULL,
  `value`      VARCHAR(50)  NOT NULL,
  `icon_name`  VARCHAR(50)  DEFAULT NULL,
  `color_class` VARCHAR(100) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Services ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `services` (
  `id`             INT AUTO_INCREMENT PRIMARY KEY,
  `title`          VARCHAR(255) NOT NULL,
  `category`       VARCHAR(100) DEFAULT NULL,
  `icon_name`      VARCHAR(50)  DEFAULT NULL,
  `grid_size`      VARCHAR(100) DEFAULT 'col-span-12 md:col-span-6',
  `description`    TEXT DEFAULT NULL,
  `gradient_class` VARCHAR(255) DEFAULT NULL,
  `sort_order`     INT NOT NULL DEFAULT 0,
  `is_published`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Service Features ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `service_features` (
  `id`           INT AUTO_INCREMENT PRIMARY KEY,
  `service_id`   INT NOT NULL,
  `feature_text` VARCHAR(255) NOT NULL,
  `sort_order`   INT NOT NULL DEFAULT 0,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE,
  INDEX `idx_service` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Technologies (Tech Stack) ──────────────────────────────
CREATE TABLE IF NOT EXISTS `technologies` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(100) NOT NULL,
  `category`    VARCHAR(100) DEFAULT NULL,
  `icon_key`    VARCHAR(50)  DEFAULT NULL,
  `color`       VARCHAR(20)  DEFAULT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `level`       INT NOT NULL DEFAULT 80,
  `sort_order`  INT NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Projects ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `projects` (
  `id`           INT AUTO_INCREMENT PRIMARY KEY,
  `slug`         VARCHAR(255) NOT NULL UNIQUE,
  `title`        VARCHAR(255) NOT NULL,
  `subtitle`     VARCHAR(500) DEFAULT NULL,
  `category`     VARCHAR(100) DEFAULT NULL,
  `description`  TEXT DEFAULT NULL,
  `challenges`   TEXT DEFAULT NULL,
  `solutions`    TEXT DEFAULT NULL,
  `architecture` VARCHAR(500) DEFAULT NULL,
  `image`        VARCHAR(500) DEFAULT NULL,
  `live_demo`    VARCHAR(500) DEFAULT NULL,
  `github_url`   VARCHAR(500) DEFAULT NULL,
  `is_featured`  TINYINT(1) NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order`   INT NOT NULL DEFAULT 0,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug`      (`slug`),
  INDEX `idx_featured`  (`is_featured`),
  INDEX `idx_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Project Images ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `project_images` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `project_id`  INT NOT NULL,
  `image_path`  VARCHAR(500) NOT NULL,
  `sort_order`  INT NOT NULL DEFAULT 0,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Project Features ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `project_features` (
  `id`           INT AUTO_INCREMENT PRIMARY KEY,
  `project_id`   INT NOT NULL,
  `feature_text` VARCHAR(500) NOT NULL,
  `sort_order`   INT NOT NULL DEFAULT 0,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Project Technologies ───────────────────────────────────
CREATE TABLE IF NOT EXISTS `project_technologies` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `project_id`  INT NOT NULL,
  `tech_name`   VARCHAR(100) NOT NULL,
  `sort_order`  INT NOT NULL DEFAULT 0,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Project Performance Stats ──────────────────────────────
CREATE TABLE IF NOT EXISTS `project_performance_stats` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `project_id`  INT NOT NULL,
  `label`       VARCHAR(100) NOT NULL,
  `value`       VARCHAR(100) NOT NULL,
  `sort_order`  INT NOT NULL DEFAULT 0,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Experience ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `experience` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `role`        VARCHAR(255) NOT NULL,
  `company`     VARCHAR(255) NOT NULL,
  `location`    VARCHAR(255) DEFAULT NULL,
  `type`        VARCHAR(50)  DEFAULT NULL,
  `period`      VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `sort_order`  INT NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Experience Achievements ────────────────────────────────
CREATE TABLE IF NOT EXISTS `experience_achievements` (
  `id`                INT AUTO_INCREMENT PRIMARY KEY,
  `experience_id`     INT NOT NULL,
  `achievement_text`  TEXT NOT NULL,
  `sort_order`        INT NOT NULL DEFAULT 0,
  FOREIGN KEY (`experience_id`) REFERENCES `experience`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Experience Skills ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS `experience_skills` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `experience_id` INT NOT NULL,
  `skill_name`    VARCHAR(100) NOT NULL,
  `sort_order`    INT NOT NULL DEFAULT 0,
  FOREIGN KEY (`experience_id`) REFERENCES `experience`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Certifications ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `certifications` (
  `id`               INT AUTO_INCREMENT PRIMARY KEY,
  `title`            VARCHAR(255) NOT NULL,
  `issuer`           VARCHAR(255) DEFAULT NULL,
  `issue_date`       VARCHAR(100) DEFAULT NULL,
  `credential_id`    VARCHAR(100) DEFAULT NULL,
  `icon_name`        VARCHAR(50)  DEFAULT NULL,
  `verification_url` VARCHAR(500) DEFAULT NULL,
  `description`      TEXT DEFAULT NULL,
  `sort_order`       INT NOT NULL DEFAULT 0,
  `is_active`        TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Testimonials ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id`           INT AUTO_INCREMENT PRIMARY KEY,
  `name`         VARCHAR(255) NOT NULL,
  `role`         VARCHAR(255) DEFAULT NULL,
  `company`      VARCHAR(255) DEFAULT NULL,
  `avatar`       VARCHAR(500) DEFAULT NULL,
  `quote`        TEXT NOT NULL,
  `stars`        TINYINT(1) NOT NULL DEFAULT 5,
  `sort_order`   INT NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Contact Settings ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `contact_settings` (
  `id`                INT AUTO_INCREMENT PRIMARY KEY,
  `email`             VARCHAR(255) DEFAULT NULL,
  `phone`             VARCHAR(50)  DEFAULT NULL,
  `location`          VARCHAR(255) DEFAULT NULL,
  `whatsapp`          VARCHAR(50)  DEFAULT NULL,
  `timezone_label`    VARCHAR(100) DEFAULT NULL,
  `availability_text` VARCHAR(255) DEFAULT NULL,
  `map_embed_url`     VARCHAR(1000) DEFAULT NULL,
  `map_address_url`   VARCHAR(1000) DEFAULT NULL,
  `is_active`         TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Social Links ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `social_links` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `platform`   VARCHAR(50)  NOT NULL,
  `url`        VARCHAR(500) NOT NULL,
  `icon_name`  VARCHAR(50)  DEFAULT NULL,
  `label`      VARCHAR(100) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── CV Files ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `cv_files` (
  `id`                INT AUTO_INCREMENT PRIMARY KEY,
  `filename`          VARCHAR(255) NOT NULL,
  `original_filename` VARCHAR(255) NOT NULL,
  `file_path`         VARCHAR(500) NOT NULL,
  `mime_type`         VARCHAR(100) NOT NULL,
  `file_size`         INT NOT NULL DEFAULT 0,
  `version`           INT NOT NULL DEFAULT 1,
  `is_active`         TINYINT(1) NOT NULL DEFAULT 0,
  `uploaded_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── CV Downloads ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `cv_downloads` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `cv_id`         INT NOT NULL,
  `downloaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_agent`    VARCHAR(500) DEFAULT NULL,
  `ip_address`    VARCHAR(45)  DEFAULT NULL,
  FOREIGN KEY (`cv_id`) REFERENCES `cv_files`(`id`) ON DELETE CASCADE,
  INDEX `idx_cv_id`   (`cv_id`),
  INDEX `idx_date`    (`downloaded_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Media ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `media` (
  `id`                INT AUTO_INCREMENT PRIMARY KEY,
  `filename`          VARCHAR(255) NOT NULL,
  `original_filename` VARCHAR(255) NOT NULL,
  `file_path`         VARCHAR(500) NOT NULL,
  `public_url`        VARCHAR(500) NOT NULL,
  `mime_type`         VARCHAR(100) NOT NULL,
  `file_size`         INT NOT NULL DEFAULT 0,
  `width`             INT DEFAULT NULL,
  `height`            INT DEFAULT NULL,
  `alt_text`          VARCHAR(255) DEFAULT NULL,
  `created_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Contact Messages ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`           INT AUTO_INCREMENT PRIMARY KEY,
  `name`         VARCHAR(150) NOT NULL,
  `email`        VARCHAR(255) NOT NULL,
  `subject`      VARCHAR(255) DEFAULT NULL,
  `message`      TEXT NOT NULL,
  `phone`        VARCHAR(50) DEFAULT NULL,
  `company`      VARCHAR(150) DEFAULT NULL,
  `project_type` VARCHAR(100) DEFAULT NULL,
  `status`       VARCHAR(30) NOT NULL DEFAULT 'unread',
  `is_read`      TINYINT(1) NOT NULL DEFAULT 0,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

