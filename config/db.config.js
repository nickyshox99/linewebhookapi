'use strict';
const files = require('fs');
const mysql = require('sync-mysql');

const dotenv = require('dotenv');
dotenv.config();

const dbConn = new mysql({
    host: process.env.MYSQL_HOST?process.env.MYSQL_HOST:'localhost',
    port: process.env.MYSQL_PORT?process.env.MYSQL_PORT:3306,
    user: process.env.MYSQL_USER?process.env.MYSQL_USER:'root',
    password: process.env.MYSQL_PASSWORD?process.env.MYSQL_PASSWORD:'',
    database: process.env.MYSQL_DATABASE?process.env.MYSQL_DATABASE:'app_db',
    charset: 'utf8mb4',
    ssl: {
        // For VERIFY_IDENTITY, you must provide the CA certificate
        ca: files.readFileSync(process.env.MYSQL_SSL_CA || ''),
        rejectUnauthorized: true
    },
    sslMode: 'VERIFY_IDENTITY'
});

// const dbConn = new mysql({
//     host: 'db',
//     port: 3306,
//     user: 'root',
//     password: '',
//     database: 'app_db',
//     silent: true,
// });

const fs = require('fs');

module.exports = dbConn;

