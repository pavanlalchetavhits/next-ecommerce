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
  const [columns] = await pool.query(`SHOW COLUMNS FROM coupons`);
  console.log("Coupons columns:", columns.map(c => c.Field));
  
  const [usagesTable] = await pool.query(`SHOW TABLES LIKE 'coupon_usages'`);
  console.log("coupon_usages table exists:", usagesTable.length > 0);

  process.exit(0);
} catch (err) {
  console.error("Error:", err);
  process.exit(1);
}
