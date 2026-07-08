/*
 Navicat Premium Data Transfer

 Source Server         : VPS Hostinger
 Source Server Type    : MySQL
 Source Server Version : 80042
 Source Host           : 145.79.11.149:3306
 Source Schema         : disaster_intelligence

 Target Server Type    : MySQL
 Target Server Version : 80042
 File Encoding         : 65001

 Date: 24/05/2026 18:50:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for analytics_daily
-- ----------------------------
DROP TABLE IF EXISTS `analytics_daily`;
CREATE TABLE `analytics_daily` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tanggal` date DEFAULT NULL,
  `total_laporan` int DEFAULT '0',
  `total_warning` int DEFAULT '0',
  `total_darurat` int DEFAULT '0',
  `total_banjir` int DEFAULT '0',
  `total_abrasi` int DEFAULT '0',
  `total_rob` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of analytics_daily
-- ----------------------------
BEGIN;
INSERT INTO `analytics_daily` VALUES (1, '2026-05-24', 3, 2, 1, 2, 0, 1, '2026-05-24 11:48:29');
COMMIT;

-- ----------------------------
-- Table structure for audit_logs
-- ----------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` bigint DEFAULT NULL,
  `old_data` json DEFAULT NULL,
  `new_data` json DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of audit_logs
-- ----------------------------
BEGIN;
INSERT INTO `audit_logs` VALUES (1, 5, 'VALIDATE_REPORT', 'laporan_bencana', 3, NULL, NULL, '192.168.1.10', '2026-05-24 11:48:46');
INSERT INTO `audit_logs` VALUES (2, 4, 'SEND_WARNING', 'notifications', 1, NULL, NULL, '192.168.1.11', '2026-05-24 11:48:46');
COMMIT;

-- ----------------------------
-- Table structure for cv_analysis
-- ----------------------------
DROP TABLE IF EXISTS `cv_analysis`;
CREATE TABLE `cv_analysis` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `laporan_media_id` bigint DEFAULT NULL,
  `detected_object` varchar(255) DEFAULT NULL,
  `severity_level` varchar(50) DEFAULT NULL,
  `confidence_score` decimal(5,2) DEFAULT NULL,
  `raw_result` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `laporan_media_id` (`laporan_media_id`),
  CONSTRAINT `cv_analysis_ibfk_1` FOREIGN KEY (`laporan_media_id`) REFERENCES `laporan_media` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of cv_analysis
-- ----------------------------
BEGIN;
INSERT INTO `cv_analysis` VALUES (1, 1, 'Genangan Air', 'Sedang', 0.90, NULL, '2026-05-24 11:47:48');
INSERT INTO `cv_analysis` VALUES (2, 2, 'Tanggul Retak', 'Tinggi', 0.96, NULL, '2026-05-24 11:47:48');
COMMIT;

-- ----------------------------
-- Table structure for early_warning
-- ----------------------------
DROP TABLE IF EXISTS `early_warning`;
CREATE TABLE `early_warning` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `laporan_id` bigint DEFAULT NULL,
  `jenis_bencana_id` int DEFAULT NULL,
  `level_warning` enum('Siaga','Waspada','Awas') DEFAULT NULL,
  `wilayah` varchar(255) DEFAULT NULL,
  `pesan` text,
  `status` enum('aktif','selesai') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `laporan_id` (`laporan_id`),
  KEY `jenis_bencana_id` (`jenis_bencana_id`),
  CONSTRAINT `early_warning_ibfk_1` FOREIGN KEY (`laporan_id`) REFERENCES `laporan_bencana` (`id`),
  CONSTRAINT `early_warning_ibfk_2` FOREIGN KEY (`jenis_bencana_id`) REFERENCES `jenis_bencana` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of early_warning
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for incident_clusters
-- ----------------------------
DROP TABLE IF EXISTS `incident_clusters`;
CREATE TABLE `incident_clusters` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cluster_code` varchar(100) DEFAULT NULL,
  `jenis_bencana_id` int DEFAULT NULL,
  `total_laporan` int DEFAULT NULL,
  `radius_km` float DEFAULT NULL,
  `center_latitude` decimal(10,8) DEFAULT NULL,
  `center_longitude` decimal(11,8) DEFAULT NULL,
  `severity` enum('Rendah','Sedang','Tinggi','Darurat') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `jenis_bencana_id` (`jenis_bencana_id`),
  CONSTRAINT `incident_clusters_ibfk_1` FOREIGN KEY (`jenis_bencana_id`) REFERENCES `jenis_bencana` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of incident_clusters
-- ----------------------------
BEGIN;
INSERT INTO `incident_clusters` VALUES (1, 'CLUSTER-001', 1, 5, 2.5, -6.32650000, 108.32410000, 'Tinggi', '2026-05-24 11:48:36');
COMMIT;

-- ----------------------------
-- Table structure for jenis_bencana
-- ----------------------------
DROP TABLE IF EXISTS `jenis_bencana`;
CREATE TABLE `jenis_bencana` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) DEFAULT NULL,
  `nama_bencana` varchar(100) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `warna` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of jenis_bencana
-- ----------------------------
BEGIN;
INSERT INTO `jenis_bencana` VALUES (1, 'BANJIR', 'Banjir', 'flood.png', '#2196F3', '2026-05-24 11:40:45');
INSERT INTO `jenis_bencana` VALUES (2, 'ROB', 'Banjir Rob', 'rob.png', '#00BCD4', '2026-05-24 11:40:45');
INSERT INTO `jenis_bencana` VALUES (3, 'ABRASI', 'Abrasi', 'abrasi.png', '#FF9800', '2026-05-24 11:40:45');
INSERT INTO `jenis_bencana` VALUES (4, 'LONGSOR', 'Longsor', 'landslide.png', '#795548', '2026-05-24 11:40:45');
INSERT INTO `jenis_bencana` VALUES (5, 'CUACA', 'Cuaca Ekstrem', 'storm.png', '#9C27B0', '2026-05-24 11:40:45');
INSERT INTO `jenis_bencana` VALUES (6, 'KEBAKARAN', 'Kebakaran', 'fire.png', '#F44336', '2026-05-24 11:40:45');
COMMIT;

-- ----------------------------
-- Table structure for laporan_bencana
-- ----------------------------
DROP TABLE IF EXISTS `laporan_bencana`;
CREATE TABLE `laporan_bencana` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `kode_laporan` varchar(50) DEFAULT NULL,
  `whatsapp_message_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `jenis_bencana_id` int DEFAULT NULL,
  `status_id` int DEFAULT '1',
  `wilayah_id` bigint DEFAULT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `deskripsi` text,
  `alamat` text,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `tingkat_keparahan` enum('Rendah','Sedang','Tinggi','Darurat') DEFAULT 'Rendah',
  `sumber_data` enum('whatsapp','mobile_app','website','api','sensor') DEFAULT 'whatsapp',
  `confidence_score` decimal(5,2) DEFAULT NULL,
  `validasi_ai` tinyint(1) DEFAULT '0',
  `validasi_admin` tinyint(1) DEFAULT '0',
  `is_duplicate` tinyint(1) DEFAULT '0',
  `duplicate_reference` bigint DEFAULT NULL,
  `waktu_kejadian` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_laporan` (`kode_laporan`),
  KEY `whatsapp_message_id` (`whatsapp_message_id`),
  KEY `user_id` (`user_id`),
  KEY `jenis_bencana_id` (`jenis_bencana_id`),
  KEY `wilayah_id` (`wilayah_id`),
  KEY `idx_laporan_status` (`status_id`),
  KEY `idx_laporan_created` (`created_at`),
  KEY `idx_laporan_latlng` (`latitude`,`longitude`),
  CONSTRAINT `laporan_bencana_ibfk_1` FOREIGN KEY (`whatsapp_message_id`) REFERENCES `whatsapp_messages` (`id`),
  CONSTRAINT `laporan_bencana_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `laporan_bencana_ibfk_3` FOREIGN KEY (`jenis_bencana_id`) REFERENCES `jenis_bencana` (`id`),
  CONSTRAINT `laporan_bencana_ibfk_4` FOREIGN KEY (`status_id`) REFERENCES `status_laporan` (`id`),
  CONSTRAINT `laporan_bencana_ibfk_5` FOREIGN KEY (`wilayah_id`) REFERENCES `wilayah` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of laporan_bencana
-- ----------------------------
BEGIN;
INSERT INTO `laporan_bencana` VALUES (1, 'LAP-2026-0001', 1, 1, 1, 3, 1, 'Banjir Desa Karanganyar', 'Air mulai masuk rumah warga setinggi 40 cm', 'Desa Karanganyar, Karangampel', -6.32650000, 108.32410000, 'Sedang', 'whatsapp', 0.87, 1, 0, 0, NULL, '2026-05-24 11:46:51', '2026-05-24 11:46:51', '2026-05-24 11:46:51');
INSERT INTO `laporan_bencana` VALUES (2, 'LAP-2026-0002', 2, 2, 2, 3, 2, 'Banjir Rob Eretan', 'Air laut mulai menggenangi jalan utama', 'Desa Eretan Kulon', -6.29870000, 108.40120000, 'Sedang', 'whatsapp', 0.91, 1, 1, 0, NULL, '2026-05-24 11:46:51', '2026-05-24 11:46:51', '2026-05-24 11:46:51');
INSERT INTO `laporan_bencana` VALUES (3, 'LAP-2026-0003', 3, 3, 1, 4, 3, 'Tanggul Hampir Jebol', 'Tanggul retak dan debit air meningkat', 'Majakerta Balongan', -6.34510000, 108.36770000, 'Tinggi', 'whatsapp', 0.95, 1, 1, 0, NULL, '2026-05-24 11:46:51', '2026-05-24 11:46:51', '2026-05-24 11:46:51');
COMMIT;

-- ----------------------------
-- Table structure for laporan_media
-- ----------------------------
DROP TABLE IF EXISTS `laporan_media`;
CREATE TABLE `laporan_media` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `laporan_id` bigint DEFAULT NULL,
  `media_type` enum('image','video','audio','document') DEFAULT NULL,
  `file_path` text,
  `file_url` text,
  `ai_result` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `laporan_id` (`laporan_id`),
  CONSTRAINT `laporan_media_ibfk_1` FOREIGN KEY (`laporan_id`) REFERENCES `laporan_bencana` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of laporan_media
-- ----------------------------
BEGIN;
INSERT INTO `laporan_media` VALUES (1, 2, 'image', '/uploads/rob1.jpg', 'https://server.com/uploads/rob1.jpg', 'Flood detected', '2026-05-24 11:47:02');
INSERT INTO `laporan_media` VALUES (2, 3, 'image', '/uploads/tanggul.jpg', 'https://server.com/uploads/tanggul.jpg', 'Cracked embankment detected', '2026-05-24 11:47:02');
COMMIT;

-- ----------------------------
-- Table structure for media_files
-- ----------------------------
DROP TABLE IF EXISTS `media_files`;
CREATE TABLE `media_files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `whatsapp_message_id` bigint DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `file_path` text,
  `file_url` text,
  `file_type` varchar(50) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `ai_analysis` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `whatsapp_message_id` (`whatsapp_message_id`),
  CONSTRAINT `media_files_ibfk_1` FOREIGN KEY (`whatsapp_message_id`) REFERENCES `whatsapp_messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of media_files
-- ----------------------------
BEGIN;
INSERT INTO `media_files` VALUES (1, 2, 'rob1.jpg', 'IMG_001.jpg', '/uploads/rob1.jpg', 'https://server.com/uploads/rob1.jpg', 'image', 'image/jpeg', 245000, 'Genangan air terdeteksi', '2026-05-24 11:46:27');
INSERT INTO `media_files` VALUES (2, 3, 'tanggul.jpg', 'IMG_002.jpg', '/uploads/tanggul.jpg', 'https://server.com/uploads/tanggul.jpg', 'image', 'image/jpeg', 315000, 'Tanggul retak terdeteksi', '2026-05-24 11:46:27');
COMMIT;

-- ----------------------------
-- Table structure for ml_predictions
-- ----------------------------
DROP TABLE IF EXISTS `ml_predictions`;
CREATE TABLE `ml_predictions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `laporan_id` bigint DEFAULT NULL,
  `model_name` varchar(100) DEFAULT NULL,
  `model_version` varchar(50) DEFAULT NULL,
  `prediksi_bencana` varchar(100) DEFAULT NULL,
  `prediksi_keparahan` varchar(50) DEFAULT NULL,
  `confidence_score` decimal(5,2) DEFAULT NULL,
  `raw_result` json DEFAULT NULL,
  `processing_time` float DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `laporan_id` (`laporan_id`),
  CONSTRAINT `ml_predictions_ibfk_1` FOREIGN KEY (`laporan_id`) REFERENCES `laporan_bencana` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of ml_predictions
-- ----------------------------
BEGIN;
INSERT INTO `ml_predictions` VALUES (1, 1, 'DisasterNLP', 'v1.0', 'Banjir', 'Sedang', 0.87, NULL, 0.45, '2026-05-24 11:47:24');
INSERT INTO `ml_predictions` VALUES (2, 2, 'FloodVision', 'v2.1', 'Banjir Rob', 'Sedang', 0.91, NULL, 0.62, '2026-05-24 11:47:24');
INSERT INTO `ml_predictions` VALUES (3, 3, 'DisasterHybridAI', 'v3.0', 'Banjir', 'Tinggi', 0.95, NULL, 0.88, '2026-05-24 11:47:24');
COMMIT;

-- ----------------------------
-- Table structure for nlp_analysis
-- ----------------------------
DROP TABLE IF EXISTS `nlp_analysis`;
CREATE TABLE `nlp_analysis` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `laporan_id` bigint DEFAULT NULL,
  `extracted_keywords` text,
  `sentiment` varchar(50) DEFAULT NULL,
  `detected_entities` text,
  `cleaned_text` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `laporan_id` (`laporan_id`),
  CONSTRAINT `nlp_analysis_ibfk_1` FOREIGN KEY (`laporan_id`) REFERENCES `laporan_bencana` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of nlp_analysis
-- ----------------------------
BEGIN;
INSERT INTO `nlp_analysis` VALUES (1, 1, 'banjir,air,rumah,40cm', 'negative', 'Karanganyar', 'banjir rumah 40 cm', '2026-05-24 11:47:35');
INSERT INTO `nlp_analysis` VALUES (2, 2, 'rob,jalan,genangan', 'negative', 'Eretan', 'rob genangan jalan', '2026-05-24 11:47:35');
COMMIT;

-- ----------------------------
-- Table structure for status_laporan
-- ----------------------------
DROP TABLE IF EXISTS `status_laporan`;
CREATE TABLE `status_laporan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_status` varchar(100) DEFAULT NULL,
  `warna` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of status_laporan
-- ----------------------------
BEGIN;
INSERT INTO `status_laporan` VALUES (1, 'Menunggu', '#9E9E9E', '2026-05-24 11:40:55');
INSERT INTO `status_laporan` VALUES (2, 'Diproses', '#03A9F4', '2026-05-24 11:40:55');
INSERT INTO `status_laporan` VALUES (3, 'Warning', '#FFC107', '2026-05-24 11:40:55');
INSERT INTO `status_laporan` VALUES (4, 'Darurat', '#F44336', '2026-05-24 11:40:55');
INSERT INTO `status_laporan` VALUES (5, 'Selesai', '#4CAF50', '2026-05-24 11:40:55');
INSERT INTO `status_laporan` VALUES (6, 'Ditolak', '#795548', '2026-05-24 11:40:55');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nama` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `no_hp` varchar(25) DEFAULT NULL,
  `role` enum('masyarakat','operator','admin','bpbd','superadmin') DEFAULT 'masyarakat',
  `foto_profile` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1, 'Super Admin', 'admin@disaster.id', '$2y$10$examplehash', NULL, 'superadmin', NULL, 1, NULL, '2026-05-24 11:44:36', '2026-05-24 11:44:36');
INSERT INTO `users` VALUES (2, 'Budi Santoso', 'budi@mail.com', '123456', '628123450001', 'masyarakat', NULL, 1, NULL, '2026-05-24 11:45:42', '2026-05-24 11:45:42');
INSERT INTO `users` VALUES (3, 'Siti Aminah', 'siti@mail.com', '123456', '628123450002', 'masyarakat', NULL, 1, NULL, '2026-05-24 11:45:42', '2026-05-24 11:45:42');
INSERT INTO `users` VALUES (4, 'Ahmad Fauzi', 'ahmad@mail.com', '123456', '628123450003', 'masyarakat', NULL, 1, NULL, '2026-05-24 11:45:42', '2026-05-24 11:45:42');
INSERT INTO `users` VALUES (5, 'Operator BPBD', 'operator@bpbd.go.id', '123456', '628111111111', 'operator', NULL, 1, NULL, '2026-05-24 11:45:42', '2026-05-24 11:45:42');
INSERT INTO `users` VALUES (6, 'Admin BPBD', 'admin@bpbd.go.id', '123456', '628222222222', 'bpbd', NULL, 1, NULL, '2026-05-24 11:45:42', '2026-05-24 11:45:42');
COMMIT;

-- ----------------------------
-- Table structure for validasi_laporan
-- ----------------------------
DROP TABLE IF EXISTS `validasi_laporan`;
CREATE TABLE `validasi_laporan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `laporan_id` bigint DEFAULT NULL,
  `admin_id` bigint DEFAULT NULL,
  `hasil_validasi` enum('valid','invalid','spam','duplikat') DEFAULT NULL,
  `catatan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `laporan_id` (`laporan_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `validasi_laporan_ibfk_1` FOREIGN KEY (`laporan_id`) REFERENCES `laporan_bencana` (`id`),
  CONSTRAINT `validasi_laporan_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of validasi_laporan
-- ----------------------------
BEGIN;
INSERT INTO `validasi_laporan` VALUES (1, 2, 5, 'valid', 'Laporan sesuai kondisi lapangan', '2026-05-24 11:47:10');
INSERT INTO `validasi_laporan` VALUES (2, 3, 5, 'valid', 'Perlu tindakan cepat BPBD', '2026-05-24 11:47:10');
COMMIT;

-- ----------------------------
-- Table structure for whatsapp_messages
-- ----------------------------
DROP TABLE IF EXISTS `whatsapp_messages`;
CREATE TABLE `whatsapp_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message_id` varchar(255) DEFAULT NULL,
  `nomor_pengirim` varchar(30) DEFAULT NULL,
  `nama_pengirim` varchar(150) DEFAULT NULL,
  `tipe_pesan` enum('text','image','video','audio','document','location') DEFAULT NULL,
  `isi_pesan` text,
  `media_url` text,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `raw_payload` json DEFAULT NULL,
  `source` enum('whatsapp_cloud_api','wablas','fonnte','twilio') DEFAULT 'whatsapp_cloud_api',
  `status_proses` enum('pending','processed','failed') DEFAULT 'pending',
  `received_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `message_id` (`message_id`),
  KEY `idx_whatsapp_message` (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of whatsapp_messages
-- ----------------------------
BEGIN;
INSERT INTO `whatsapp_messages` VALUES (1, 'wamid001', '628123450001', 'Budi Santoso', 'text', 'Banjir di Desa Karanganyar, air masuk rumah sekitar 40 cm', NULL, -6.32650000, 108.32410000, NULL, 'whatsapp_cloud_api', 'processed', '2026-05-24 11:46:14', '2026-05-24 11:46:14');
INSERT INTO `whatsapp_messages` VALUES (2, 'wamid002', '628123450002', 'Siti Aminah', 'image', 'Rob di daerah Eretan, jalan utama mulai tergenang', 'https://server.com/media/rob1.jpg', -6.29870000, 108.40120000, NULL, 'whatsapp_cloud_api', 'processed', '2026-05-24 11:46:14', '2026-05-24 11:46:14');
INSERT INTO `whatsapp_messages` VALUES (3, 'wamid003', '628123450003', 'Ahmad Fauzi', 'image', 'Tanggul sungai retak dan hampir jebol', 'https://server.com/media/tanggul.jpg', -6.34510000, 108.36770000, NULL, 'whatsapp_cloud_api', 'processed', '2026-05-24 11:46:14', '2026-05-24 11:46:14');
COMMIT;

-- ----------------------------
-- Table structure for wilayah
-- ----------------------------
DROP TABLE IF EXISTS `wilayah`;
CREATE TABLE `wilayah` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `provinsi` varchar(100) DEFAULT NULL,
  `kabupaten` varchar(100) DEFAULT NULL,
  `kecamatan` varchar(100) DEFAULT NULL,
  `desa` varchar(100) DEFAULT NULL,
  `kodepos` varchar(10) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of wilayah
-- ----------------------------
BEGIN;
INSERT INTO `wilayah` VALUES (1, 'Jawa Barat', 'Indramayu', 'Karangampel', 'Karanganyar', '45283', -6.32650000, 108.32410000, '2026-05-24 11:45:54');
INSERT INTO `wilayah` VALUES (2, 'Jawa Barat', 'Indramayu', 'Eretan', 'Eretan Kulon', '45281', -6.29870000, 108.40120000, '2026-05-24 11:45:54');
INSERT INTO `wilayah` VALUES (3, 'Jawa Barat', 'Indramayu', 'Balongan', 'Majakerta', '45217', -6.34510000, 108.36770000, '2026-05-24 11:45:54');
INSERT INTO `wilayah` VALUES (4, 'Jawa Barat', 'Indramayu', 'Juntinyuat', 'Dadap', '45282', -6.42110000, 108.38910000, '2026-05-24 11:45:54');
COMMIT;

-- ----------------------------
-- Table structure for workflow_logs
-- ----------------------------
DROP TABLE IF EXISTS `workflow_logs`;
CREATE TABLE `workflow_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `workflow_name` varchar(255) DEFAULT NULL,
  `execution_id` varchar(255) DEFAULT NULL,
  `whatsapp_message_id` bigint DEFAULT NULL,
  `laporan_id` bigint DEFAULT NULL,
  `step_name` varchar(255) DEFAULT NULL,
  `status` enum('running','success','failed') DEFAULT NULL,
  `response` text,
  `execution_time` float DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `whatsapp_message_id` (`whatsapp_message_id`),
  KEY `laporan_id` (`laporan_id`),
  CONSTRAINT `workflow_logs_ibfk_1` FOREIGN KEY (`whatsapp_message_id`) REFERENCES `whatsapp_messages` (`id`),
  CONSTRAINT `workflow_logs_ibfk_2` FOREIGN KEY (`laporan_id`) REFERENCES `laporan_bencana` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of workflow_logs
-- ----------------------------
BEGIN;
INSERT INTO `workflow_logs` VALUES (1, 'disaster_intake_workflow', 'EXEC001', 1, 1, 'AI Classification', 'success', 'Classification completed', 0.88, '2026-05-24 11:48:21');
INSERT INTO `workflow_logs` VALUES (2, 'disaster_intake_workflow', 'EXEC002', 2, 2, 'Flood Detection', 'success', 'Flood detected successfully', 1.12, '2026-05-24 11:48:21');
INSERT INTO `workflow_logs` VALUES (3, 'disaster_intake_workflow', 'EXEC003', 3, 3, 'Severity Analysis', 'success', 'High severity identified', 1.56, '2026-05-24 11:48:21');
COMMIT;

-- ----------------------------
-- View structure for v_dashboard_realtime
-- ----------------------------
DROP VIEW IF EXISTS `v_dashboard_realtime`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_dashboard_realtime` AS select `lb`.`id` AS `id`,`lb`.`kode_laporan` AS `kode_laporan`,`jb`.`nama_bencana` AS `nama_bencana`,`sl`.`nama_status` AS `nama_status`,`lb`.`tingkat_keparahan` AS `tingkat_keparahan`,`lb`.`latitude` AS `latitude`,`lb`.`longitude` AS `longitude`,`lb`.`created_at` AS `created_at` from ((`laporan_bencana` `lb` left join `jenis_bencana` `jb` on((`lb`.`jenis_bencana_id` = `jb`.`id`))) left join `status_laporan` `sl` on((`lb`.`status_id` = `sl`.`id`)));

-- ----------------------------
-- View structure for v_heatmap
-- ----------------------------
DROP VIEW IF EXISTS `v_heatmap`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_heatmap` AS select `laporan_bencana`.`latitude` AS `latitude`,`laporan_bencana`.`longitude` AS `longitude`,count(0) AS `total_laporan` from `laporan_bencana` group by `laporan_bencana`.`latitude`,`laporan_bencana`.`longitude`;

SET FOREIGN_KEY_CHECKS = 1;
