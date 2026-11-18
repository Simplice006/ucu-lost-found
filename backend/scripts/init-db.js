// Creates the database (if missing) and the tables, using the settings in backend/.env.
// Usage: npm run db:init     -> works on Windows/Mac/Linux, no `mysql` command needed.
// WARNING: it re-creates the tables, so any existing data in them is erased.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const dbName = process.env.DB_NAME || 'ucu_lost_found';
  if (!/^[A-Za-z0-9_]+$/.test(dbName)) {
    console.error('DB_NAME may only contain letters, digits and underscores.');
    process.exit(1);
  }
  // The file's own CREATE DATABASE / USE lines are replaced by DB_NAME from .env, so both always agree.
  const sql = fs
    .readFileSync(path.join(__dirname, '..', '..', 'database', 'schema.sql'), 'utf8')
    .replace(/^\s*(CREATE DATABASE|USE)\b[^;]*;\s*$/gim, '');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
    multipleStatements: true,
  });
  try {
    try {
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    } catch (err) {
      console.warn(`Could not create database "${dbName}" (${err.code}); assuming it already exists.`);
    }
    await conn.query(`USE \`${dbName}\``);
    await conn.query(sql);
    const [tables] = await conn.query('SHOW TABLES');
    console.log(`Database "${dbName}" is ready. Tables: ${tables.map((t) => Object.values(t)[0]).join(', ')}`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('db:init failed:', err.code || '', err.message);
  if (err.code === 'ER_ACCESS_DENIED_ERROR') console.error('Check DB_USER / DB_PASSWORD in backend/.env.');
  if (err.code === 'ECONNREFUSED') console.error('MySQL is not running (start it in XAMPP / MySQL Workbench / services), or DB_HOST/DB_PORT is wrong.');
  process.exit(1);
});
