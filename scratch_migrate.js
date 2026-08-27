const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    });

    console.log('Connected to MySQL database.');

    const [cols] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'reset_token'
    `);

    if (cols.length === 0) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN reset_token VARCHAR(255) NULL,
        ADD COLUMN reset_token_expires DATETIME NULL
      `);
      console.log('SUCCESS: Added reset_token and reset_token_expires columns to users table.');
    } else {
      console.log('INFO: Columns reset_token and reset_token_expires already exist on users table.');
    }

    await connection.end();
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

runMigration();
