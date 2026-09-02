'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ShoppingBag, MapPin, CreditCard, CheckCircle2, ArrowLeft, Lock } from 'lucide-react';

import { useSettings } from '@/app/hooks';

interface CheckoutHeaderProps {
  currentStep?: 'shipping' | 'payment' | 'confirmation';
}

export default function CheckoutHeader({ currentStep = 'payment' }: CheckoutHeaderProps) {
  const { settings } = useSettings();
  const storeName = settings.store_name || 'NexCart';

  const steps = [
    { id: 'cart', label: 'Shopping Bag', icon: ShoppingBag, status: 'completed' },
    { id: 'shipping', label: 'Shipping Address', icon: MapPin, status: currentStep === 'shipping' ? 'current' : 'completed' },
    { id: 'payment', label: 'Payment & Place Order', icon: CreditCard, status: currentStep === 'payment' ? 'current' : currentStep === 'confirmation' ? 'completed' : 'upcoming' },
    { id: 'confirmation', label: 'Order Confirmed', icon: CheckCircle2, status: currentStep === 'confirmation' ? 'current' : 'upcoming' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Back Link */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Return to Store"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-display">
                  {storeName}
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Secure Checkout
                </span>
              </div>
            </Link>
          </div>

          {/* Stepper (Desktop) */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';

              return (
                <React.Fragment key={step.id}>
                  {idx > 0 && (
                    <div
                      className={`h-0.5 w-6 sm:w-10 transition-colors ${
                        isCompleted || isCurrent
                          ? 'bg-indigo-600 dark:bg-indigo-500'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/50 shadow-md shadow-indigo-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-semibold tracking-tight ${
                        isCurrent
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                          : isCompleted
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Security Badge */}
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 px-3 py-1.5 rounded-full text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
            <span className="sm:hidden">Encrypted</span>
          </div>

        </div>
      </div>
    </header>
  );
}
