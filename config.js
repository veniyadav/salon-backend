const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'salon',
    multipleStatements: true
});

 

console.warn('Connected');

module.exports = db;


