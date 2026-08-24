'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutHeader from '@/components/payment/CheckoutHeader';
import ShippingAddressForm, { ShippingAddressData } from '@/components/payment/ShippingAddressForm';
import PaymentForm, { PaymentSelection } from '@/components/payment/PaymentForm';
import OrderSummaryPanel, { CartItemType } from '@/components/payment/OrderSummaryPanel';
import { ShieldCheck, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const INITIAL_CART_ITEMS: CartItemType[] = [
  {
    product_id: 1,
    variant_id: 101,
    product_name: 'Wireless Noise-Canceling Headphones Pro',
    variant_name: 'Midnight Black / Bluetooth 5.3',
    product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    sku: 'AUDIO-ANC-BLK',
    quantity: 1,
    unit_price: 199.99,
  },
  {
    product_id: 2,
    variant_id: null,
    product_name: 'Minimalist Aluminum Laptop Stand',
    variant_name: 'Ergonomic Space Gray',
    product_image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80',
    sku: 'ACC-DESK-STD',
    quantity: 1,
    unit_price: 49.50,
  },
];

const INITIAL_ADDRESS: ShippingAddressData = {
  full_name: 'Alex Johnson',
  phone: '+1 (555) 234-5678',
  address_line1: '742 Evergreen Terrace',
  address_line2: 'Apt 4B',
  city: 'San Francisco',
  state: 'California',
  postal_code: '94107',
  country: 'United States',
  address_type: 'home',
  notes: 'Leave package at front porch.',
};

export default function PaymentPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemType[]>(INITIAL_CART_ITEMS);
  const [address, setAddress] = useState<ShippingAddressData>(INITIAL_ADDRESS);
  const [payment, setPayment] = useState<PaymentSelection>({
    gateway: 'razorpay',
    method: 'credit_card',
    cardDetails: {
      cardNumber: '4532 8921 7812 3456',
      cardHolder: 'ALEX JOHNSON',
      expiry: '12/28',
      cvv: '888',
      saveCard: true,
    },
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingOption, setShippingOption] = useState<'free' | 'express'>('free');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('Initializing Secure Session...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);

  const handleApplyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data.code);
        setDiscountAmount(data.data.discount_amount);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const handlePlaceOrder = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    setProcessingStage('Encrypting Card & Billing Tokens...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStage(`Connecting to ${payment.gateway.toUpperCase()} Gateway...`);

      await new Promise((r) => setTimeout(r, 700));
      setProcessingStage('Verifying Anti-Fraud & Transaction Controls...');

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shipping_address: address,
          payment_gateway: payment.gateway,
          payment_method: payment.method,
          coupon_code: appliedCoupon,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Payment processing failed');
      }

      setProcessingStage('Payment Authorized! Finalizing Order...');
      await new Promise((r) => setTimeout(r, 500));

      const { order_number } = data.data;
      router.push(`/payment/success?orderNumber=${encodeURIComponent(order_number)}`);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment authorization failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <CheckoutHeader currentStep="payment" />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm font-semibold">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery Address & Payment Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Shipping Address Form */}
            <ShippingAddressForm
              address={address}
              onChange={(updated) => setAddress(updated)}
            />

            {/* Step 2: Payment Gateway Selection Form */}
            <PaymentForm
              payment={payment}
              onChange={(updated) => setPayment(updated)}
            />

          </div>

          {/* Right Column: Order Summary & Pay Action (5 cols) */}
          <div className="lg:col-span-5">
            <OrderSummaryPanel
              items={items}
              subtotal={subtotal}
              discountAmount={discountAmount}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              shippingOption={shippingOption}
              onShippingChange={(opt) => setShippingOption(opt)}
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isProcessing}
            />
          </div>

        </div>
      </main>

      {/* Interactive Payment Processing Overlay Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-6">
            
            {/* Spinner Graphic */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-title">
                Processing Payment
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold font-mono animate-pulse">
                {processingStage}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Do not refresh or close this window.
              </p>
              <p>Your connection is secured with 256-Bit SSL encryption.</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
