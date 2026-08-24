'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Landmark,
  Banknote,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  Check,
  Cpu,
} from 'lucide-react';
import MuiSelect from '@/components/ui/MuiSelect';

export type PaymentGatewayType = 'razorpay' | 'cashfree' | 'cod';
export type PaymentMethodType = 'credit_card' | 'upi' | 'net_banking' | 'cod' | 'wallet';

export interface PaymentSelection {
  gateway: PaymentGatewayType;
  method: PaymentMethodType;
  cardDetails?: {
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
    saveCard: boolean;
  };
  upiId?: string;
  selectedBank?: string;
  selectedWallet?: string;
}

interface PaymentFormProps {
  payment: PaymentSelection;
  onChange: (updated: PaymentSelection) => void;
}

const GATEWAY_OPTIONS = [
  { value: 'razorpay', label: 'Razorpay (Cards & NetBanking)' },
  { value: 'cashfree', label: 'Cashfree (UPI & Wallets)' },
  { value: 'cod', label: 'Cash on Delivery (COD)' },
];

const BANK_OPTIONS = [
  { value: '', label: '-- Select Bank --' },
  { value: 'hdfc', label: 'HDFC Bank' },
  { value: 'sbi', label: 'State Bank of India (SBI)' },
  { value: 'icici', label: 'ICICI Bank' },
  { value: 'axis', label: 'Axis Bank' },
  { value: 'kotak', label: 'Kotak Mahindra Bank' },
  { value: 'pnb', label: 'Punjab National Bank' },
  { value: 'bob', label: 'Bank of Baroda' },
  { value: 'canara', label: 'Canara Bank' },
  { value: 'yes', label: 'Yes Bank' },
  { value: 'indusind', label: 'IndusInd Bank' },
  { value: 'union', label: 'Union Bank of India' },
];

const WALLET_OPTIONS = [
  { value: 'paytm', label: 'Paytm Wallet' },
  { value: 'phonepe', label: 'PhonePe Wallet' },
  { value: 'amazonpay', label: 'Amazon Pay' },
  { value: 'mobikwik', label: 'MobiKwik Wallet' },
];

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'sbi', name: 'State Bank of India', logo: '🏛️' },
  { id: 'icici', name: 'ICICI Bank', logo: '💳' },
  { id: 'axis', name: 'Axis Bank', logo: '🏢' },
  { id: 'kotak', name: 'Kotak Mahindra', logo: '👑' },
  { id: 'pnb', name: 'Punjab National Bank', logo: '🏦' },
];

