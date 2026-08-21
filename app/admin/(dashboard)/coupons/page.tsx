import { getCoupons } from '@/services/coupon.service';
import CouponManager, { CouponItem } from '@/components/admin/CouponManager';

export const revalidate = 0;

export default async function AdminCouponsPage() {
  const couponsRaw: any = await getCoupons({});

  const coupons: CouponItem[] = (couponsRaw || []).map((c: any) => ({
    id: Number(c.id),
    code: c.code,
    description: c.description || null,
    discount_type: c.discount_type || 'percentage',
    discount_value: Number(c.discount_value || 0),
    minimum_order_amount: Number(c.minimum_order_amount || 0),
    maximum_discount_amount: c.maximum_discount_amount
      ? Number(c.maximum_discount_amount)
      : null,
    usage_limit: c.usage_limit ? Number(c.usage_limit) : null,
    used_count: Number(c.used_count || 0),
    starts_at: c.starts_at ? new Date(c.starts_at).toISOString() : new Date().toISOString(),
    expires_at: c.expires_at ? new Date(c.expires_at).toISOString() : null,
    status: c.status || 'active',
    created_at: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
  }));

  return <CouponManager coupons={coupons} />;
}
