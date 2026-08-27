import { NextResponse } from 'next/server';
import { createCoupon, getCoupons, getDealsCouponsWithUserUsage } from '@/services/coupon.service';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      code,
      description,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount_amount,
      usage_limit,
      per_user_limit,
      per_user_limit_period,
      starts_at,
      expires_at,
      expries_at,
      status,
    } = body;

    const finalExpiryDate = expires_at || expries_at || null;

    if (!code?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Coupon code is required',
        },
        { status: 400 }
      );
    }

    if (!['percentage', 'fixed'].includes(discount_type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid discount type',
        },
        { status: 400 }
      );
    }

    if (
      discount_value === undefined ||
      discount_value === null ||
      Number(discount_value) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Discount value must be greater than 0',
        },
        { status: 400 }
      );
    }

    if (!starts_at) {
      return NextResponse.json(
        {
          success: false,
          message: 'Start date is required',
        },
        { status: 400 }
      );
    }

    if (discount_type === 'percentage' && Number(discount_value) > 100) {
      return NextResponse.json(
        {
          success: false,
          message: 'Percentage discount cannot exceed 100%',
        },
        { status: 400 }
      );
    }

    if (finalExpiryDate && new Date(finalExpiryDate) < new Date(starts_at)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Expiry date cannot be before start date',
        },
        { status: 400 }
      );
    }

    await createCoupon({
      code: code.trim().toUpperCase(),
      description: description?.trim() || null,
      discount_type,
      discount_value: Number(discount_value),
      minimum_order_amount: Number(minimum_order_amount || 0),
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
      per_user_limit: per_user_limit ? Number(per_user_limit) : 1,
      per_user_limit_period: per_user_limit_period || 'lifetime',
      starts_at,
      expires_at: finalExpiryDate,
      status: status === 'inactive' ? 'inactive' : 'active',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Coupon created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create coupon error:', error);

    if (error?.message === 'COUPON_CODE_EXISTS') {
      return NextResponse.json(
        {
          success: false,
          message: 'Coupon code already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create coupon',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id ? Number((session?.user as any)?.id) : undefined;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') as 'active' | 'inactive' | null;

    if (status === 'active' && !search) {
      const dealsCoupons = await getDealsCouponsWithUserUsage(userId);
      return NextResponse.json(
        {
          success: true,
          data: dealsCoupons,
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    const coupons = await getCoupons({
      search,
      status: status || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: coupons,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Get coupons error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch coupons',
      },
      { status: 500 }
    );
  }
}
