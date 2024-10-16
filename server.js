// Import the express module, which is a web application framework for Node.js
const express = require("express");

// Import the path module, which provides utilities for working with file and directory paths
const path = require("path");

// Create an instance of the express application
const app = express();

// Middleware to parse URL-encoded bodies (form data sent through POST requests)
app.use(express.urlencoded({ extended: false }));

// Import the constants module, which provides access to predefined system constants (not used in this code)
const exp = require("constants");

// Import the database connection module, which contains the code to connect to the MySQL database
const connection = require("./db.js");

// Define the port number for the server to listen on
const PORT = 3000;

// Import the body-parser module, which is used to parse incoming request bodies (not necessary as express has built-in body parsing)
const bodyParser = require("body-parser");

// Middleware to serve static files from the 'static' directory
app.use(express.static(path.join(__dirname, 'static')));

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve the index.html file when the root URL is accessed
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Route to serve the sql.html file when '/sql.html' URL is accessed
app.get("/sql.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "sql.html"));
});

// Handle form submission via POST request to '/api'
app.post('/api', (req, res) => {
    console.log(req.body); // Log the form data to the console

    // Extract username and password from the form data
    const username = req.body.user;
    const password = req.body.password;

    // Insert the username and password into the database
    connection.query(
        "INSERT INTO sql_injection (user, password) VALUES (?, ?)",
        [username, password],
        (err, result) => {
            if (err) {
                console.log(err); // Log any errors to the console
                res.status(500).send('Database error'); // Send error response to the client
            } else {
                res.status(200).send('Data inserted successfully'); // Send success response to the client
            }
        }
    );
});


// Vulnerable code

app.post("/login", function(req, res){
    const username1 = req.body.user1
    const password1 = req.body.password1
    connection.query("SELECT * FROM sql_injection WHERE user = '" + req.body.user1 + "' AND password = '" + req.body.password1 + "'",
    [username1, password1],
      (err, result) => {
        if (err){
          res.send({err: err});
        }
    
          if (result.length > 0) {
            res.send({Message: "Loged in"})
          } else {
            res.send({Message: "Wrong username/password"})
          }
      }
    ); 
    })
// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log("Server is working");

    // Connect to the database
    connection.connect((err) => {
        if (err) {
            console.error("Database connection failed: " + err.stack);
            return;
        }
        console.log("Database is working");
    });
});
