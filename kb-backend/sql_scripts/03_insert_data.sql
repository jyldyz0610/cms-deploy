USE dev_kbzh;

INSERT INTO accounts (id, username, password, email) VALUES (1, 'test', 'test', 'test@test.com');

INSERT INTO links (category, link, thumbnail, user_id) VALUES ('Tech', 'http://www.techstarter.de/', 'thumbnails/ts.png', 1);
INSERT INTO links (category, link, thumbnail, user_id) VALUES ('Search', 'http://www.google.de/', 'thumbnails/gg.png', 1);
INSERT INTO links (category, link, thumbnail, user_id) VALUES ('Video', 'http://www.youtube.com/', 'thumbnails/yt.png', 1);
INSERT INTO links (category, link, thumbnail, user_id) VALUES ('Science', 'http://www.nasa.gov/', 'thumbnails/nasa.png', 1);
INSERT INTO links (category, link, thumbnail, user_id) VALUES ('Shopping', 'http://www.amazon.com/', 'thumbnails/amazon.png', 1);
INSERT INTO links (category, link, thumbnail, user_id) VALUES ('Technology', 'http://www.hp.com/', 'thumbnails/hp.png', 1);
INSERT INTO links (category, link, thumbnail, user_id) VALUES ('Tech News', 'http://www.chip.de/', 'thumbnails/chip.png', 1);
