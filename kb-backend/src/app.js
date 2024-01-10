// const fs = require('fs');
const fs = require('fs').promises;
// Express importieren
const express = require('express');
//const dns = require('dns');
const puppeteer = require('puppeteer');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
// const upload = multer({ dest: 'thumbnails/' });


// Express initialisieren
const app = express();

// Port definieren (optional)
const port = 3000;

// CORS (Cross Origin Ressource Sharing) aktivieren
const cors = require('cors');

// MySQL als Konstante
const mysql = require('mysql2');

//dotenv package initialisieren
const { config } = require('dotenv');
const { link } = require('fs');
const { error } = require('console');

// Check if the .env file exists
if (config().parsed == undefined) {
    console.error('Error: .env file is missing (copy/adapt .env.example and rename it to .env)');
    process.exit(1); // Exit the process with an error code
}


// Debug-Ausgabe für Umgebung
if (process.env.ENABLE_DEBUG == "TRUE") {
    console.log("env:", process.env);
}

// CORS Options definieren
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Express mit Json Req/Res aktivieren
app.use(express.json(), cors(corsOptions));

// This will catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Datenbank Verbindung mit Umgebungsvariablen
function getConnection() {
    const requiredEnvVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    const missingVariables = requiredEnvVariables.filter(key => !process.env[key]);
    if (missingVariables.length > 0)
        console.error(`Error: Missing required environment variables: ${missingVariables.join(', ')}`);
    try {
        var cnx = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });


    } catch (error) {
        console.error("Database connection error", error);
    }

    // run sample query to check DB setup
    // try to execute code that might fail
    try {
        cnx.query('SELECT * FROM links;', function (error, results, fields) {
            if (error) {
                console.log("mySQL Error:", error);
                process.exit(1); // exit
            } else {
                console.log("SQL Connection Self-Check: Ok");
                console.log("DB Connection set up successfully");
                console.log('Connected to MySQL as id ' + cnx.threadId);
            }
        });
    } catch (error) {
        // An error occurred
        console.error("SQL Schema Error: Could not retrieve link list (see sql-scripts for DB setup)", error);
    }
    return cnx;
}
const cnx = getConnection();


// Express mit Json Req/Res aktivieren
app.use(express.json(), cors(corsOptions));

// Serve static files from the "thumbnails" directory
app.use('/thumbnails', express.static('thumbnails'));

// This will catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function createThumbnail(url, thumbnailPath, viewportSize = { width: 150, height: 75 }) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Navigate to the page
        await page.goto(url, { waitUntil: 'domcontentloaded' }); // 'domcontentloaded' waits for the initial HTML document to be completely loaded
        // Set viewport size
        await page.setViewport(viewportSize);

        // Automatically click on a common cookie consent button if it exists
        await page.evaluate(() => {
            const cookieButton = document.querySelector('[id*=cookie] a, [class*=cookie] a, [id*=cookie] button, [class*=cookie] button');
            if (cookieButton) {
                cookieButton.click();
            }
        });

        // Capture a screenshot
        await page.screenshot({ path: thumbnailPath });

        console.log(`Thumbnail for ${url} created: ${thumbnailPath}`);
    } catch (error) {
        console.error(`Error creating thumbnail for ${url}:`, error);
        throw new Error("Error creating screenshot!");
    } finally {
        await browser.close();
    }
}

