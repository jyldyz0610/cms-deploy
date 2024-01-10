USE dev_kbzh;

CREATE TABLE IF NOT EXISTS accounts (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50),
    link VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES accounts(id)
);
