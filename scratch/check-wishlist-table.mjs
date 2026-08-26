import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'next_ecommerce',
});

try {
  const [tables] = await pool.query(`SHOW TABLES LIKE 'wishlist'`);
  console.log("Wishlist table exists:", tables.length > 0);

  if (tables.length === 0) {
    console.log("Creating wishlist table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_product_unique (user_id, product_id),
        KEY idx_user_id (user_id),
        KEY idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("Created wishlist table successfully!");
  } else {
    const [columns] = await pool.query(`SHOW COLUMNS FROM wishlist`);
    console.log("Wishlist columns:", columns.map(c => c.Field));
  }

  process.exit(0);
} catch (err) {
  console.error("Wishlist check error:", err);
  process.exit(1);
}
