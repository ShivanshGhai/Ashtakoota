// config/db.js — MySQL2 connection pool for Railway
const mysql = require('mysql2/promise');

const config = {
  host:     process.env.DB_HOST || process.env.MYSQLHOST,
  port:     parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
  user:     process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit:    20,
  queueLimit:         0,
  timezone:           '+00:00',
  charset:            'utf8mb4',
};

const pool = mysql.createPool({
  ...config,
});

async function verifyConnection() {
  const conn = await pool.getConnection();
  conn.release();
  console.log('MySQL connection verified');
}

pool.verifyConnection = verifyConnection;
pool.connectionConfig = config;

module.exports = pool;
