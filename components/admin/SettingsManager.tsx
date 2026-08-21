'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Truck,
  CreditCard,
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Percent,
  ShieldAlert,
} from 'lucide-react';
import api from '@/lib/axios';
import MuiSelect from '@/components/ui/MuiSelect';

interface SettingsManagerProps {
  initialSettings: Record<string, string>;
}

export default function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'shipping' | 'payments' | 'operations'>(
    'profile'
  );

  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: initialSettings.store_name || 'NexCart',
    store_tagline: initialSettings.store_tagline || 'Modern E-Commerce Store',
    support_email: initialSettings.support_email || 'support@nexcart.com',
    support_phone: initialSettings.support_phone || '+1 (800) 123-4567',
    store_address: initialSettings.store_address || '123 E-Commerce Way, CA 90210',
    currency: initialSettings.currency || 'USD',
    currency_symbol: initialSettings.currency_symbol || '$',

    shipping_fee: initialSettings.shipping_fee || '15.00',
    free_shipping_threshold: initialSettings.free_shipping_threshold || '100.00',
    shipping_note: initialSettings.shipping_note || 'Standard delivery takes 3-5 business days.',

    enable_tax: initialSettings.enable_tax || 'true',
    tax_rate: initialSettings.tax_rate || '5.00',
    enable_cod: initialSettings.enable_cod || 'true',
    min_order_amount: initialSettings.min_order_amount || '10.00',

    maintenance_mode: initialSettings.maintenance_mode || 'false',
    notification_email: initialSettings.notification_email || 'orders@nexcart.com',
    low_stock_threshold: initialSettings.low_stock_threshold || '5',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.put('/api/settings', settings);

      if (res.status === 200 || res.data?.success) {
        setSuccessMsg('Store settings updated successfully!');
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 3500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Store Settings
          </h1>
          <p className="text-sm font-medium text-[#707EAE]">
            Configure store profile, currency, shipping rates, taxes, and system preferences
          </p>
        </div>

        {/* <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Settings</span>
        </button> */}
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E9EDF7] pb-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
          }`}
        >
          <Store className="h-4 w-4" />
          <span>Store Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
            activeTab === 'shipping'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Shipping & Delivery</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
            activeTab === 'payments'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payments & Taxes</span>
        </button>

        <button
          onClick={() => setActiveTab('operations')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
            activeTab === 'operations'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Operations & Security</span>
        </button>
      </div>

      {/* Main Settings Card Container */}
      <form onSubmit={handleSave} className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm">
        {/* --- TAB 1: STORE PROFILE --- */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                <Building className="h-5 w-5 text-[#6366F1]" />
                General Store Identity
              </h3>
              <p className="text-xs text-[#707EAE]">
                Basic details displayed on storefront headers, emails, and invoices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.store_name}
                  onChange={(e) => handleChange('store_name', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-sm font-bold text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Store Tagline
                </label>
                <input
                  type="text"
                  value={settings.store_tagline}
                  onChange={(e) => handleChange('store_tagline', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-[#94A3B8]" />
                  Support Email *
                </label>
                <input
                  type="email"
                  required
                  value={settings.support_email}
                  onChange={(e) => handleChange('support_email', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-[#94A3B8]" />
                  Support Phone
                </label>
                <input
                  type="text"
                  value={settings.support_phone}
                  onChange={(e) => handleChange('support_phone', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#94A3B8]" />
                Store Address
              </label>
              <textarea
                rows={2}
                value={settings.store_address}
                onChange={(e) => handleChange('store_address', e.target.value)}
                className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="pt-4 border-t border-[#E9EDF7] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Default Currency
                </label>
                <MuiSelect
                  value={settings.currency}
                  onChange={(e) => {
                    const cur = e.target.value as string;
                    const symbols: Record<string, string> = {
                      USD: '$',
                      INR: '₹',
                      EUR: '€',
                      GBP: '£',
                    };
                    handleChange('currency', cur);
                    if (symbols[cur]) {
                      handleChange('currency_symbol', symbols[cur]);
                    }
                  }}
                  options={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'INR', label: 'INR (₹)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'GBP', label: 'GBP (£)' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={settings.currency_symbol}
                  onChange={(e) => handleChange('currency_symbol', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-center text-sm font-extrabold text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: SHIPPING & DELIVERY --- */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#6366F1]" />
                Shipping Rates & Policies
              </h3>
              <p className="text-xs text-[#707EAE]">
                Set default shipping charges and minimum thresholds for free shipping
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-[#94A3B8]" />
                  Standard Shipping Fee ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.shipping_fee}
                  onChange={(e) => handleChange('shipping_fee', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-sm font-bold text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-[#94A3B8]" />
                  Free Shipping Minimum Order ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.free_shipping_threshold}
                  onChange={(e) =>
                    handleChange('free_shipping_threshold', e.target.value)
                  }
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-sm font-bold text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Checkout Shipping Note
              </label>
              <textarea
                rows={3}
                value={settings.shipping_note}
                onChange={(e) => handleChange('shipping_note', e.target.value)}
                placeholder="e.g. Standard delivery within 3-5 business days."
                className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>
        )}

        {/* --- TAB 3: PAYMENTS & TAXES --- */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#6366F1]" />
                Payments & Sales Tax Configuration
              </h3>
              <p className="text-xs text-[#707EAE]">
                Manage checkout payment options and automated tax calculation rates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Enable Tax Calculation
                </label>
                <MuiSelect
                  value={settings.enable_tax}
                  onChange={(e) => handleChange('enable_tax', e.target.value as string)}
                  options={[
                    { value: 'true', label: 'Enabled' },
                    { value: 'false', label: 'Disabled' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1 flex items-center gap-1">
                  <Percent className="h-3.5 w-3.5 text-[#94A3B8]" />
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={settings.tax_rate}
                  onChange={(e) => handleChange('tax_rate', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-sm font-bold text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9EDF7] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Cash on Delivery (COD)
                </label>
                <MuiSelect
                  value={settings.enable_cod}
                  onChange={(e) => handleChange('enable_cod', e.target.value as string)}
                  options={[
                    { value: 'true', label: 'Allow COD at Checkout' },
                    { value: 'false', label: 'Disable COD' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Minimum Order Total Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.min_order_amount}
                  onChange={(e) => handleChange('min_order_amount', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-sm font-bold text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: OPERATIONS & SECURITY --- */}
        {activeTab === 'operations' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                <Sliders className="h-5 w-5 text-[#6366F1]" />
                Store Operations & Maintenance
              </h3>
              <p className="text-xs text-[#707EAE]">
                System alerts, maintenance mode toggle, and inventory defaults
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <span>Storefront Maintenance Mode</span>
              </div>
              <p className="text-xs text-amber-700">
                When enabled, buyers will see a maintenance page while admins can still access the dashboard.
              </p>
              <div className="w-full max-w-xs">
                <MuiSelect
                  value={settings.maintenance_mode}
                  onChange={(e) =>
                    handleChange('maintenance_mode', e.target.value as string)
                  }
                  options={[
                    { value: 'false', label: 'Live Store (Normal Mode)' },
                    { value: 'true', label: 'Maintenance Mode (Store Closed)' },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Order Notification Recipient Email
                </label>
                <input
                  type="email"
                  value={settings.notification_email}
                  onChange={(e) => handleChange('notification_email', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Default Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.low_stock_threshold}
                  onChange={(e) => handleChange('low_stock_threshold', e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-sm font-bold text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="mt-8 flex items-center justify-end border-t border-[#E9EDF7] pt-5">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
