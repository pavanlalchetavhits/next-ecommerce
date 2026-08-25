import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const { default: db } = await import('../lib/db');
  const [categories]: any = await db.query('SELECT id, name, slug FROM categories ORDER BY id ASC');
  console.log('--- DATABASE CATEGORIES ---');
  console.table(categories);

  const [productsCount]: any = await db.query(`
    SELECT c.id as category_id, c.name as category_name, COUNT(p.id) as total_products
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id, c.name
    ORDER BY c.id ASC
  `);

  console.log('\n--- PRODUCTS PER CATEGORY ---');
  console.table(productsCount);

  process.exit(0);
}

check();
