import dotenv from 'dotenv';
dotenv.config();

const sampleCoupons = [
  {
    code: 'WELCOME10',
    description: 'Flat 10% instant discount on your first purchase. Valid on orders over ₹499.',
    discount_type: 'percentage' as const,
    discount_value: 10,
    minimum_order_amount: 499,
    maximum_discount_amount: 500,
    usage_limit: 500,
    starts_at: '2026-01-01 00:00:00',
    expires_at: '2026-12-31 23:59:59',
    status: 'active' as const,
  },
  {
    code: 'FESTIVE25',
    description: 'Special festive mega sale! Get 25% OFF on all electronics and premium collections.',
    discount_type: 'percentage' as const,
    discount_value: 25,
    minimum_order_amount: 1499,
    maximum_discount_amount: 1500,
    usage_limit: 300,
    starts_at: '2026-08-01 00:00:00',
    expires_at: '2026-09-30 23:59:59',
    status: 'active' as const,
  },
  {
    code: 'FLAT500',
    description: 'Flat ₹500 instant cash discount on cart total for premium orders above ₹2,999.',
    discount_type: 'fixed' as const,
    discount_value: 500,
    minimum_order_amount: 2999,
    maximum_discount_amount: 500,
    usage_limit: 200,
    starts_at: '2026-08-15 00:00:00',
    expires_at: '2026-10-15 23:59:59',
    status: 'active' as const,
  },
  {
    code: 'FLASH50',
    description: 'Limited time flash sale voucher! 50% super discount up to ₹1,000 max savings.',
    discount_type: 'percentage' as const,
    discount_value: 50,
    minimum_order_amount: 999,
    maximum_discount_amount: 1000,
    usage_limit: 100,
    starts_at: '2026-08-20 00:00:00',
    expires_at: '2026-08-31 23:59:59',
    status: 'active' as const,
  },
];

async function seed() {
  console.log('Loading database service...');
  const { createCoupon } = await import('../services/coupon.service');

  console.log('Seeding coupons into database...');
  for (const coupon of sampleCoupons) {
    try {
      await createCoupon(coupon);
      console.log(`Successfully added coupon: ${coupon.code}`);
    } catch (err: any) {
      if (err?.message === 'COUPON_CODE_EXISTS') {
        console.log(`Coupon code ${coupon.code} already exists in database.`);
      } else {
        console.error(`Error inserting coupon ${coupon.code}:`, err);
      }
    }
  }
  console.log('Seeding completed!');
  process.exit(0);
}

seed();
