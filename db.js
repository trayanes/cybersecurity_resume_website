const mysql = require("mysql2")

var db = mysql.createConnection({
    host: '127.0.0.1',
    database: 'resume',
    user: 'root',
    password: '900911abc5a'
})


module.exports = db;

