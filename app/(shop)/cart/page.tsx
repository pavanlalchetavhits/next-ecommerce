'use client';

import Link from 'next/link';
import { useCart, useSettings } from '@/app/hooks';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart, isEmpty, isHydrated } = useCart();
  const { settings } = useSettings();

  const shippingFee = Number(settings.shipping_fee || '100');
  const freeThreshold = Number(settings.free_shipping_threshold || '2000');
  const enableTax = settings.enable_tax !== 'false';
  const taxRate = Number(settings.tax_rate || '5');

  const isFreeShipping = subtotal >= freeThreshold || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : shippingFee;
  const estimatedTax = enableTax ? Math.round((subtotal * (taxRate / 100)) * 100) / 100 : 0;
  const totalAmount = subtotal + shippingCost + estimatedTax;
  const remainingForFreeShipping = freeThreshold - subtotal;

  if (!isHydrated) {
    return <div className="min-h-screen py-20 text-center text-xs font-bold text-slate-400">Loading cart...</div>;
  }

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-[#5b46f6] mx-auto mb-5">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">Your Cart is Empty</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Looks like you haven't added any products to your cart yet. Explore our top deals!
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Explore Products Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              You have {items.length} unique item{items.length > 1 ? 's' : ''} in your cart
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId || 0}`}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-purple-100 bg-white p-4 shadow-2xs transition-all hover:shadow-xs"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-purple-100 bg-slate-50 p-2">
                    <img
                      src={item.image || '/hero-img.png'}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    {item.variantName && (
                      <p className="text-xs text-slate-500 font-medium">Variant: {item.variantName}</p>
                    )}
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      ₹{Number(item.price).toLocaleString('en-IN')} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Controller */}
                  <div className="flex items-center rounded-lg border border-purple-200 bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1, item.variantId)
                      }
                      className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-purple-50 transition-colors rounded-l-lg cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1, item.variantId)
                      }
                      className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-purple-50 transition-colors rounded-r-lg cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Total Price */}
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-slate-900">
                      ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4 rounded-2xl border border-purple-100 bg-white p-6 shadow-2xs space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 font-display border-b border-purple-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-extrabold text-slate-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Shipping</span>
                {isFreeShipping ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-extrabold text-slate-900">
                    ₹{shippingCost.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {!isFreeShipping && remainingForFreeShipping > 0 && (
                <div className="rounded-lg bg-indigo-50/80 p-2 text-[11px] font-semibold text-indigo-700">
                  Add <span className="font-extrabold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more to get <span className="font-extrabold text-emerald-600">FREE Shipping</span>!
                </div>
              )}

              <div className="flex justify-between">
                <span>Taxes & Duties ({enableTax ? `${taxRate}%` : 'Disabled'})</span>
                <span className="font-extrabold text-slate-900">
                  {enableTax && estimatedTax > 0 ? `₹${estimatedTax.toLocaleString('en-IN')}` : '₹0'}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-purple-100 text-sm font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-[#5b46f6]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="pt-2 space-y-2 text-[11px] text-slate-500 border-t border-purple-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#5b46f6]" />
                <span>Encrypted 256-bit SSL Payment Safety</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#5b46f6]" />
                <span>Pan-India Express Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