app.get('/links', (req, res) => {
    try {
        cnx.query('SELECT * FROM links ORDER BY id DESC;', function (error, results, fields) {
            if (error) throw error;
            const formattedLinks = results.map(link => ({
                id: link.id,
                link: link.link,
                thumbnail: link.thumbnail,
                category: link.category,
            }));
            res.json({ "links": formattedLinks });
        });
    } catch (error) {
        console.error("Could not retrieve link list", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET one specific item by id
app.get('/link/:id', (req, res) => {
    // console.log("REQ", req);
    try {
        cnx.query('SELECT * FROM links WHERE id =?', req.params.id, function (error, results, fields) {
            if (!error) {
                res.status(200).json({ "link": results });
            } else {
                res.status(500).json({ "error": "Could not find item with id ", "id": req.params.id });
            }
        });
        // try to execute code that might fail
    } catch (error) {
        // An error occurred
        console.error("Could not retrieve link list", error);
    }
});


app.post('/link', async (req, res) => {
    try {
        const { link, category } = req.body; // Destructure link and category from req.body
        const thumbnailPath = `thumbnails/${Date.now()}.png`;
        try {
            await createThumbnail(link, thumbnailPath);
            const thumbnailURL = `${thumbnailPath}`;
            // Insert the link, category, thumbnail path into the database
            cnx.query('INSERT INTO links (link, category, thumbnail) VALUES (?, ?, ?);', [link, category, thumbnailURL], function (error, result) {
                if (!error) {
                    const response = JSON.stringify({ "id": result.insertId });
                    res.status(200).send(response);
                } else {
                    console.error("Error inserting link into database", error);
                    res.status(500).json({ error: "Internal Server Error" });
                }
            });
        }
        catch (error) {
            console.error("Could not create thumbnail", error);
            res.status(500).json({ "error": error.message });
        }


    } catch (error) {
        console.error("Error adding link and creating thumbnail", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Item mit PUT zu aktualisieren
app.put('/link/:id', (req, res) => {
    try {
        let sql = `UPDATE links WHERE id = ?;`;
        let id = req.params.id;

        cnx.query(sql, id, function (error, result) {
            if (!error && result.affectedRows) {
                console.log("put successful");
                res.status(200).send(JSON.stringify({ "affected-rows": result.affectedRows }));
            } else {
                console.error("Affected rows:", result.affectedRows);
                console.error("put error:", error);
                // 500 not found 
                res.status(500).json({ "affected-rows": 0 });
            }
        }); // query

        // Überprüfung ob auf id zugegriffen kann  
        // res.status(200).send(`link update item: ${req.params.id}`);
    } catch (error) {
        // Es ist ein Fehler aufgetreten!
        console.error("Could not retrieve link key", error);
    }

});


// neu route mit patch wurde hier definiert 
app.patch('/link/:id', (req, res) => {
    try {
        let sql = "UPDATE links SET link = ?, thumbnail = ? WHERE id = ?;";
        let id = req.params.id;
        let link = req.body.link;
        let thumbnail = req.body.thumbnail;
        cnx.query(sql, [link, thumbnail, id], function (error, result) {
            if (!error && result.affectedRows) {
                res.status(200).json({ "id": id, "message": "item successfully updated" });
            } else {
                res.status(404).send({ "id": id, "message": "error updating item", "error": error });
            }
        }); // query

        // Überprüfung ob auf id zugegriffen kann  
        // res.status(200).send(`link update item: ${req.params.id}`);
    } catch (error) {
        // Es ist ein Fehler aufgetreten!
        console.error("Could not retrieve link key", error);
    }

});


// app.get('/categories', (req, res) => {
//     try {
//         cnx.query('SELECT DISTINCT category FROM links;', function (error, results, fields) {
//             if (error) throw error;
//             const categories = results.map(category => category.category);
//             res.json({ "categories": categories });
//         });
//     } catch (error) {
//         console.error("Could not retrieve categories", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// neue delete route erstellt
app.delete('/link/:id', async (req, res) => {
    try {
        // Retrieve the thumbnail path for the given link
        const getThumbnailPathQuery = 'SELECT thumbnail FROM links WHERE id = ?;';
        const id = req.params.id;

        cnx.query(getThumbnailPathQuery, id, async (error, results) => {
            if (error) {
                console.error("Error retrieving thumbnail path:", error);
                res.status(500).json({ "action": "delete", "affected-rows": 0 });
                return;
            }

            const thumbnailPath = results[0] ? results[0].thumbnail : null;

            // Delete the link and its associated thumbnail
            const deleteLinkQuery = 'DELETE FROM links WHERE id = ?;';
            cnx.query(deleteLinkQuery, id, async (deleteError, result) => {
                if (!deleteError && result.affectedRows) {
                    // Delete the associated thumbnail file
                    if (thumbnailPath) {
                        try {
                            await fs.unlink(thumbnailPath);
                            console.log('Thumbnail file deleted successfully');
                        } catch (unlinkError) {
                            console.error("Error deleting thumbnail file:", unlinkError);
                        }
                    }

                    res.status(200).json({ "action": "delete", "affected-rows": result.affectedRows });
                } else {
                    res.status(500).json({ "action": "delete", "affected-rows": 0 });
                }
            });
        });
    } catch (error) {
        console.error("Could not retrieve link key", error);
    }
});

// const upload = require('./upload');
const uploadDirectory = './thumbnails';

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, thumbnail, cb) => {
       
            cb(null, 'thumbnails/');
    },
    filename: (req, thumbnail, cb) => {
        //Thumbnail originalname by uploading
        cb(null, thumbnail.originalname);
    //   cb(null, Date.now() + '-' + thumbnail.originalname);
    }
  });

  // Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
// Set up a route for file uploads
app.post('/upload', upload.single('thumbnail'), (req, res) => {
  // Handle the uploaded file
  res.json({ message: 'File uploaded successfully!' });
});

// // Create the multer instance
// const upload = multer({ storage: storage });

// module.exports = upload;

// Set up a route for file uploads
// app.post('/thumbnails', upload.single('file'), (req, res) => {
//     // Handle the uploaded file
//     res.json({ message: 'File uploaded successfully!' });
//   });
// const multer = require('multer');
// const upload = multer({ dest: 'thumbnails/' }); // Set the destination folder for uploaded files

// app.post('/thumbnails', upload.single('thumbnail'), async (req, res) => {
//     try {
//         const { link, category } = req.body;

//         // Check if a file was uploaded
//         if (!req.file) {
//             return res.status(400).json({ error: "No file uploaded" });
//         }

//         const thumbnailPath = req.file.path; // Use the path of the uploaded file

//         // Insert the link, category, and custom thumbnail path into the database
//         cnx.query('INSERT INTO links (link, category, thumbnail) VALUES (?, ?, ?);', [link, category, thumbnailPath], function (error, result) {
//             if (!error) {
//                 const response = JSON.stringify({ "id": result.insertId });
//                 res.status(200).send(response);
//             } else {
//                 console.error("Error inserting link into database", error);
//                 res.status(500).json({ error: "Internal Server Error" });
//             }
//         });
//     } catch (error) {
//         console.error("Error adding link and custom thumbnail", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
// app.post('/thumbnails', upload.single("file"), (req, res) => {
//     console.log("Upload file");
//     console.log(req.file)
//     res.send("Datei erfolgreich hochgeleden")
// });

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
    let username = request.body.username;
    let password = request.body.password;

    // Log input for debugging
    console.log('Username:', username);
    console.log('Password:', password);

    if (username && password) {
        // Execute SQL query
        cnx.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) {
                console.error('Database error:', error);
                response.status(500).send('Internal Server Error');
                return;
            }

            // Log results for debugging
            console.log('Query Results:', results);

            if (results.length > 0) {
                // Authentication successful
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }

            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});


app.get('/home', function(request, response) {
    // If the user is logged in
    if (request.session.loggedin) {
        // Redirect to index.html on successful login
        response.redirect('http://127.0.0.1:5500/ProjektCMS/kb-frontend/');
    } else {
        // Not logged in
        response.send('Please login to view this page!');
    }
});




const jwt = require("jsonwebtoken");

module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        message: 'Please enter a username with min. 3 chars',
      });
    }
    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        message: 'Please enter a password with min. 6 chars',
      });
    }
    // password (repeat) must match
    if (
      !req.body.password_repeat ||
      req.body.password != req.body.password_repeat
    ) {
      return res.status(400).send({
        message: 'Both passwords must match',
      });
    }
    next();
  }
};

