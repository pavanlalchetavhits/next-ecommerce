'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tag, Check, ArrowRight, Truck, ShieldCheck, Loader2, AlertCircle, Trash2 } from 'lucide-react';

export interface CartItemType {
  product_id: number;
  variant_id?: number | null;
  product_name: string;
  variant_name?: string | null;
  product_image?: string | null;
  sku?: string | null;
  quantity: number;
  unit_price: number;
}

interface OrderSummaryPanelProps {
  items: CartItemType[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon: () => void;
  shippingOption: 'free' | 'express';
  onShippingChange: (opt: 'free' | 'express') => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

const SAMPLE_COUPONS = ['SAVE10', 'WELCOME20', 'FREESHIP'];

export default function OrderSummaryPanel({
  items,
  subtotal,
  discountAmount,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  shippingOption,
  onShippingChange,
  onPlaceOrder,
  isProcessing,
}: OrderSummaryPanelProps) {
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const shippingCost = shippingOption === 'express' ? 15.0 : subtotal > 150 || subtotal === 0 ? 0.0 : 10.0;
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableBase * 0.18 * 100) / 100;
  const totalAmount = Math.round((taxableBase + shippingCost + taxAmount) * 100) / 100;

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    const success = await onApplyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (success) {
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon code');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6 sticky top-28">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-title">
          Order Summary
        </h2>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          {items.reduce((acc, i) => acc + i.quantity, 0)} Items
        </span>
      </div>

      {/* Item List */}
      <div className="max-h-60 overflow-y-auto space-y-3.5 pr-1 divide-y divide-slate-100 dark:divide-slate-800/60">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3.5 pt-3 first:pt-0">
            
            {/* Product Thumbnail */}
            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 relative flex items-center justify-center">
              {item.product_image ? (
                <Image
                  src={item.product_image}
                  alt={item.product_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-slate-400">Nex</span>
              )}
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {item.product_name}
              </h4>
              {item.variant_name && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Variant: {item.variant_name}
                </p>
              )}
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] font-medium text-slate-500">
                  Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                </span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Promo Code Form */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Have a Promo Code / Coupon?
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 tracking-wide font-mono">
                  {appliedCoupon}
                </span>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  -${discountAmount.toFixed(2)} Discount Applied
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-emerald-700 dark:text-emerald-400 hover:text-red-600 transition-colors p-1"
              title="Remove coupon"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCouponSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="ENTER CODE (e.g. SAVE10)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white uppercase placeholder:text-slate-400 placeholder:normal-case focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={couponLoading || !couponInput.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center min-w-[75px]"
            >
              {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
            </button>
          </form>
        )}

        {couponError && (
          <p className="text-[11px] text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{couponError}</span>
          </p>
        )}

        {/* Suggest Chips */}
        {!appliedCoupon && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold">Try:</span>
            {SAMPLE_COUPONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCouponInput(c);
                  onApplyCoupon(c);
                }}
                className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 px-2 py-0.5 rounded-md hover:bg-indigo-100 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Shipping Method Selector */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Shipping Speed
        </label>
        <div className="grid grid-cols-2 gap-2">
          
          <button
            type="button"
            onClick={() => onShippingChange('free')}
            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
              shippingOption === 'free'
                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Standard</p>
              <p className="text-[10px] text-slate-500">3-5 Business Days</p>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              FREE
            </span>
          </button>

          <button
            type="button"
            onClick={() => onShippingChange('express')}
            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
              shippingOption === 'express'
                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Express</p>
              <p className="text-[10px] text-slate-500">1-2 Business Days</p>
            </div>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
              +$15.00
            </span>
          </button>

        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Coupon Discount</span>
            <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Shipping Fee</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated Tax (18% GST)</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            ${taxAmount.toFixed(2)}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
          <div>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white font-title">
              Total Payable
            </span>
            <p className="text-[10px] text-slate-400">Includes taxes & shipping</p>
          </div>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Primary Submit Button */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isProcessing || items.length === 0}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <span>Pay & Place Order</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Guarantee note */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>30-Day Money Back Guarantee</span>
      </div>

    </div>
  );
}
