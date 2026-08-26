import Link from "next/link";
import { getOrderById } from "@/services/order.service";
import { XCircle, RefreshCw, ShoppingBag, HelpCircle, ShieldAlert, ArrowLeft } from "lucide-react";

export default async function OrderFailedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reason?: string }>;
}) {
  const { id } = await params;
  const { reason } = await searchParams;
  
  const orderId = parseInt(id, 10);
  const order = !isNaN(orderId) ? await getOrderById(orderId) : null;
  const failureReason = reason || "Payment was declined or cancelled by the user.";

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Animated Error Badge */}
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-md shadow-red-500/20 ring-8 ring-red-50">
          <XCircle className="h-10 w-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3.5 py-1 text-xs font-bold text-red-700 border border-red-200 mb-3">
            Payment Failed
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            Unable to Process Payment
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Your payment attempt was not completed. No worries, your cart details are safe and you can try again!
          </p>
        </div>

        {/* Failure Details Card */}
        {order ? (
          <div className="rounded-3xl border border-red-100 bg-white p-6 sm:p-8 shadow-xs text-left space-y-6">
            
            {/* Header info bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-50 pb-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Order Reference:</span>
                <p className="font-mono font-extrabold text-slate-900 text-sm mt-0.5">
                  #{order.order_number}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Amount Due:</span>
                <p className="font-extrabold text-[#5b46f6] text-sm mt-0.5">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Payment Status:</span>
                <p className="font-bold text-red-600 text-xs mt-0.5 capitalize">
                  {order.payment_status || "Failed"}
                </p>
              </div>
            </div>

            {/* Failure reason callout */}
            <div className="rounded-2xl bg-red-50/70 p-4 border border-red-100 space-y-1">
              <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                Reason for Failure:
              </h4>
              <p className="text-xs text-red-700 font-medium">
                {failureReason}
              </p>
            </div>

            {/* Guarantee / Refund Safety Reassurance */}
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600">
              <HelpCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-slate-900">Was money debited from your account?</strong>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  If funds were deducted by your bank or UPI app during this attempt, Cashfree will automatically process an instant refund back to your original payment mode within 3 - 5 business days.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 border border-red-100 text-xs font-semibold text-red-600">
            Payment Attempt Reference: #{orderId}
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/checkout"
            className="flex items-center gap-2 rounded-xl bg-[#5b46f6] px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Payment Again</span>
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <HelpCircle className="h-4 w-4 text-slate-500" />
            <span>Need Help / Support</span>
          </Link>
        </div>

        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#5b46f6] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Shopping Cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