export default function PaymentForm({ payment, onChange }: PaymentFormProps) {
  const [activeTab, setActiveTab] = useState<PaymentMethodType>(payment.method || 'credit_card');
  const [upiVerified, setUpiVerified] = useState<boolean>(false);

  // Detect card brand from card number
  const getCardBrand = (number: string) => {
    const clean = number.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'VISA';
    if (/^5[1-5]/.test(clean)) return 'Mastercard';
    if (/^60|^6521|^6522/.test(clean)) return 'RuPay';
    if (/^3[47]/.test(clean)) return 'Amex';
    return 'Card';
  };

  const handleGatewayChange = (newGateway: PaymentGatewayType) => {
    let method: PaymentMethodType = 'credit_card';
    if (newGateway === 'cod') {
      method = 'cod';
    } else if (newGateway === 'cashfree') {
      method = 'upi';
    }
    setActiveTab(method);
    onChange({
      ...payment,
      gateway: newGateway,
      method,
    });
  };

  const handleTabChange = (method: PaymentMethodType) => {
    setActiveTab(method);
    let gateway: PaymentGatewayType = payment.gateway || 'razorpay';
    if (method === 'cod') {
      gateway = 'cod';
    } else if (method === 'upi' || method === 'net_banking') {
      gateway = 'cashfree';
    } else if (method === 'credit_card') {
      gateway = 'razorpay';
    }
    onChange({
      ...payment,
      method,
      gateway,
    });
  };

  const handleCardFieldChange = (field: string, val: string | boolean) => {
    onChange({
      ...payment,
      cardDetails: {
        cardNumber: payment.cardDetails?.cardNumber || '',
        cardHolder: payment.cardDetails?.cardHolder || '',
        expiry: payment.cardDetails?.expiry || '',
        cvv: payment.cardDetails?.cvv || '',
        saveCard: payment.cardDetails?.saveCard || false,
        [field]: val,
      },
    });
  };

  // Format Card Number (adds space every 4 digits)
  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  // Format Expiry MM/YY
  const formatExpiry = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean.length >= 3) {
      return `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
    }
    return clean;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-semibold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-title">
              Payment Method & Gateway
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose payment provider and payment option
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>PCI-DSS Verified</span>
        </div>
      </div>

      {/* MUI Select for Payment Gateway Provider */}
      <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Select Payment Gateway Provider (MUI Dropdown)
          </label>
        </div>
        <MuiSelect
          value={payment.gateway}
          onChange={(e) => handleGatewayChange(e.target.value as PaymentGatewayType)}
          options={GATEWAY_OPTIONS}
          maxWidth="280px"
        />
      </div>

      {/* Payment Method Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
        
        <button
          type="button"
          onClick={() => handleTabChange('credit_card')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'credit_card'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Cards</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('upi')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'upi'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>UPI / QR</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('net_banking')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'net_banking'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Net Banking</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('wallet')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'wallet'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Wallets</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('cod')}
          className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'cod'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Banknote className="w-4 h-4 text-emerald-500" />
          <span>COD</span>
        </button>

      </div>

      {/* Tab 1: Credit / Debit Card Form */}
      {activeTab === 'credit_card' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* Card Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Card Number
              </label>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                {getCardBrand(payment.cardDetails?.cardNumber || '')}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength={19}
                value={payment.cardDetails?.cardNumber || ''}
                onChange={(e) => handleCardFieldChange('cardNumber', formatCardNumber(e.target.value))}
                placeholder="4532 •••• •••• 8901"
                className="w-full pl-3 pr-12 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all tracking-wider"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-xs font-bold text-slate-400">VISA / MC</span>
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Cardholder Name
            </label>
            <input
              type="text"
              value={payment.cardDetails?.cardHolder || ''}
              onChange={(e) => handleCardFieldChange('cardHolder', e.target.value)}
              placeholder="NAME AS SHOWN ON CARD"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm uppercase text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all tracking-wide font-medium"
            />
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Expiry Date (MM/YY)
              </label>
              <input
                type="text"
                maxLength={5}
                value={payment.cardDetails?.expiry || ''}
                onChange={(e) => handleCardFieldChange('expiry', formatExpiry(e.target.value))}
                placeholder="08/28"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-center tracking-widest"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>CVV / CVC</span>
                <span className="text-[10px] text-slate-400 font-normal">3-4 digits</span>
              </label>
              <input
                type="password"
                maxLength={4}
                value={payment.cardDetails?.cvv || ''}
                onChange={(e) => handleCardFieldChange('cvv', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="•••"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-center tracking-widest"
              />
            </div>
          </div>

          {/* Save Card Checkbox */}
          <label className="flex items-center gap-2.5 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={payment.cardDetails?.saveCard || false}
              onChange={(e) => handleCardFieldChange('saveCard', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Save this card securely for future one-click checkouts
            </span>
          </label>

        </div>
      )}

      {/* Tab 2: UPI / QR Payment */}
      {activeTab === 'upi' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                Instant UPI Payment (0 Transaction Fees)
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Pay using Google Pay, PhonePe, Paytm, BHIM, or any bank UPI app.
              </p>
            </div>
          </div>

          {/* VPA ID Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Virtual Payment Address (VPA / UPI ID)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={payment.upiId || ''}
                  onChange={(e) => {
                    setUpiVerified(false);
                    onChange({ ...payment, upiId: e.target.value });
                  }}
                  placeholder="username@okaxis or mobile@paytm"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                {upiVerified && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (payment.upiId && payment.upiId.includes('@')) {
                    setUpiVerified(true);
                  }
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Verify VPA
              </button>
            </div>
          </div>

          {/* QR Code Option */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex flex-col items-center text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              — OR Scan QR Code with Any Phone App —
            </span>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 shadow-sm flex flex-col items-center gap-3">
              {/* Dynamic QR Code Simulation */}
              <div className="w-40 h-40 bg-slate-900 dark:bg-white rounded-xl p-2.5 flex items-center justify-center relative group">
                <div className="w-full h-full border-4 border-white dark:border-slate-900 flex flex-wrap gap-1 p-2 items-center justify-center">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xs"></div>
                  <div className="w-6 h-6 bg-purple-500 rounded-xs"></div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-xs"></div>
                  <div className="w-8 h-8 bg-amber-500 rounded-xs"></div>
                </div>
                <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                  <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-xs">
                    SCAN TO PAY
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Net Banking */}
      {activeTab === 'net_banking' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Popular Banks
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POPULAR_BANKS.map((bank) => {
              const isSelected = payment.selectedBank === bank.id;
              return (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => onChange({ ...payment, selectedBank: bank.id })}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{bank.logo}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {bank.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Or Choose from All Supported Banks (MUI Dropdown)
            </label>
            <MuiSelect
              value={payment.selectedBank || ''}
              onChange={(e) => onChange({ ...payment, selectedBank: String(e.target.value) })}
              options={BANK_OPTIONS}
              maxWidth="260px"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Wallets */}
      {activeTab === 'wallet' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Mobile Wallet Provider (MUI Dropdown)
          </label>
          <MuiSelect
            value={payment.selectedWallet || 'paytm'}
            onChange={(e) => onChange({ ...payment, selectedWallet: String(e.target.value) })}
            options={WALLET_OPTIONS}
            maxWidth="240px"
          />
        </div>
      )}

      {/* Tab 5: Cash on Delivery */}
      {activeTab === 'cod' && (
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-5 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Cash on Delivery (COD) Policy</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            You can pay in cash or via mobile QR scan upon delivery. Please ensure exact change is available for our logistics partner. An automated OTP verification call/SMS may be required to verify your shipping phone number.
          </p>
        </div>
      )}

      {/* Security Footer Guarantee */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span>Guaranteed 100% Safe & Secure Checkout</span>
        </div>
        <div className="flex items-center gap-3 font-semibold">
          <span>SSL 256-BIT</span>
        </div>
      </div>

    </div>
  );
}
