'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Phone,
  MapPin,
  Loader2,
} from 'lucide-react';

type OrderItemDetail = {
  id: number;
  product_id: number;
  variant_id?: number | null;
  product_name: string;
  variant_name?: string | null;
  sku?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_slug?: string | null;
  product_image?: string | null;
};

type OrderDetail = {
  id: number;
  order_number: string;
  user_id: number;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  coupon_code?: string | null;
  status: string;
  payment_status: string;
  shipping_full_name: string;
  shipping_phone: string;
  shipping_address_line1?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_postal_code?: string | null;
  created_at: string;
  items?: OrderItemDetail[];
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`/api/orders/${id}`);
        if (res.status === 401) {
          router.push(`/login?callbackUrl=/orders/${id}`);
          return;
        }

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Order not found');
        }

        setOrder(data.data);
      } catch (err: any) {
        console.error('Fetch order detail error:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#5b46f6]" />
        <p className="text-xs font-bold text-slate-500">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-2">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">Order Not Found</h1>
        <p className="text-xs text-slate-500">{error || 'The requested order could not be located.'}</p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca]"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Profile</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      {/* Back button */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#5b46f6] transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to My Profile</span>
      </Link>

      {/* Main Order Card */}
      <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-purple-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#5b46f6]">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 font-display">
                  Order #{order.order_number}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                    order.status === 'delivered'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : order.status === 'cancelled'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Recipient & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-1.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Recipient Contact
            </p>
            <p className="text-xs font-bold text-slate-900">{order.shipping_full_name}</p>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>{order.shipping_phone}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-1.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Shipping Address
            </p>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {order.shipping_address_line1 || 'Primary Address'}<br />
              {[order.shipping_city, order.shipping_state, order.shipping_postal_code]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>

        {/* Purchased Items */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Purchased Line Items
          </h3>

          {order.items && order.items.length > 0 ? (
            <div className="divide-y divide-purple-50 rounded-2xl border border-purple-100 bg-white">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-purple-50 p-1 flex items-center justify-center border border-purple-100 shrink-0">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.product_name}</p>
                      {item.variant_name && (
                        <p className="text-[10px] font-bold text-[#5b46f6]">
                          Variant: {item.variant_name}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400">
                        Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-slate-900 shrink-0">
                    ₹{Number(item.total_price || item.unit_price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No line item details available.</p>
          )}
        </div>

        {/* Financial Summary */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">
              ₹{Number(order.subtotal).toLocaleString('en-IN')}
            </span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Discount ({order.coupon_code || 'Promo'})</span>
              <span>-₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping Fee</span>
            <span className="font-bold text-slate-900">
              ₹{Number(order.shipping_amount).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Tax Amount</span>
            <span className="font-bold text-slate-900">
              ₹{Number(order.tax_amount).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="border-t border-purple-200/60 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
            <span>Total Amount Paid</span>
            <span className="text-[#5b46f6]">
              ₹{Number(order.total_amount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
