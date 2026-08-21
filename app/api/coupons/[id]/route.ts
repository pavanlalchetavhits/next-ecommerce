import { NextResponse } from 'next/server';
import {
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from '@/services/coupon.service';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const couponId = Number(id);

    if (!Number.isInteger(couponId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid coupon ID' },
        { status: 400 }
      );
    }

    const coupon = await getCouponById(couponId);

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error('GET /api/coupons/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch coupon details' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const couponId = Number(id);

    if (!Number.isInteger(couponId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid coupon ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      code,
      description,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount_amount,
      usage_limit,
      starts_at,
      expires_at,
      expries_at,
      status,
    } = body;

    const finalExpiryDate = expires_at || expries_at || null;

    if (code && !code.trim()) {
      return NextResponse.json(
        { success: false, message: 'Coupon code cannot be empty' },
        { status: 400 }
      );
    }

    if (discount_type && !['percentage', 'fixed'].includes(discount_type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid discount type' },
        { status: 400 }
      );
    }

    if (discount_value !== undefined && Number(discount_value) <= 0) {
      return NextResponse.json(
        { success: false, message: 'Discount value must be greater than 0' },
        { status: 400 }
      );
    }

    if (
      discount_type === 'percentage' &&
      discount_value !== undefined &&
      Number(discount_value) > 100
    ) {
      return NextResponse.json(
        { success: false, message: 'Percentage discount cannot exceed 100%' },
        { status: 400 }
      );
    }

    await updateCoupon(couponId, {
      code: code ? code.trim().toUpperCase() : undefined,
      description: description !== undefined ? description?.trim() || null : undefined,
      discount_type,
      discount_value: discount_value !== undefined ? Number(discount_value) : undefined,
      minimum_order_amount:
        minimum_order_amount !== undefined ? Number(minimum_order_amount) : undefined,
      maximum_discount_amount:
        maximum_discount_amount !== undefined &&
        maximum_discount_amount !== null &&
        maximum_discount_amount !== ''
          ? Number(maximum_discount_amount)
          : null,
      usage_limit:
        usage_limit !== undefined && usage_limit !== null && usage_limit !== ''
          ? Number(usage_limit)
          : null,
      starts_at,
      expires_at: finalExpiryDate,
      status,
    });

    return NextResponse.json({
      success: true,
      message: 'Coupon updated successfully',
    });
  } catch (error: any) {
    console.error('PUT /api/coupons/[id] error:', error);

    if (error?.message === 'COUPON_CODE_EXISTS') {
      return NextResponse.json(
        { success: false, message: 'Another coupon with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const couponId = Number(id);

    if (!Number.isInteger(couponId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid coupon ID' },
        { status: 400 }
      );
    }

    await deleteCoupon(couponId);

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/coupons/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
