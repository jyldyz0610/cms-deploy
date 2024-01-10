# Use
    npm install
    cd src
    node app.js 
    bash ../test/test.sh

# Try/Catch in JavaScript
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch?retiredLocale=de

# HTTP Methods
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- https://wiki.selfhtml.org/wiki/HTTP/Anfragemethoden
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- https://www.ionos.de/digitalguide/hosting/hosting-technik/http-request-erklaert/

# Swagger API Docs
- https://blog.logrocket.com/documenting-express-js-api-swagger/
- https://www.npmjs.com/package/swagger-ui-express
- https://swagger.io/tools/swagger-ui/
- https://levelup.gitconnected.com/how-to-add-swagger-ui-to-existing-node-js-and-express-js-project-2c8bad9364ce
- https://javascript.plainenglish.io/integrate-open-api-swagger-with-node-and-express-b5b77bdc081b
    
# Make a new folder
    mkdir <foldername>
    cd <foldername>

# Set up git hook
run:
    hook/installHook.sh

# Set up SQL DB
    See sql-scripts, execute sql files in given order.
    Or run reset.sh
    For further information scroll down to DB section.

# Set up .env
    Execute setup-env.sh

# Initialize npm and install express
    npm init
    npm install express --save
    npm start

# Every new change run:
    npm install

# Make a gitignore folder and insert files/folders which shouldn't be pushed
    touch .gitignore
        node_modules
        .env

# Make a new Javascript file
    touch app.js

# Insert your Code into the Javascript file
    Import express
    Initialize express
    Define port
    Set MySQL as const
    Initialize dotenv package
    Debug Output
    Activate express with Json Req/Res
    Check if .env file exists
    Establish Database connection
    Make your routes
    Localhost listens on port app

# Make a testing folder
    mkdir test

# Make files within testing folder and insert testing methods
    touch test.sh
    touch test.js

# Add testing code to test.sh/test.js
    Test your routes within app.js
    
# Make a new folder 
    mkdir sql_scripts

# Make new files within sql_scripts
    touch 01_setup_db.sql
    touch 02_setup_table.sql
    touch 03_insert_data.sql
    touch 99_cleanup_db.sql

# Add Code to each .sql file
    01_setup_db.sql
        - Create Database
        - Create User
        - Give access
        - remove access

    02_setup_table.sql
        - Use Database
        - Create Table

    03_insert_data.sql
        - Use Database
        - Insert your todos

    99_cleanup_db.sql
        - Drop User
        - Drop Database

# Run each .sql file to accomplish desired outcome
    1. Clean DB first
        - mysql -u root -p < 99_cleanup_db.sql
    
    2. Setup DB
        - mysql -u root -p < 01_setup_db.sql

    3. Setup Table
        - mysql -u root -p < 02_setup_table.sql

    4. Insert Data
        - mysql -u root -p < 03_insert_data.sql