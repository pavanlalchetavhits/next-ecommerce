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
  console.log('Migrating products table schema...');

  const columnsToAdd = [
    { name: 'short_description', type: 'TEXT NULL' },
    { name: 'care_instructions', type: 'TEXT NULL' },
    { name: 'specifications', type: 'JSON NULL' },
    { name: 'shipping_info', type: 'TEXT NULL' },
    { name: 'faq', type: 'JSON NULL' },
  ];

  for (const col of columnsToAdd) {
    try {
      await connection.query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
      console.log(`+ Added column '${col.name}' to products table.`);
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log(`Column '${col.name}' already exists.`);
      } else {
        console.error(`Error adding column '${col.name}':`, err.message);
      }
    }
  }

  console.log('Database migration completed successfully!');
} finally {
  await connection.end();
}
