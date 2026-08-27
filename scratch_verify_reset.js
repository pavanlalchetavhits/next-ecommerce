require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function testResetFlow() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    });

    console.log('Connected to MySQL.');

    // Fetch test user
    const [users] = await connection.query('SELECT id, email FROM users LIMIT 1');
    if (users.length === 0) {
      console.log('No user found in database.');
      await connection.end();
      return;
    }

    const testUser = users[0];
    console.log('Testing reset link generation for:', testUser.email);

    // Create token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const pad = (n) => n.toString().padStart(2, '0');
    const formattedExpiresAt = `${expiresAt.getFullYear()}-${pad(expiresAt.getMonth() + 1)}-${pad(expiresAt.getDate())} ${pad(expiresAt.getHours())}:${pad(expiresAt.getMinutes())}:${pad(expiresAt.getSeconds())}`;

    await connection.query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [testUser.id, tokenHash, formattedExpiresAt]
    );

    console.log('Generated token & inserted tokenHash:', tokenHash.substring(0, 12) + '...');

    // Test token retrieval with expires_at > NOW()
    const [rows] = await connection.query(
      `SELECT id, expires_at, used_at FROM password_reset_tokens 
       WHERE user_id = ? AND token_hash = ? AND used_at IS NULL AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [testUser.id, tokenHash]
    );

    if (rows.length > 0) {
      console.log('SUCCESS! Valid token record found in DB:', rows[0]);
    } else {
      console.error('FAIL! Token record was NOT found or evaluated as expired in SQL query!');
    }

    await connection.end();
  } catch (err) {
    console.error('Test error:', err);
  }
}

testResetFlow();
