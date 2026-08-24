import db from '@/lib/db';

type GetPaymentParams = {
  search?: string;
  status?: string;
  payment_gateway?: string;
};

export async function getPayment({
  search,
  status,
  payment_gateway,
}: GetPaymentParams) {
  let sql = `
    SELECT
      p.id,
      p.order_id,
      p.payment_gateway,
      p.payment_id,
      p.order_reference,
      p.amount,
      p.status,
      p.payment_method,
      p.paid_at,
      p.created_at,
      p.updated_at,

      o.order_number,

      u.name AS customer_name,
      u.email AS customer_email

    FROM payments p

    INNER JOIN orders o
      ON o.id = p.order_id
    
    LEFT JOIN users u
      ON u.id = o.user_id
    
    WHERE 1 = 1
  `;

  const params: any[] = [];

  if (search) {
    sql += `
      AND (
        o.order_number LIKE ?
        OR p.payment_id LIKE ?
        OR p.order_reference LIKE ?
        OR u.name LIKE ?
        OR u.email LIKE ?
      )
    `;
    const value = `%${search}%`;
    params.push(value, value, value, value, value);
  }

  if (status) {
    sql += ` AND p.status = ? `;
    params.push(status);
  }

  if (payment_gateway) {
    sql += ` AND p.payment_gateway = ? `;
    params.push(payment_gateway);
  }

  sql += ` ORDER BY p.created_at DESC `;

  const [rows] = await db.query(sql, params);
  return rows;
}

export async function getPaymentById(id: number) {
  const [rows] = await db.query(
    `
    SELECT
      p.id,
      p.order_id,
      p.payment_gateway,
      p.payment_id,
      p.order_reference,
      p.amount,
      p.status,
      p.payment_method,
      p.gateway_response,
      p.paid_at,
      p.created_at,
      p.updated_at,
      
      o.order_number,
      o.total_amount AS order_total,
      o.payment_status AS order_payment_status,

      u.id AS user_id,
      u.name AS customer_name,
      u.email AS customer_email,
      u.phone AS customer_phone

    FROM payments p

    INNER JOIN orders o
      ON o.id = p.order_id

    LEFT JOIN users u
      ON u.id = o.user_id

    WHERE p.id = ?

    LIMIT 1
  `,
    [id]
  );

  const payment = (rows as any[])[0];
  if (!payment) {
    return null;
  }
  return payment;
}

export type CreatePaymentParams = {
  order_id: number;
  payment_gateway: 'razorpay' | 'cashfree' | 'cod';
  payment_id?: string;
  order_reference?: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded';
  payment_method?: string;
  gateway_response?: any;
};

export async function createPaymentTransaction(data: CreatePaymentParams) {
  const [result] = await db.query(
    `
    INSERT INTO payments (
      order_id,
      payment_gateway,
      payment_id,
      order_reference,
      amount,
      status,
      payment_method,
      gateway_response,
      paid_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      data.order_id,
      data.payment_gateway,
      data.payment_id || null,
      data.order_reference || null,
      data.amount,
      data.status,
      data.payment_method || null,
      data.gateway_response ? JSON.stringify(data.gateway_response) : null,
      data.status === 'success' ? new Date() : null,
    ]
  );

  const insertId = (result as any).insertId;

  if (data.status === 'success') {
    await db.query(
      `
      UPDATE orders
      SET payment_status = 'paid', status = 'confirmed'
      WHERE id = ?
    `,
      [data.order_id]
    );
  }

  return insertId;
}