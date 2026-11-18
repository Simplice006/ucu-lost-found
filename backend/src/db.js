// Database connection pool (mysql2). Works with local MySQL and TiDB Cloud.
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // TiDB Cloud public endpoints require TLS. Enable with DB_SSL=true.
  ssl: process.env.DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  dateStrings: true, // keep DATE columns as 'YYYY-MM-DD' strings (no timezone surprises)
});

module.exports = pool;
