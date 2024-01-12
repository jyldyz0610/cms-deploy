1. nodejs install https://deb.nodesource.com/
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update && sudo apt-get install nodejs -y




2. Install mysql
https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04

sudo apt update;
sudo apt install mysql-server;
sudo systemctl start mysql.service;

sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345';
exit

mysql -u root -p
12345

ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;
exit

sudo mysql_secure_installation

sudo mysql

3. sudo apt install git
git clone https://github.com/jyldyz0610/cms-deploy.git
cd kb-backend/src/; vim .env

cd ; mv cms-deploy ProjektCMS


4. set hostname
/home/ubuntu/ProjektCMS/kb-frontend/scripts
vim main.js

5. sudo npm install express 

6. Enter DNS name to /etc/hosts
for example
127.0.0.1 ec2-3-73-101-105.eu-central-1.compute.amazonaws.com

7. change localhost to ip
cd /home/ubuntu/ProjektCMS/csm-start-login
vim  login.html
vim register.html
e.g.
        <form class="mx-auto" action="http://ec2-3-73-101-105.eu-central-1.compute.amazonaws.com:3000/auth" method="post">


cd /home/ubuntu/ProjektCMS/kb-frontend
vim index.html



vim /home/ubuntu/ProjektCMS/kb-backend/src/app.js
127.0.0.1:5500/ to DNS-NAME

8. install http-server
sudo  npm install -g http-server

9. Run

cd /home/ubuntu/ProjektCMS/kb-backend/src/;  nohup node app.js > output.log 2>&1 &
ps -ef | grep node

cd /home/ubuntu; sudo  http-server -p 80
 
 
