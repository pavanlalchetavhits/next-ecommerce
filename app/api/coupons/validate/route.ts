import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal = 0 } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const [rows] = await db.query(
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
        status
      FROM coupons
      WHERE code = ?
      LIMIT 1
      `,
      [cleanCode]
    );

    const coupons = rows as any[];

    if (coupons.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid promo code' },
        { status: 404 }
      );
    }

    const coupon = coupons[0];
    const now = new Date();

    if (coupon.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'This promo code is no longer active' },
        { status: 400 }
      );
    }

    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return NextResponse.json(
        { success: false, message: 'This promo code is not valid yet' },
        { status: 400 }
      );
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return NextResponse.json(
        { success: false, message: 'This promo code has expired' },
        { status: 400 }
      );
    }

    const minAmount = Number(coupon.minimum_order_amount || 0);
    if (subtotal < minAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order amount of $${minAmount.toFixed(2)} required for this coupon`,
        },
        { status: 400 }
      );
    }

    if (
      coupon.usage_limit !== null &&
      coupon.used_count >= coupon.usage_limit
    ) {
      return NextResponse.json(
        { success: false, message: 'This promo code usage limit has been reached' },
        { status: 400 }
      );
    }

    let discount = 0;
    const discountVal = Number(coupon.discount_value);

    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * discountVal) / 100;
      if (coupon.maximum_discount_amount !== null) {
        const maxDisc = Number(coupon.maximum_discount_amount);
        discount = Math.min(discount, maxDisc);
      }
    } else {
      discount = Math.min(discountVal, subtotal);
    }

    discount = Math.round(discount * 100) / 100;

    return NextResponse.json({
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: discountVal,
        discount_amount: discount,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
