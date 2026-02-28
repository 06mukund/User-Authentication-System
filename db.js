const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: " ", // Use your Password
    database: "auth_system"
});

module.exports = pool;