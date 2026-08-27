import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import mysql from 'mysql2/promise';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env') });
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env.local') });

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
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

try {
  console.log('Migrating password_reset_tokens table schema...');

  await connection.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        token_hash CHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        used_at DATETIME NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_password_reset_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        INDEX idx_password_reset_user (user_id),
        INDEX idx_password_reset_expires (expires_at)
    ) ENGINE=InnoDB;
  `);

  console.log('+ Table password_reset_tokens created successfully!');
  console.log('Database migration completed successfully!');
} catch (err) {
  console.error('Migration failed:', err.message);
} finally {
  await connection.end();
}