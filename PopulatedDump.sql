-- MySQL dump 10.17  Distrib 10.3.18-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: Twitter
-- ------------------------------------------------------
-- Server version	10.3.18-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `FOLLOW`
--

DROP TABLE IF EXISTS `FOLLOW`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FOLLOW` (
  `FOLLOWER` varchar(50) NOT NULL,
  `FOLLOWING` varchar(50) NOT NULL,
  PRIMARY KEY (`FOLLOWER`,`FOLLOWING`),
  KEY `FOLLOWING` (`FOLLOWING`),
  CONSTRAINT `FOLLOW_ibfk_1` FOREIGN KEY (`FOLLOWER`) REFERENCES `USERS` (`USERNAME`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FOLLOW_ibfk_2` FOREIGN KEY (`FOLLOWING`) REFERENCES `USERS` (`USERNAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FOLLOW`
--

LOCK TABLES `FOLLOW` WRITE;
/*!40000 ALTER TABLE `FOLLOW` DISABLE KEYS */;
INSERT INTO `FOLLOW` VALUES (' HrithikRoshan','APJAbdulKalam'),(' HrithikRoshan','kapil7398'),('APJAbdulKalam','kapil7398'),('kapil7398','APJAbdulKalam'),('kapil7398','Mohanlal'),('kapil7398','realDonaldTrump'),('kapil7398','shahraaz'),('maria','APJAbdulKalam'),('Mohanlal','kapil7398'),('shahraaz','APJAbdulKalam');
/*!40000 ALTER TABLE `FOLLOW` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REGISTRATION`
--

DROP TABLE IF EXISTS `REGISTRATION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `REGISTRATION` (
  `EMAIL` varchar(50) NOT NULL,
  `USERNAME` varchar(50) DEFAULT NULL,
  `PASSWORD` varchar(50) NOT NULL,
  PRIMARY KEY (`EMAIL`),
  UNIQUE KEY `USERNAME` (`USERNAME`),
  CONSTRAINT `REGISTRATION_ibfk_1` FOREIGN KEY (`USERNAME`) REFERENCES `USERS` (`USERNAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REGISTRATION`
--

LOCK TABLES `REGISTRATION` WRITE;
/*!40000 ALTER TABLE `REGISTRATION` DISABLE KEYS */;
INSERT INTO `REGISTRATION` VALUES (' HrithikRoshan@gmail.com',' HrithikRoshan','3523aee07f232d6d6bf4d7c9f1947fad'),('APJAbdulKalam@gmail.com','APJAbdulKalam','1f6f0c735611fa808de9028287646054'),('don@gmail.com','realDonaldTrump','6a01bfa30172639e770a6aacb78a3ed4'),('kapil7398kg@gmail.com','kapil7398','275bb6ba63088e3e25408ba60d6d11d8'),('maria@gmail.com','maria','263bce650e68ab4e23f28263760b9fa5'),('mohan@gmail.com','Mohanlal','e9206237def4b4ef46fd933ed0f5a08f'),('shahraazhussain@gmail.com','shahraaz','7bc93f69eec77ff81c6a9828889746bd');
/*!40000 ALTER TABLE `REGISTRATION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TWEETCONTENTS`
--

DROP TABLE IF EXISTS `TWEETCONTENTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TWEETCONTENTS` (
  `TWEETID` int(11) NOT NULL AUTO_INCREMENT,
  `USERNAME` varchar(50) NOT NULL,
  `TWEETCONTENT` varchar(250) NOT NULL,
  `TWEETTIME` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`TWEETID`),
  KEY `USERNAME` (`USERNAME`),
  CONSTRAINT `TWEETCONTENTS_ibfk_1` FOREIGN KEY (`USERNAME`) REFERENCES `USERS` (`USERNAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TWEETCONTENTS`
--

LOCK TABLES `TWEETCONTENTS` WRITE;
/*!40000 ALTER TABLE `TWEETCONTENTS` DISABLE KEYS */;
INSERT INTO `TWEETCONTENTS` VALUES (13,'Mohanlal','May the sparkling Festival of Lights fill your home with Happiness , Good Luck and Prosperity.\r\n #HappyDiwali \r\n #BigBrother Movie Official Poster','2019-11-25 18:48:21'),(14,'kapil7398','Life is beautiful','2019-11-25 19:01:54'),(15,'APJAbdulKalam','Courage to think different, \r\nCourage to invent,\r\nCourage to discover the impossible,\r\nCourage to combat the problems\r\nAnd Succeed,\r\nAre the unique qualities of the scientist','2019-11-25 19:09:53'),(16,'APJAbdulKalam','Great Books Ignite Imagination, \r\nImagination leads to Creativity,\r\nCreativity leads to thinking, \r\nthinking provides knowledge and\r\nKnowledge makes you great.','2019-11-25 19:11:17'),(17,'kapil7398','\"The way to get started is to quit talking and begin doing.\" -Walt Disney','2019-11-25 19:13:23'),(18,'kapil7398','\"The greatest glory in living lies not in never falling, but in rising every time we fall.\" -Nelson Mandela','2019-11-25 19:13:46'),(20,'shahraaz','when you don\'t create things, you become defined by your tastes rather than ability.','2019-11-25 19:18:14'),(21,'shahraaz','Programs must be written for people to read, and only incidentally for machines to execute','2019-11-25 19:18:25'),(22,'shahraaz','Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live\r\n','2019-11-25 19:19:01'),(23,'APJAbdulKalam','Happy children\'s day','2019-11-25 19:22:56'),(24,'APJAbdulKalam','Every religion preaches compassion and love. If we can transform religion into a spiritual force then we have arrived. By 2020 we should be a prosperous and happy nation without loosing our civilization heritage.','2019-11-25 19:23:57'),(25,'APJAbdulKalam','you have to dream before your dreams can come true','2019-11-25 19:32:55'),(26,' HrithikRoshan','We’ve all got excuses. Yes, me too! But they don’t matter. All you have to do is Turn Up! ','2019-11-25 19:36:44'),(27,'maria','\"Life is what happens when you\'re busy making other plans.\" -John Lennon','2019-11-25 19:45:54'),(28,'maria','\"If you set your goals ridiculously high and it\'s a failure, you will fail above everyone else\'s success.\" -James Cameron','2019-11-25 19:46:05'),(29,'maria','\"If you look at what you have in life, you\'ll always have more. If you look at what you don\'t have in life, you\'ll never have enough.\" -Oprah Winfrey','2019-11-25 19:46:12'),(30,'maria','\"If life were predictable it would cease to be life, and be without flavor.\" -Eleanor Roosevelt','2019-11-25 19:46:19'),(31,'maria','\"Your time is limited, so don\'t waste it living someone else\'s life. Don\'t be trapped by dogma – which is living with the results of other people\'s thinking.\" -Steve Jobs','2019-11-25 19:46:40');
/*!40000 ALTER TABLE `TWEETCONTENTS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TWEETS`
--

DROP TABLE IF EXISTS `TWEETS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TWEETS` (
  `TWEETID` int(11) NOT NULL,
  `USERNAME` varchar(50) NOT NULL,
  `TIMESTAMP_R` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`TWEETID`,`USERNAME`),
  KEY `USERNAME` (`USERNAME`),
  CONSTRAINT `TWEETS_ibfk_1` FOREIGN KEY (`TWEETID`) REFERENCES `TWEETCONTENTS` (`TWEETID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TWEETS_ibfk_2` FOREIGN KEY (`USERNAME`) REFERENCES `USERS` (`USERNAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TWEETS`
--

LOCK TABLES `TWEETS` WRITE;
/*!40000 ALTER TABLE `TWEETS` DISABLE KEYS */;
INSERT INTO `TWEETS` VALUES (13,'Mohanlal','2019-11-25 18:48:21'),(14,'kapil7398','2019-11-25 19:01:54'),(15,'APJAbdulKalam','2019-11-25 19:09:53'),(15,'kapil7398','2019-11-25 19:14:59'),(16,'APJAbdulKalam','2019-11-25 19:11:17'),(16,'kapil7398','2019-11-25 19:14:57'),(16,'shahraaz','2019-11-25 19:22:45'),(17,' HrithikRoshan','2019-11-25 19:37:13'),(17,'APJAbdulKalam','2019-11-25 19:25:25'),(17,'kapil7398','2019-11-25 19:13:23'),(18,'kapil7398','2019-11-25 19:13:46'),(20,'shahraaz','2019-11-25 19:18:14'),(21,'shahraaz','2019-11-25 19:18:25'),(22,'shahraaz','2019-11-25 19:19:01'),(23,'APJAbdulKalam','2019-11-25 19:22:56'),(24,'APJAbdulKalam','2019-11-25 19:23:57'),(25,'APJAbdulKalam','2019-11-25 19:32:55'),(26,' HrithikRoshan','2019-11-25 19:36:44'),(27,'maria','2019-11-25 19:45:54'),(28,'maria','2019-11-25 19:46:05'),(29,'maria','2019-11-25 19:46:12'),(30,'maria','2019-11-25 19:46:19'),(31,'maria','2019-11-25 19:46:40');
/*!40000 ALTER TABLE `TWEETS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USERS`
--

DROP TABLE IF EXISTS `USERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USERS` (
  `USERNAME` varchar(50) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  `GENDER` char(1) NOT NULL,
  `BIO` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`USERNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USERS`
--

LOCK TABLES `USERS` WRITE;
/*!40000 ALTER TABLE `USERS` DISABLE KEYS */;
INSERT INTO `USERS` VALUES (' HrithikRoshan',' Hrithik Roshan','M','Man on mission- to live the best life possible come what may.'),('APJAbdulKalam','A.P.J. Abdul Kalam','M','Scientist, teacher, learner and writer. Served as the 11th President of India (2002-07). Working for an economically developed nation by 2020'),('kapil7398','KAPIL GYANCHANDANI','M','LEARNER'),('maria','Maria ','F','love to quote famous quotes'),('Mohanlal','Mohanlal','M','A Proud and Blessed Indian! A part of the Indian Movie Fraternity from God\'s Own Country.'),('realDonaldTrump','Donald J. Trump','M','45th President of the United States of America'),('shahraaz','Mohammed Shahraaz Hussain','M','Code Guy');
/*!40000 ALTER TABLE `USERS` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-26  1:16:53
