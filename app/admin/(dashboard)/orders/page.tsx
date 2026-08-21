import { getOrders } from '@/services/order.service';
import OrderManager, { OrderItem } from '@/components/admin/OrderManager';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const ordersRaw: any = await getOrders({});

  const orders: OrderItem[] = (ordersRaw || []).map((ord: any) => ({
    id: Number(ord.id),
    order_number: ord.order_number,
    user_id: Number(ord.user_id),
    subtotal: Number(ord.subtotal || 0),
    discount_amount: Number(ord.discount_amount || 0),
    shipping_amount: Number(ord.shipping_amount || 0),
    tax_amount: Number(ord.tax_amount || 0),
    total_amount: Number(ord.total_amount || 0),
    coupon_code: ord.coupon_code || null,
    status: ord.status || 'pending',
    payment_status: ord.payment_status || 'pending',
    shipping_full_name: ord.shipping_full_name || '',
    shipping_phone: ord.shipping_phone || '',
    shipping_address_line1: ord.shipping_address_line1 || null,
    shipping_city: ord.shipping_city || null,
    shipping_state: ord.shipping_state || null,
    shipping_postal_code: ord.shipping_postal_code || null,
    customer_name: ord.customer_name || null,
    customer_email: ord.customer_email || null,
    item_count: Number(ord.item_count || 1),
    created_at: ord.created_at ? new Date(ord.created_at).toISOString() : new Date().toISOString(),
  }));

  return <OrderManager orders={orders} />;
}
