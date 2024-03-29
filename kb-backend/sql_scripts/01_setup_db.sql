-- CREATE DATABASE IF NOT EXISTS dev_kb;
CREATE DATABASE IF NOT EXISTS `dev_kbzh` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE USER IF NOT EXISTS 'kbuser'@'localhost' IDENTIFIED BY 'devkb2023!';

GRANT SELECT, UPDATE, INSERT, DELETE ON dev_kbzh.* TO 'kbuser'@'localhost';

FLUSH PRIVILEGES;
