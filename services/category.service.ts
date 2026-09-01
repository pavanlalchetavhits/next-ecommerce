import { cache } from 'react';
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import db from '@/lib/db';

/**
 * Cached Category List Getter using Next.js 'use cache' directive
 */
export async function getCachedCategories() {
  'use cache';
  cacheTag('categories');
  cacheLife('hours');
  return getCategories();
}

/**
 * Request-memoized Category Getter
 */
export const getCategories = cache(async function getCategories() {
  const [rows] = await db.query(`
      select
          id,
          name,
          slug,
          description,
          image,
          status,
          sort_order,
          created_at,
          updated_at
      from categories
      ORDER BY sort_order ASC, created_at DESC
  `);
  return rows as any[];
});

export const getCategoriesById = cache(async function getCategoriesById(id: number) {
  const [rows] = await db.query(
    `
      select
          id,
          name,
          slug,
          description,
          image,
          status,
          sort_order,
          created_at,
          updated_at
      FROM categories
      where id = ?
      `,
    [id]
  );
  return rows as any[];
});

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status?: 'active' | 'inactive';
  sort_order?: number;
}) {
  const [result] = await db.query(
    `
      insert into categories
          (name,slug,description,image,status,sort_order)
      VALUES
          (?,?,?,?,?,?)
      `,
    [
      data.name,
      data.slug,
      data.description || null,
      data.image || null,
      data.status || 'active',
      data.sort_order || 0,
    ]
  );

  try {
    (revalidateTag as any)('categories');
  } catch (e) {}

  return result;
}

export async function updateCategory(
  id: number,
  data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    status?: 'active' | 'inactive';
    sort_order?: number;
  }
) {
  const [result] = await db.query(
    `
      update categories
      SET
          name=?,
          slug=?,
          description=?,
          image=?,
          status=?,
          sort_order=?
      where id = ?
      `,
    [
      data.name,
      data.slug,
      data.description || null,
      data.image || null,
      data.status || 'active',
      data.sort_order || 0,
      id,
    ]
  );

  try {
    (revalidateTag as any)('categories');
  } catch (e) {}

  return result;
}

export async function deleteCategory(id: number) {
  const [result] = await db.query(`delete from categories where id=?`, [id]);

  try {
    (revalidateTag as any)('categories');
  } catch (e) {}

  return result;
}