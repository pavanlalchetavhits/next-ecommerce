import db from '@/lib/db';

export async function getOrders({
  search,
  status,
  paymentStatus,
}: {
  search?: string;
  status?: string;
  paymentStatus?: string;
}) {
  let sql = `
        select
            o.id,
            o.order_number,
            o.user_id,

            o.subtotal,
            o.discount_amount,
            o.shipping_amount,
            o.tax_amount,
            o.total_amount,

            o.coupon_code,

            o.status,
            o.payment_status,

            o.shipping_full_name,
            o.shipping_phone,
            o.shipping_address_line1,
            o.shipping_city,
            o.shipping_state,
            o.shipping_postal_code,

            o.created_at,
            o.updated_at,

            u.name as customer_name,
            u.email as customer_email,

            (
                select COUNT(*)
                FROM order_items oi
                where oi.order_id = o.id
            ) as item_count
            
        from orders o

        left join users u
            ON u.id = o.user_id

        where 1 = 1
    `;

  const params: any[] = [];

  if (search) {
    sql += `
            AND (
                o.order_number LIKE ?
                OR o.shipping_full_name LIKE ?
                OR u.name LIKE ?
                OR u.email LIKE ?
            )
        `;

    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    sql += `
            AND o.status = ?
        `;

    params.push(status);
  }

  if (paymentStatus) {
    sql += `
            AND o.payment_status = ?
        `;

    params.push(paymentStatus);
  }

  sql += `
        ORDER BY o.created_at DESC
    `;

  const [rows] = await db.query(sql, params);

  return rows;
}

export async function getOrderById(orderId: number) {
  const [orderRows] = await db.query(
    `
        select
            o.*,
            
            u.name as customer_name,
            u.email as customer_email,
            u.phone as customer_phone
        
        from orders o

        left join users u
            ON u.id = o.user_id
        
        where o.id = ?

        LIMIT 1
    `,
    [orderId]
  );

  const orders = orderRows as any[];

  if (orders.length === 0) {
    return null;
  }

  const order = orders[0];

  const [itemsRows] = await db.query(
    `
        select
            oi.id,
            
            oi.product_id,
            oi.variant_id,

            oi.product_name,
            oi.variant_name,
            oi.sku,

            oi.quantity,
            oi.unit_price,
            oi.total_price,

            p.slug as product_slug,

            (
                select pi.image_url
                from product_images pi
                where pi.product_id = oi.product_id
                order by pi.is_primary desc, pi.id asc
                limit 1
            ) as product_image

        from order_items oi

        left join products p
            on p.id = oi.product_id
        
        where oi.order_id = ?

        order by oi.id asc
    `,
    [orderId]
  );

  return {
    ...order,
    items: itemsRows,
  };
}

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

export async function updateOrderStatus(orderId: number, status: string) {
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    throw new Error('Invalid_Order_Status');
  }

  const [result] = await db.query(
    `
        update orders
        set status = ?
        where id = ?    
    `,
    [status, orderId]
  );

  return result;
}