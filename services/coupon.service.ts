import db from '@/lib/db';

export type CouponInput = {
  code: string;
  description?: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount?: number;
  maximum_discount_amount?: number | null;
  usage_limit?: number | null;
  starts_at: string;
  expires_at?: string | null;
  status?: 'active' | 'inactive';
};

export async function createCoupon(data: CouponInput) {
  const {
    code,
    description,
    discount_type,
    discount_value,
    minimum_order_amount = 0,
    maximum_discount_amount = null,
    usage_limit = null,
    starts_at,
    expires_at = null,
    status = 'active',
  } = data;

  const [existing]: any = await db.query(
    `
        select id
        from coupons
        where code = ?
        LIMIT 1    
    `,
    [code]
  );

  if (Array.isArray(existing) && existing.length > 0) {
    throw new Error('COUPON_CODE_EXISTS');
  }

  const [result] = await db.query(
    `
        insert into coupons(
            code,
            description,
            discount_type,
            discount_value,
            minimum_order_amount,
            maximum_discount_amount,
            usage_limit,
            used_count,
            starts_at,
            expires_at,
            status
        ) values (?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      code,
      description || null,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount_amount,
      usage_limit,
      0,
      starts_at,
      expires_at || null,
      status,
    ]
  );

  return result;
}

export async function getCoupons({
  search,
  status,
}: {
  search?: string;
  status?: 'active' | 'inactive';
}) {
  let sql = `
        select
            id,
            code,
            description,
            discount_type,
            discount_value,
            minimum_order_amount,
            maximum_discount_amount,
            usage_limit,
            used_count,
            starts_at,
            expires_at,
            status,
            created_at,
            updated_at
        from coupons
        where 1 = 1
    `;

  const params: any[] = [];

  if (search) {
    sql += `
            AND (
                code LIKE ?
                OR description LIKE ?
            )
        `;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    sql += `
            AND status = ?
        `;
    params.push(status);
  }

  sql += ` ORDER BY created_at DESC`;

  const [rows] = await db.query(sql, params);

  return rows;
}

export async function getCouponById(id: number) {
  const [rows]: any = await db.query(
    `
    SELECT
      id,
      code,
      description,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount_amount,
      usage_limit,
      used_count,
      starts_at,
      expires_at,
      status,
      created_at,
      updated_at
    FROM coupons
    WHERE id = ?
    LIMIT 1
  `,
    [id]
  );

  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }

  return null;
}

export async function updateCoupon(id: number, data: Partial<CouponInput>) {
  // Check if code is being changed and if new code already exists
  if (data.code) {
    const [existing]: any = await db.query(
      `
      SELECT id FROM coupons
      WHERE code = ? AND id != ?
      LIMIT 1
      `,
      [data.code, id]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      throw new Error('COUPON_CODE_EXISTS');
    }
  }

  const [result] = await db.query(
    `
    UPDATE coupons
    SET
      code = COALESCE(?, code),
      description = ?,
      discount_type = COALESCE(?, discount_type),
      discount_value = COALESCE(?, discount_value),
      minimum_order_amount = COALESCE(?, minimum_order_amount),
      maximum_discount_amount = ?,
      usage_limit = ?,
      starts_at = COALESCE(?, starts_at),
      expires_at = ?,
      status = COALESCE(?, status)
    WHERE id = ?
  `,
    [
      data.code || null,
      data.description !== undefined ? data.description : null,
      data.discount_type || null,
      data.discount_value !== undefined ? data.discount_value : null,
      data.minimum_order_amount !== undefined
        ? data.minimum_order_amount
        : null,
      data.maximum_discount_amount !== undefined
        ? data.maximum_discount_amount
        : null,
      data.usage_limit !== undefined ? data.usage_limit : null,
      data.starts_at || null,
      data.expires_at !== undefined ? data.expires_at : null,
      data.status || null,
      id,
    ]
  );

  return result;
}

export async function deleteCoupon(id: number) {
  const [result] = await db.query(
    `
    DELETE FROM coupons
    WHERE id = ?
  `,
    [id]
  );

  return result;
}