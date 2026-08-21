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
  console.log('Seeding sample reviews...');

  // Get first admin or user ID
  const [userRows] = await connection.query('SELECT id FROM users LIMIT 1');
  if (!userRows || userRows.length === 0) {
    console.error('No users found to associate reviews with.');
    process.exit(1);
  }
  const userId = userRows[0].id;

  // Get products
  const [productRows] = await connection.query('SELECT id, name FROM products LIMIT 5');
  if (!productRows || productRows.length === 0) {
    console.log('No products found to seed reviews for.');
    process.exit(0);
  }

  const sampleReviews = [
    {
      rating: 5,
      title: 'Outstanding quality and build!',
      comment: 'Extremely satisfied with this product. Fast delivery and premium finish.',
      status: 'approved',
    },
    {
      rating: 4,
      title: 'Great value for money',
      comment: 'Works exactly as described. Might buy another one for my family.',
      status: 'approved',
    },
    {
      rating: 5,
      title: 'Highly recommended!',
      comment: 'Top-tier performance. Packaging was very neat and secure.',
      status: 'pending',
    },
    {
      rating: 2,
      title: 'Slightly disappointed',
      comment: 'Product arrived a day late. Quality is okay but could be improved.',
      status: 'pending',
    },
  ];

  for (let i = 0; i < Math.min(productRows.length, sampleReviews.length); i++) {
    const prod = productRows[i];
    const rev = sampleReviews[i];

    await connection.query(
      `
      INSERT INTO reviews (user_id, product_id, rating, title, comment, status)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        rating = VALUES(rating),
        title = VALUES(title),
        comment = VALUES(comment),
        status = VALUES(status)
    `,
      [userId, prod.id, rev.rating, rev.title, rev.comment, rev.status]
    );
  }

  console.log('+ Sample reviews seeded successfully!');
} finally {
  await connection.end();
}
