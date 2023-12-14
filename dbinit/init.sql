CREATE DATABASE IF NOT EXISTS roboticapp;

USE roboticapp;

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) CHARACTER SET utf8mb3 NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb3 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `password_UNIQUE` (`password`)
);

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','$2b$10$wIKlKnnLLyGeWMzmZcJkxe2wCeJHEpM2zBQQCd1XmJCGdU43UIblK');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `students`;

CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb3 NOT NULL,
  `surname` varchar(45) CHARACTER SET utf8mb3 NOT NULL,
  `studentId` int NOT NULL,
  `secretKey` varchar(45) CHARACTER SET utf8mb3 NOT NULL,
  PRIMARY KEY (`id`,`studentId`),
  UNIQUE KEY `secretKey_UNIQUE` (`secretKey`),
  UNIQUE KEY `studentId_UNIQUE` (`studentId`)
);

DROP TABLE IF EXISTS `connectiontime`;

CREATE TABLE `connectiontime` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `date` datetime NOT NULL,
  `minute` varchar(45) CHARACTER SET utf8mb3 NOT NULL,
  PRIMARY KEY (`id`,`studentId`),
  UNIQUE KEY `date_UNIQUE` (`date`),
  UNIQUE KEY `studentId_UNIQUE` (`studentId`),
  CONSTRAINT `studentFK` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE
);


