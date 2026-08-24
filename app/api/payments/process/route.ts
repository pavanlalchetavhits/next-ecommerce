import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { createPaymentTransaction } from '@/services/payment.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items = [],
      shipping_address,
      payment_gateway = 'razorpay',
      payment_method = 'credit_card',
      coupon_code = null,
      user_id = null,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart items cannot be empty' },
        { status: 400 }
      );
    }

    if (!shipping_address || !shipping_address.full_name || !shipping_address.address_line1) {
      return NextResponse.json(
        { success: false, message: 'Valid shipping address is required' },
        { status: 400 }
      );
    }

    // Determine target user_id (fallback to active admin/user or 1 if guest)
    let targetUserId = user_id;
    if (!targetUserId) {
      const [uRows] = await db.query(`SELECT id FROM users LIMIT 1`);
      const users = uRows as any[];
      if (users.length > 0) {
        targetUserId = users[0].id;
      } else {
        // Create demo guest user if missing
        const [res] = await db.query(
          `INSERT INTO users (name, email, password, role) VALUES ('Guest Customer', 'guest@nexcart.com', 'dummy_hash', 'user')`
        );
        targetUserId = (res as any).insertId;
      }
    }

    // Financial calculations
    let subtotal = 0;
    const validatedItems = items.map((item: any) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.unit_price) || 0);
      const total = qty * price;
      subtotal += total;
      return {
        ...item,
        quantity: qty,
        unit_price: price,
        total_price: total,
      };
    });

    let discount_amount = 0;
    let validCouponId: number | null = null;

    if (coupon_code) {
      const [cRows] = await db.query(
        `SELECT id, discount_type, discount_value, maximum_discount_amount, minimum_order_amount, usage_limit, used_count, status, expires_at FROM coupons WHERE code = ? LIMIT 1`,
        [coupon_code.trim().toUpperCase()]
      );
      const coupons = cRows as any[];
      if (coupons.length > 0) {
        const c = coupons[0];
        const minAmt = Number(c.minimum_order_amount || 0);
        if (c.status === 'active' && subtotal >= minAmt) {
          validCouponId = c.id;
          const discVal = Number(c.discount_value);
          if (c.discount_type === 'percentage') {
            discount_amount = (subtotal * discVal) / 100;
            if (c.maximum_discount_amount) {
              discount_amount = Math.min(discount_amount, Number(c.maximum_discount_amount));
            }
          } else {
            discount_amount = Math.min(discVal, subtotal);
          }
        }
      }
    }

    subtotal = Math.round(subtotal * 100) / 100;
    discount_amount = Math.round(discount_amount * 100) / 100;
    const shipping_amount = subtotal > 150 || subtotal === 0 ? 0 : 15.0;
    const taxableBase = Math.max(0, subtotal - discount_amount);
    const tax_amount = Math.round(taxableBase * 0.18 * 100) / 100; // 18% tax
    const total_amount = Math.round((taxableBase + shipping_amount + tax_amount) * 100) / 100;

    // Generate Order Number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_number = `ORD-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

    const orderStatus = payment_gateway === 'cod' ? 'confirmed' : 'confirmed';
    const paymentStatus = payment_gateway === 'cod' ? 'pending' : 'paid';

    // 1. Insert Order
    const [orderResult] = await db.query(
      `
      INSERT INTO orders (
        user_id,
        order_number,
        subtotal,
        discount_amount,
        shipping_amount,
        tax_amount,
        total_amount,
        coupon_code,
        status,
        payment_status,
        shipping_full_name,
        shipping_phone,
        shipping_address_line1,
        shipping_address_line2,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        targetUserId,
        order_number,
        subtotal,
        discount_amount,
        shipping_amount,
        tax_amount,
        total_amount,
        coupon_code || null,
        orderStatus,
        paymentStatus,
        shipping_address.full_name,
        shipping_address.phone || 'N/A',
        shipping_address.address_line1,
        shipping_address.address_line2 || null,
        shipping_address.city,
        shipping_address.state,
        shipping_address.postal_code,
        shipping_address.country || 'India',
        shipping_address.notes || null,
      ]
    );

    const orderId = (orderResult as any).insertId;

    // 2. Insert Order Items
    for (const item of validatedItems) {
      await db.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          variant_id,
          product_name,
          variant_name,
          sku,
          quantity,
          unit_price,
          total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.product_id,
          item.variant_id || null,
          item.product_name,
          item.variant_name || null,
          item.sku || null,
          item.quantity,
          item.unit_price,
          item.total_price,
        ]
      );
    }

    // 3. Insert Payment Record
    const transactionId = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const paymentRecordStatus = payment_gateway === 'cod' ? 'pending' : 'success';

    const paymentDbId = await createPaymentTransaction({
      order_id: orderId,
      payment_gateway: payment_gateway as 'razorpay' | 'cashfree' | 'cod',
      payment_id: transactionId,
      order_reference: `REF-${order_number}`,
      amount: total_amount,
      status: paymentRecordStatus,
      payment_method: payment_method,
      gateway_response: {
        gateway: payment_gateway,
        method: payment_method,
        processed_at: new Date().toISOString(),
        client_ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    });

    // 4. Update Coupon Usage if applicable
    if (validCouponId) {
      await db.query(
        `
        INSERT INTO coupon_usages (coupon_id, user_id, order_id, discount_amount)
        VALUES (?, ?, ?, ?)
        `,
        [validCouponId, targetUserId, orderId, discount_amount]
      );

      await db.query(
        `UPDATE coupons SET used_count = used_count + 1 WHERE id = ?`,
        [validCouponId]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        order_id: orderId,
        order_number: order_number,
        payment_db_id: paymentDbId,
        payment_id: transactionId,
        total_amount: total_amount,
        payment_status: paymentStatus,
        payment_gateway: payment_gateway,
        payment_method: payment_method,
      },
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process payment',
      },
      { status: 500 }
    );
  }
}
