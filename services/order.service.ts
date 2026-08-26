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

export async function createOrder(data: {
  user_id: number;
  address_id: number;
  coupon_code?: string | null;
  discount_amount?: number;
  shipping_amount?: number;
  tax_amount?: number;
  payment_method?: string;
  items: Array<{
    product_id: number;
    variant_id?: number | null;
    quantity: number;
  }>;
}) {
  // 1. Fetch shipping address
  const [addressRows]: any = await db.query(
    `SELECT * FROM addresses WHERE id = ? LIMIT 1`,
    [data.address_id]
  );
  const addr = addressRows[0] || {
    full_name: 'Customer',
    phone: '9999999999',
    address_line1: 'Default Address Line 1',
    address_line2: null,
    city: 'City',
    state: 'State',
    postal_code: '110001',
    country: 'India',
  };

  // 2. Validate product availability and stock quantity
  let subtotal = 0;
  const orderItemsData: any[] = [];

  for (const item of data.items) {
    const [pRows]: any = await db.query(
      `SELECT p.id, p.name, p.sku, p.price,
              COALESCE((SELECT SUM(quantity) FROM inventory WHERE product_id = p.id), 0) as stock_quantity
       FROM products p 
       WHERE p.id = ? LIMIT 1`,
      [item.product_id]
    );
    const p = pRows[0];
    if (!p) {
      throw new Error(`Product with ID #${item.product_id} was not found.`);
    }

    const availableStock = Number(p.stock_quantity) || 0;
    if (availableStock <= 0) {
      throw new Error(`"${p.name}" is currently out of stock and cannot be ordered.`);
    }
    if (item.quantity > availableStock) {
      throw new Error(`Only ${availableStock} units of "${p.name}" available in stock.`);
    }

    const unitPrice = Number(p.price);
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;
    orderItemsData.push({
      product_id: p.id,
      variant_id: item.variant_id || null,
      product_name: p.name,
      variant_name: null,
      sku: p.sku,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    });
  }

  // 3. Validate coupon usage if coupon_code is provided
  let couponRecord: any = null;
  if (data.coupon_code) {
    const cleanCouponCode = data.coupon_code.trim().toUpperCase();
    const [cRows]: any = await db.query(
      `SELECT * FROM coupons WHERE UPPER(code) = ? LIMIT 1`,
      [cleanCouponCode]
    );
    if (cRows.length > 0) {
      couponRecord = cRows[0];
      const perUserLimit = couponRecord.per_user_limit ? Number(couponRecord.per_user_limit) : 0;
      if (data.user_id && perUserLimit > 0) {
        const period = couponRecord.per_user_limit_period || 'lifetime';
        let periodCond = '';
        if (period === 'monthly' || period === 'once_per_month' || period === 'twice_per_month') {
          periodCond = `AND created_at >= DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00')`;
        }
        const [uRows]: any = await db.query(
          `SELECT COUNT(*) as u_count FROM coupon_usages WHERE user_id = ? AND coupon_id = ? ${periodCond}`,
          [data.user_id, couponRecord.id]
        );
        const userUsage = Number(uRows[0]?.u_count || 0);
        if (userUsage >= perUserLimit) {
          throw new Error(`You have reached the maximum usage limit for coupon ${cleanCouponCode}.`);
        }
      }
    }
  }

  const discount = Number(data.discount_amount) || 0;
  const shipping = Number(data.shipping_amount) || 0;
  const tax = Number(data.tax_amount) || 0;
  const totalAmount = Math.max(0, subtotal - discount + shipping + tax);
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

  const paymentStatus = data.payment_method === 'cod' ? 'pending' : 'pending';

  // Insert into orders table
  const [res]: any = await db.query(
    `INSERT INTO orders
      (user_id, order_number, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, coupon_code, status, payment_status, shipping_full_name, shipping_phone, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      orderNumber,
      subtotal,
      discount,
      shipping,
      tax,
      totalAmount,
      data.coupon_code || null,
      paymentStatus,
      addr.full_name,
      addr.phone,
      addr.address_line1,
      addr.address_line2 || null,
      addr.city,
      addr.state,
      addr.postal_code,
      addr.country || 'India',
    ]
  );

  const orderId = res.insertId;

  // Insert into order_items table and deduct stock
  for (const oi of orderItemsData) {
    await db.query(
      `INSERT INTO order_items
        (order_id, product_id, variant_id, product_name, variant_name, sku, quantity, unit_price, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        oi.product_id,
        oi.variant_id,
        oi.product_name,
        oi.variant_name,
        oi.sku,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
      ]
    );

    // Deduct quantity from inventory table
    await db.query(
      `UPDATE inventory SET quantity = GREATEST(0, quantity - ?) WHERE product_id = ?`,
      [oi.quantity, oi.product_id]
    );
  }

  // Record coupon usage and increment used_count
  if (couponRecord) {
    await db.query(
      `UPDATE coupons SET used_count = used_count + 1 WHERE id = ?`,
      [couponRecord.id]
    );
    if (data.user_id) {
      await db.query(
        `INSERT INTO coupon_usages (coupon_id, user_id, order_id, created_at) VALUES (?, ?, ?, NOW())`,
        [couponRecord.id, data.user_id, orderId]
      );
    }
  }

  // Record payment transaction in payments table for admin tracking
  const gateway = data.payment_method === 'cod' ? 'cod' : 'cashfree';
  const payStatus = 'pending';
  await db.query(
    `INSERT INTO payments
      (order_id, payment_gateway, payment_id, order_reference, amount, status, payment_method, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      orderId,
      gateway,
      `${gateway.toUpperCase()}-${orderId}`,
      orderNumber,
      totalAmount,
      payStatus,
      data.payment_method || 'cod',
    ]
  );

  return {
    order_id: orderId,
    order_number: orderNumber,
    total_amount: totalAmount,
  };
}