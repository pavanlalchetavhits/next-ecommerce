import db from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ProductInput } from '@/lib/validations/products';
import { syncProductImages } from '@/services/product-image.service';

export interface ProductFilters {
  search?: string;
  category_id?: number | string;
  sort?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  paginate?: boolean;
}

/**
 * Cached Products Getter using Next.js 'use cache' directive
 */
export async function getCachedProducts(filters: ProductFilters = {}) {
  'use cache';
  cacheTag('products');
  cacheLife('minutes');
  return getProducts(filters);
}

export async function getProducts(filters: ProductFilters = {}) {
  const whereClauses: string[] = [];
  const queryParams: any[] = [];

  if (filters.search && filters.search.trim()) {
    const searchTerm = `%${filters.search.trim()}%`;
    whereClauses.push(
      '(p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ? OR p.sku LIKE ? OR c.name LIKE ?)'
    );
    queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (filters.category_id !== undefined && filters.category_id !== null && filters.category_id !== '') {
    if (!isNaN(Number(filters.category_id))) {
      whereClauses.push('p.category_id = ?');
      queryParams.push(Number(filters.category_id));
    } else {
      whereClauses.push('(c.slug = ? OR c.name = ?)');
      queryParams.push(filters.category_id, filters.category_id);
    }
  }

  if (filters.featured) {
    whereClauses.push('p.featured = 1');
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  let orderBySql = 'ORDER BY p.created_at DESC';
  if (filters.sort === 'price_low') {
    orderBySql = 'ORDER BY p.price ASC';
  } else if (filters.sort === 'price_high') {
    orderBySql = 'ORDER BY p.price DESC';
  } else if (filters.sort === 'name_asc') {
    orderBySql = 'ORDER BY p.name ASC';
  } else if (filters.sort === 'name_desc') {
    orderBySql = 'ORDER BY p.name DESC';
  }

  const shouldPaginate = Boolean(filters.page || filters.limit || filters.paginate);
  let total = 0;

  if (shouldPaginate) {
    const [countRows]: any = await db.query(
      `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereSql}`,
      queryParams
    );
    total = countRows[0]?.total || 0;
  }

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(filters.limit) || 12));
  const offset = (page - 1) * limit;

  const limitSql = shouldPaginate ? `LIMIT ? OFFSET ?` : '';
  const finalParams = shouldPaginate ? [...queryParams, limit, offset] : queryParams;

  const [rows] = await db.query(
    `
    select
        p.id,
        p.category_id,
        p.name,
        p.slug,
        p.short_description,
        p.sku,
        p.price,
        p.compare_at_price,
        p.status,
        p.featured,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        COALESCE(inv.stock_quantity, 0) as stock_quantity,
        img.image_url as primary_image
    from products p
    left join categories c
        ON p.category_id = c.id
    left join (
        select product_id, SUM(quantity) as stock_quantity
        from inventory
        group by product_id
    ) inv ON inv.product_id = p.id
    left join (
        select pi1.product_id, pi1.image_url
        from product_images pi1
        inner join (
            select product_id, MIN(id) as min_id
            from product_images
            group by product_id
        ) pi2 ON pi1.id = pi2.min_id
    ) img ON img.product_id = p.id
    ${whereSql}
    ${orderBySql}
    ${limitSql}
    `,
    finalParams
  );

  if (shouldPaginate) {
    return {
      products: rows as any[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  return rows as any[];
}

export async function getProductById(id: number) {
  const [rows] = await db.query(
    `
        select
            p.id,
            p.category_id,
            p.name,
            p.slug,
            p.description,
            p.short_description,
            p.care_instructions,
            p.specifications,
            p.shipping_info,
            p.faq,
            p.sku,
            p.price,
            p.compare_at_price,
            p.status,
            p.featured,
            p.created_at,
            p.updated_at,
            COALESCE((select sum(quantity) from inventory where product_id = p.id), 0) as stock_quantity,
            c.name as category_name
        from products p

        inner join categories c
            ON p.category_id = c.id

        where p.id = ?

        ORDER BY p.created_at DESC
        `,
    [id]
  );

  const productsRows = rows as any[];

  if (productsRows.length === 0) {
    return null;
  }

  const product = productsRows[0];

  // Safely parse JSON fields if MySQL returns string
  if (typeof product.specifications === 'string') {
    try {
      product.specifications = JSON.parse(product.specifications);
    } catch {
      // Keep original string if HTML content
    }
  }
  if (typeof product.faq === 'string') {
    try {
      product.faq = JSON.parse(product.faq);
    } catch {
      product.faq = [];
    }
  }

  const [images] = await db.query(
    `
        select
            id,
            image_url,
            alt_text,
            is_primary,
            sort_order
        from product_images
        where product_id = ?
        order by sort_order asc, created_at asc
        `,
    [id]
  );
  return {
    ...product,
    images,
  };
}

export async function getProductByIdOrSlug(idOrSlug: string | number) {
  const isId = !isNaN(Number(idOrSlug));
  const whereSql = isId ? 'p.id = ?' : 'p.slug = ?';
  const param = isId ? Number(idOrSlug) : String(idOrSlug);

  const [rows] = await db.query(
    `
        select
            p.id,
            p.category_id,
            p.name,
            p.slug,
            p.description,
            p.short_description,
            p.care_instructions,
            p.specifications,
            p.shipping_info,
            p.faq,
            p.sku,
            p.price,
            p.compare_at_price,
            p.status,
            p.featured,
            p.created_at,
            p.updated_at,
            COALESCE((select sum(quantity) from inventory where product_id = p.id), 0) as stock_quantity,
            c.name as category_name
        from products p
        left join categories c ON p.category_id = c.id
        where ${whereSql}
        limit 1
    `,
    [param]
  );

  const productsRows = rows as any[];
  if (productsRows.length === 0) return null;

  const product = productsRows[0];

  if (typeof product.specifications === 'string') {
    try {
      product.specifications = JSON.parse(product.specifications);
    } catch {
      // Keep string HTML content if rich text
    }
  }
  if (typeof product.faq === 'string') {
    try {
      product.faq = JSON.parse(product.faq);
    } catch {
      product.faq = [];
    }
  }

  const [images] = await db.query(
    `
        select id, image_url, alt_text, is_primary, sort_order
        from product_images
        where product_id = ?
        order by is_primary desc, sort_order asc, id asc
    `,
    [product.id]
  );

  return {
    ...product,
    images: images as any[],
  };
}

export async function createProduct(data: ProductInput) {
  const specsJson = data.specifications ? JSON.stringify(data.specifications) : null;
  const faqJson = data.faq ? JSON.stringify(data.faq) : null;

  const [result] = await db.query(
    `
        insert into products(
            category_id,
            name,
            slug,
            description,
            short_description,
            care_instructions,
            specifications,
            shipping_info,
            faq,
            sku,
            price,
            compare_at_price,
            status,
            featured
        ) Values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
    [
      data.category_id,
      data.name,
      data.slug,
      data.description || null,
      data.short_description || null,
      data.care_instructions || null,
      specsJson,
      data.shipping_info || null,
      faqJson,
      data.sku,
      data.price,
      data.compare_at_price ?? null,
      data.status,
      data.featured,
    ]
  );

  const insertId = (result as any).insertId;
  if (insertId && data.images && Array.isArray(data.images)) {
    await syncProductImages(insertId, data.images);
  }

  return result;
}

export async function updateProduct(id: number, data: ProductInput) {
  const specsJson = data.specifications ? JSON.stringify(data.specifications) : null;
  const faqJson = data.faq ? JSON.stringify(data.faq) : null;

  const [result] = await db.query(
    `
        update products
        SET
            category_id = ?,
            name = ?,
            slug = ?,
            description = ?,
            short_description = ?,
            care_instructions = ?,
            specifications = ?,
            shipping_info = ?,
            faq = ?,
            sku = ?,
            price = ?,
            compare_at_price = ?,
            status = ?,
            featured = ?
        where id = ?
        `,
    [
      data.category_id,
      data.name,
      data.slug,
      data.description || null,
      data.short_description || null,
      data.care_instructions || null,
      specsJson,
      data.shipping_info || null,
      faqJson,
      data.sku,
      data.price,
      data.compare_at_price ?? null,
      data.status,
      data.featured,
      id,
    ]
  );

  if (data.images && Array.isArray(data.images)) {
    await syncProductImages(id, data.images);
  }

  return result;
}

export async function deleteProduct(id: number) {
  const [result] = await db.query(
    `
        delete from products where id = ?
        `,
    [id]
  );
  return result;
}