import Link from 'next/link';
import { getOrderById } from '@/services/order.service';
import { CheckCircle2, PackageCheck, ArrowRight, Truck, Calendar, ShoppingBag } from 'lucide-react';

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id, 10);
  const order = !isNaN(orderId) ? await getOrderById(orderId) : null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Animated Checkmark Badge */}
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md shadow-emerald-500/20 ring-8 ring-emerald-50 animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 mb-2">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Your order has been successfully placed and is being prepared for dispatch.
          </p>
        </div>

        {/* Order Details Summary Card */}
        {order ? (
          <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-xs text-left space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-50 pb-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Order Number:</span>
                <p className="font-mono font-extrabold text-slate-900 text-sm mt-0.5">
                  #{order.order_number}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Total Amount:</span>
                <p className="font-extrabold text-[#5b46f6] text-sm mt-0.5">
                  ₹{Number(order.total_amount).toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Delivery Address:</span>
                <p className="font-bold text-slate-900 text-xs mt-0.5">
                  {order.shipping_city}, {order.shipping_state}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Order Items ({order.items?.length || 0})
              </h3>
              <div className="divide-y divide-purple-50">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-50 border border-purple-100 p-1">
                        <img
                          src={item.product_image || '/hero-img.png'}
                          alt={item.product_name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.product_name}</h4>
                        <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      ₹{Number(item.total_price).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Guarantee */}
            <div className="flex items-center gap-3 rounded-2xl bg-purple-50/60 p-4 border border-purple-100 text-xs text-slate-700">
              <Truck className="h-5 w-5 text-[#5b46f6] shrink-0" />
              <div>
                <strong className="font-bold text-slate-900">Estimated Delivery: 2 - 4 Business Days</strong>
                <p className="text-[11px] text-slate-500">We will send delivery tracking updates via SMS & Email.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 border border-purple-100 text-xs font-semibold text-slate-600">
            Order Confirmation ID: #{orderId}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl bg-[#5b46f6] px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] transition-all cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>

          <Link
            href={`/orders/${orderId}`}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <span>View Order Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
