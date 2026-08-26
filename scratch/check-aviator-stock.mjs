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
  const [products] = await pool.query(
    `SELECT p.id, p.name, p.sku, 
            COALESCE((SELECT SUM(quantity) FROM inventory WHERE product_id = p.id), 0) as stock_quantity 
     FROM products p 
     WHERE p.name LIKE '%Aviator%' OR p.name LIKE '%Sunglasses%'`
  );
  console.log("Matching products in DB:", products);
  process.exit(0);
} catch (err) {
  console.error("Error querying DB:", err);
  process.exit(1);
}
