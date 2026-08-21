import db from '@/lib/db';

export async function addProductImage(data: {
  product_id: number;
  image_url: string;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}) {
  if (data.is_primary) {
    await db.query(
      `
      update product_images
      set is_primary=FALSE
      where product_id = ?
      `,
      [data.product_id]
    );
  }

  // Check if image URL already exists for this product to prevent duplicate rows
  const [existingRows]: any = await db.query(
    `
    SELECT id FROM product_images
    WHERE product_id = ? AND image_url = ?
    LIMIT 1
    `,
    [data.product_id, data.image_url]
  );

  if (Array.isArray(existingRows) && existingRows.length > 0) {
    const existingId = existingRows[0].id;
    const [result] = await db.query(
      `
      UPDATE product_images
      SET alt_text = ?,
          is_primary = ?,
          sort_order = ?
      WHERE id = ?
      `,
      [
        data.alt_text || null,
        data.is_primary || false,
        data.sort_order || 0,
        existingId,
      ]
    );
    return result;
  }

  const [result] = await db.query(
    `
    insert into product_images(
        product_id,
        image_url,
        alt_text,
        is_primary,
        sort_order
    ) values (?,?,?,?,?)
    `,
    [
      data.product_id,
      data.image_url,
      data.alt_text || null,
      data.is_primary || false,
      data.sort_order || 0,
    ]
  );
  return result;
}

export async function getProductImages(productId: number) {
  const [rows] = await db.query(
    `
    SELECT
      id,
      product_id,
      image_url,
      alt_text,
      is_primary,
      sort_order,
      created_at
    FROM product_images
    WHERE product_id = ?
    ORDER BY sort_order ASC, created_at ASC
    `,
    [productId]
  );

  return rows;
}

export async function deleteProductImage(id: number) {
  const [result] = await db.query(
    `
    DELETE FROM product_images
    WHERE id = ?
    `,
    [id]
  );

  return result;
}

export async function syncProductImages(
  productId: number,
  images: Array<{
    id?: number;
    image_url: string;
    alt_text?: string | null;
    is_primary?: boolean;
    sort_order?: number;
  }>
) {
  if (!productId) return;

  // 1. Fetch current database images for this product
  const [existingRows]: any = await db.query(
    `SELECT id, image_url FROM product_images WHERE product_id = ?`,
    [productId]
  );

  const existingMap = new Map<number, string>();
  if (Array.isArray(existingRows)) {
    for (const r of existingRows) {
      existingMap.set(Number(r.id), r.image_url);
    }
  }

  // 2. Determine images that are kept by user
  const keptIds = new Set(
    (images || [])
      .map((img) => (img.id ? Number(img.id) : null))
      .filter((id): id is number => id !== null && existingMap.has(id))
  );

  // 3. Delete any images in DB that were removed by user in UI
  for (const [existingId] of existingMap.entries()) {
    if (!keptIds.has(existingId)) {
      await deleteProductImage(existingId);
    }
  }

  // 4. Update or Insert remaining/new images with correct sort_order
  if (Array.isArray(images)) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await addProductImage({
        product_id: productId,
        image_url: img.image_url,
        alt_text: img.alt_text || undefined,
        is_primary: Boolean(img.is_primary),
        sort_order: i,
      });
    }
  }
}