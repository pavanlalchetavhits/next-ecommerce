import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const requiredEnvironment = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
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
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    await connection.execute(
        `INSERT INTO users (name, email, password, role, status)
         VALUES (?, ?, ?, 'admin', 'active')
         ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            password = VALUES(password),
            role = 'admin',
            status = 'active'`,
        [process.env.ADMIN_NAME || 'Administrator', process.env.ADMIN_EMAIL, passwordHash],
    );

    console.log(`Admin account seeded for ${process.env.ADMIN_EMAIL}.`);
} finally {
    await connection.end();
}