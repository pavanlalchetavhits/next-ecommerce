'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CheckoutHeader from '@/components/payment/CheckoutHeader';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Calendar, MapPin, Receipt, ShieldCheck, Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/app/hooks';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORD-NEX-89421';
  const { isCopied, copy } = useCopyToClipboard();

  const today = new Date();
  const deliveryDate = new Date(today.setDate(today.getDate() + 4)).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-center space-y-8 animate-in zoom-in-95 duration-500">
      
      {/* Animated Success Badge */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-75"></div>
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
      </div>

      {/* Hero Text */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          Payment Authorized & Order Confirmed
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
          Thank You For Your Order!
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          We&apos;ve received your payment and our fulfillment team is preparing your items for shipment.
        </p>
      </div>

      {/* Summary Receipt Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-left space-y-6">
        
        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Order Reference
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">
                #{orderNumber}
              </span>
              <button
                type="button"
                onClick={() => copy(orderNumber)}
                className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Copy order reference"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span>PAID IN FULL</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Estimated Delivery */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Estimated Delivery
              </p>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {deliveryDate}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Standard Express Courier</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Shipping Address
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                742 Evergreen Terrace, Apt 4B
              </p>
              <p className="text-[11px] text-slate-500">San Francisco, CA 94107</p>
            </div>
          </div>

        </div>

        {/* Confirmation Email Notice */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
          <Package className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>
            A detailed invoice and real-time tracking link have been sent to your email.
          </span>
        </div>

      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Receipt className="w-4 h-4 text-slate-500" />
          <span>Print Order Receipt</span>
        </button>
      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <CheckoutHeader currentStep="confirmation" />
      <main className="flex-1">
        <Suspense fallback={<div className="text-center py-20">Loading order confirmation...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
