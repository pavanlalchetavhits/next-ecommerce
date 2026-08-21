import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import mysql from 'mysql2/promise';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const requiredEnvironment = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);

if (missingEnvironment.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvironment.join(', ')}`);
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

try {
  console.log('Migrating settings table schema...');

  await connection.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) NOT NULL UNIQUE,
      setting_value TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  console.log('+ Created settings table in MySQL.');

  // Default initial store settings
  const defaultSettings = [
    { key: 'store_name', value: 'NexCart' },
    { key: 'store_tagline', value: 'Modern E-Commerce Store' },
    { key: 'support_email', value: 'support@nexcart.com' },
    { key: 'support_phone', value: '+1 (800) 123-4567' },
    { key: 'store_address', value: '123 E-Commerce Way, Tech City, CA 90210' },
    { key: 'currency', value: 'USD' },
    { key: 'currency_symbol', value: '$' },
    { key: 'shipping_fee', value: '15.00' },
    { key: 'free_shipping_threshold', value: '100.00' },
    { key: 'enable_tax', value: 'true' },
    { key: 'tax_rate', value: '5.00' },
    { key: 'enable_cod', value: 'true' },
    { key: 'min_order_amount', value: '10.00' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'low_stock_threshold', value: '5' },
  ];

  for (const item of defaultSettings) {
    await connection.query(
      `
      INSERT INTO settings (setting_key, setting_value)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE setting_value = COALESCE(setting_value, VALUES(setting_value))
    `,
      [item.key, item.value]
    );
  }

  console.log('+ Inserted default settings key-values.');
  console.log('Settings database migration completed successfully!');
} finally {
  await connection.end();
}
