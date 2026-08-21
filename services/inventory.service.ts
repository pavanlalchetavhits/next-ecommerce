import db from '@/lib/db';

export async function getProductInventroy(productId: number) {
  const [rows] = await db.query(
    `
        select
            i.id,
            i.product_id,
            i.variant_id,
            i.quantity,
            i.reserved_quantity,
            i.low_stock_threshold,

            pv.variant_name,
            pv.sku as variant_sku
        
        from inventory i

        left join product_variants pv
            On i.variant_id = pv.id
        
        where i.product_id = ?

        order by i.id asc
    `,
    [productId]
  );

  return rows;
}

export async function getAllInventory() {
  const [rows] = await db.query(`
    SELECT
      p.id as product_id,
      p.name as product_name,
      p.sku as product_sku,
      p.price as product_price,
      p.status as product_status,
      c.name as category_name,

      (
        SELECT pi.image_url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
        LIMIT 1
      ) as primary_image,

      i.id as inventory_id,
      i.variant_id,
      COALESCE(i.quantity, 0) as quantity,
      COALESCE(i.reserved_quantity, 0) as reserved_quantity,
      COALESCE(i.low_stock_threshold, 5) as low_stock_threshold,
      i.updated_at,

      pv.variant_name,
      pv.sku as variant_sku

    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN inventory i ON p.id = i.product_id
    LEFT JOIN product_variants pv ON i.variant_id = pv.id

    ORDER BY p.created_at DESC, i.id ASC
  `);

  return rows;
}

export async function createInventory(data: {
  product_id: number;
  variant_id?: number | null;
  quantity?: number;
  reserved_quantity?: number;
  low_stock_threshold?: number;
}) {
  const [result] = await db.query(
    `
        insert into inventory(
            product_id,
            variant_id,
            quantity,
            reserved_quantity,
            low_stock_threshold
        ) values (?,?,?,?,?)
    `,
    [
      data.product_id,
      data.variant_id ?? null,
      data.quantity ?? 0,
      data.reserved_quantity ?? 0,
      data.low_stock_threshold ?? 5,
    ]
  );

  return result;
}

export async function updateInventory(
  id: number,
  data: {
    quantity: number;
    reserved_quantity: number;
    low_stock_threshold: number;
  }
) {
  const [result] = await db.query(
    `
        update inventory
        set
            quantity = ?,
            reserved_quantity = ?,
            low_stock_threshold = ?
        where id = ?
    `,
    [data.quantity, data.reserved_quantity, data.low_stock_threshold, id]
  );

  return result;
}

export async function upsertInventoryStock(data: {
  inventory_id?: number | null;
  product_id: number;
  variant_id?: number | null;
  quantity: number;
  reserved_quantity?: number;
  low_stock_threshold: number;
}) {
  if (data.inventory_id && Number(data.inventory_id) > 0) {
    const [result] = await db.query(
      `
      UPDATE inventory
      SET quantity = ?,
          reserved_quantity = ?,
          low_stock_threshold = ?
      WHERE id = ?
      `,
      [
        data.quantity,
        data.reserved_quantity ?? 0,
        data.low_stock_threshold,
        data.inventory_id,
      ]
    );
    return result;
  }

  // Check if inventory record already exists for this product_id and variant_id
  const [existing]: any = await db.query(
    `
    SELECT id FROM inventory
    WHERE product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))
    LIMIT 1
    `,
    [data.product_id, data.variant_id ?? null, data.variant_id ?? null]
  );

  if (Array.isArray(existing) && existing.length > 0) {
    const invId = existing[0].id;
    const [result] = await db.query(
      `
      UPDATE inventory
      SET quantity = ?,
          reserved_quantity = ?,
          low_stock_threshold = ?
      WHERE id = ?
      `,
      [
        data.quantity,
        data.reserved_quantity ?? 0,
        data.low_stock_threshold,
        invId,
      ]
    );
    return result;
  }

  // Insert new inventory record
  const [result] = await db.query(
    `
    INSERT INTO inventory (
      product_id,
      variant_id,
      quantity,
      reserved_quantity,
      low_stock_threshold
    ) VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.product_id,
      data.variant_id ?? null,
      data.quantity,
      data.reserved_quantity ?? 0,
      data.low_stock_threshold,
    ]
  );

  return result;
}