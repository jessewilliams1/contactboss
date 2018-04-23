var mysql = require('mysql');
var config = require('../config/config.js');
var db = null;
module.exports = function () {

    if(!db) {
            db = mysql.createConnection({
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME
        });
    }
    return db;
};