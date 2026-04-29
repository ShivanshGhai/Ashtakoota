// config/db.js — MySQL2 connection pool for Railway
const mysql = require('mysql2/promise');

const config = {
  host:     process.env.MYSQLHOST || process.env.DB_HOST,
  port:     parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
  user:     process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
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