// http://localhost:3000/register
app.get('/register', function(request, response) {
    // Render registration template
    response.sendFile(path.join(__dirname + '/register.html'));
});

// http://localhost:3000/register
app.post('/register', function(request, response) {
    let username = request.body.username;
    let email = request.body.email;
    let password = request.body.password;
    let confirmPassword = request.body.confirmPassword;

    // Log input for debugging
    console.log('Registering new user - Username:', username);
    console.log('Registering new user - Email:', email);
    console.log('Registering new user - Password:', password);

    if (username && email && password && confirmPassword) {
        if (password === confirmPassword) {
            // Check if the username is already taken
            cnx.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
                if (error) {
                    console.error('Database error:', error);
                    response.status(500).send('Internal Server Error');
                    return;
                }

                if (results.length > 0) {
                    // Username already taken
                    response.send('Username already taken. Please choose a different one.');
                } else {
                    // Insert new user into the database
                    cnx.query('INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)', [username, email, password], function(error, results, fields) {
                        if (error) {
                            console.error('Database error:', error);
                            response.status(500).send('Internal Server Error');
                            return;
                        }

                        // Registration successful
                        // response.send('Registration successful! You can now log in.');
                                // Redirect to index.html on successful login
                        response.redirect('http://127.0.0.1:5500/ProjektCMS/kb-frontend/');
                    });
                }
            });
        } else {
            // Password and confirmation do not match
            response.send('Password and confirmation do not match. Please try again.');
        }
    } else {
        // Missing username, email, password, or confirmation
        response.send('Please enter both a username, an email, a password, and confirm the password for registration.');
    }
});


// localhost listen port app 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
