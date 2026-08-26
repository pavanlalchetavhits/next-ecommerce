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
  console.log("Migrating coupons database schema...");

  // 1. Add per_user_limit column to coupons table if not exists
  const [cols] = await pool.query(`SHOW COLUMNS FROM coupons LIKE 'per_user_limit'`);
  if (cols.length === 0) {
    await pool.query(`ALTER TABLE coupons ADD COLUMN per_user_limit INT DEFAULT 1 AFTER usage_limit`);
    console.log("Added per_user_limit column.");
  }

  // 2. Add per_user_limit_period column to coupons table if not exists
  const [cols2] = await pool.query(`SHOW COLUMNS FROM coupons LIKE 'per_user_limit_period'`);
  if (cols2.length === 0) {
    await pool.query(`ALTER TABLE coupons ADD COLUMN per_user_limit_period VARCHAR(30) DEFAULT 'lifetime' AFTER per_user_limit`);
    console.log("Added per_user_limit_period column.");
  }

  // 3. Create coupon_usages table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS coupon_usages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      coupon_id INT NOT NULL,
      user_id INT NOT NULL,
      order_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_coupon_user (coupon_id, user_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log("Created coupon_usages table.");

  // 4. Backfill existing orders with coupon_code into used_count and coupon_usages if any
  const [ordersWithCoupons] = await pool.query(
    `SELECT o.id as order_id, o.user_id, o.coupon_code, o.created_at, c.id as coupon_id 
     FROM orders o 
     JOIN coupons c ON UPPER(o.coupon_code) = UPPER(c.code) 
     WHERE o.coupon_code IS NOT NULL AND o.coupon_code != ''`
  );

  console.log(`Found ${ordersWithCoupons.length} past orders with coupons.`);

  for (const ord of ordersWithCoupons) {
    const [existingUsage] = await pool.query(
      `SELECT id FROM coupon_usages WHERE order_id = ? LIMIT 1`,
      [ord.order_id]
    );
    if (existingUsage.length === 0) {
      await pool.query(
        `INSERT INTO coupon_usages (coupon_id, user_id, order_id, created_at) VALUES (?, ?, ?, ?)`,
        [ord.coupon_id, ord.user_id, ord.order_id, ord.created_at]
      );
    }
  }

  // Update used_count for all coupons based on coupon_usages
  await pool.query(`
    UPDATE coupons c
    SET used_count = (
      SELECT COUNT(*) FROM coupon_usages cu WHERE cu.coupon_id = c.id
    )
  `);

  console.log("Migration completed successfully!");
  process.exit(0);
} catch (err) {
  console.error("Migration error:", err);
  process.exit(1);
}
