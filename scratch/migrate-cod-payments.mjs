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
  console.log("Checking for COD orders missing from payments table...");

  const [orders] = await pool.query(
    `SELECT o.id, o.order_number, o.total_amount, o.created_at, o.payment_status 
     FROM orders o 
     LEFT JOIN payments p ON p.order_id = o.id 
     WHERE p.id IS NULL`
  );

  console.log(`Found ${orders.length} orders missing payments records.`);

  for (const ord of orders) {
    const status = ord.payment_status === 'paid' ? 'success' : 'pending';
    await pool.query(
      `INSERT INTO payments 
        (order_id, payment_gateway, payment_id, order_reference, amount, status, payment_method, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ord.id,
        'cod',
        `COD-${ord.id}`,
        ord.order_number,
        ord.total_amount,
        status,
        'cod',
        ord.created_at,
      ]
    );
    console.log(`Inserted payment record for Order #${ord.order_number}`);
  }

  console.log("Migration complete!");
  process.exit(0);
} catch (err) {
  console.error("Migration error:", err);
  process.exit(1);
}
