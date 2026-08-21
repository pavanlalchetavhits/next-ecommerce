'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Ticket,
  Plus,
  Search,
  Sparkles,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Percent,
  DollarSign,
  Calendar,
} from 'lucide-react';
import api from '@/lib/axios';
import MuiSelect from '@/components/ui/MuiSelect';

export interface CouponItem {
  id: number;
  code: string;
  description?: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number | null;
  usage_limit?: number | null;
  used_count: number;
  starts_at: string;
  expires_at?: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

interface CouponManagerProps {
  coupons: CouponItem[];
}

export default function CouponManager({ coupons }: CouponManagerProps) {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<CouponItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    minimum_order_amount: '0',
    maximum_discount_amount: '',
    usage_limit: '',
    starts_at: new Date().toISOString().split('T')[0],
    expires_at: '',
    status: 'active' as 'active' | 'inactive',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Statistics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.status === 'active').length;
  const inactiveCoupons = coupons.filter((c) => c.status === 'inactive').length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + Number(c.used_count || 0), 0);

  // Filtered list
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;

    return true;
  });

  // Open Create Modal
  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      minimum_order_amount: '0',
      maximum_discount_amount: '',
      usage_limit: '',
      starts_at: new Date().toISOString().split('T')[0],
      expires_at: '',
      status: 'active',
    });
    setError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: String(coupon.discount_value),
      minimum_order_amount: String(coupon.minimum_order_amount || 0),
      maximum_discount_amount: coupon.maximum_discount_amount
        ? String(coupon.maximum_discount_amount)
        : '',
      usage_limit: coupon.usage_limit ? String(coupon.usage_limit) : '',
      starts_at: coupon.starts_at ? coupon.starts_at.split('T')[0] : '',
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
      status: coupon.status,
    });
    setError('');
    setIsModalOpen(true);
  };

  // Handle Create / Update Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim() || undefined,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value) || 0,
      minimum_order_amount: parseFloat(formData.minimum_order_amount) || 0,
      maximum_discount_amount: formData.maximum_discount_amount
        ? parseFloat(formData.maximum_discount_amount)
        : undefined,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : undefined,
      starts_at: formData.starts_at,
      expires_at: formData.expires_at || undefined,
      status: formData.status,
    };

    try {
      if (editingCoupon) {
        await api.put(`/api/coupons/${editingCoupon.id}`, payload);
        setSuccessMsg(`Coupon ${payload.code} updated successfully!`);
      } else {
        await api.post('/api/coupons', payload);
        setSuccessMsg(`Coupon ${payload.code} created successfully!`);
      }

      setIsModalOpen(false);
      router.refresh();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  // Delete Confirmation
  const handleDelete = async () => {
    if (!deletingCoupon) return;
    setLoading(true);
    setError('');

    try {
      await api.delete(`/api/coupons/${deletingCoupon.id}`);
      setSuccessMsg(`Coupon ${deletingCoupon.code} deleted successfully!`);
      setDeletingCoupon(null);
      router.refresh();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete coupon');
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
            Coupons & Promotional Discounts
          </h1>
          <p className="text-sm font-medium text-[#707EAE]">
            Create promo codes, manage percentage/fixed discounts, and monitor usage limits
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40"
        >
          <Plus className="h-4 w-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary Statistic Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Coupons */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707EAE] uppercase">
              Total Coupons
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
              <Ticket className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{totalCoupons}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">Configured promos</p>
        </div>

        {/* Active Coupons */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase">
              Active Promos
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{activeCoupons}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">Ready for checkout</p>
        </div>

        {/* Inactive */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">
              Inactive / Paused
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {inactiveCoupons}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Disabled or expired</p>
        </div>

        {/* Total Redemptions */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-600 uppercase">
              Total Redemptions
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {totalRedemptions}
          </p>
          <p className="mt-1 text-xs text-sky-600 font-medium">Times redeemed by buyers</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-[#E9EDF7] bg-white p-1.5 shadow-sm">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            All ({coupons.length})
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            Active ({activeCoupons})
          </button>

          <button
            onClick={() => setStatusFilter('inactive')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'inactive'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            Inactive ({inactiveCoupons})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by promo code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E9EDF7] bg-white py-2.5 pl-10 pr-4 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none shadow-sm transition-all focus:border-[#6366F1]"
          />
        </div>
      </div>

      {/* Coupons Table Card */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm">
        {filteredCoupons.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mx-auto mb-4">
              <Ticket className="h-7 w-7" />
            </div>
            <p className="text-base font-bold text-[#0F172A]">No Coupons Found</p>
            <p className="text-xs text-[#707EAE] mt-1 max-w-sm mx-auto">
              No promo codes match your current search or status filter selection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-xs font-bold text-[#94A3B8] uppercase">
                  <th className="py-3 px-4">Promo Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Order & Cap</th>
                  <th className="py-3 px-4 text-center">Usage Count</th>
                  <th className="py-3 px-4">Validity Period</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredCoupons.map((c) => (
                  <tr key={c.id} className="group hover:bg-[#F8FAFC]">
                    {/* Promo Code Pill */}
                    <td className="py-4 px-4 font-mono font-bold text-[#0F172A]">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-extrabold tracking-wide text-[#6366F1]">
                          {c.code}
                        </span>
                      </div>
                      {c.description && (
                        <p className="text-xs text-[#94A3B8] font-normal mt-1 truncate max-w-xs">
                          {c.description}
                        </p>
                      )}
                    </td>

                    {/* Discount Value & Type */}
                    <td className="py-4 px-4 font-extrabold text-[#0F172A]">
                      {c.discount_type === 'percentage' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <Percent className="h-3.5 w-3.5" />
                          {c.discount_value}% OFF
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <DollarSign className="h-3.5 w-3.5" />
                          ${Number(c.discount_value).toFixed(2)} OFF
                        </span>
                      )}
                    </td>

                    {/* Min Order & Max Cap */}
                    <td className="py-4 px-4 text-xs text-[#64748B]">
                      <p className="font-semibold text-[#0F172A]">
                        Min Order: ${Number(c.minimum_order_amount || 0).toFixed(2)}
                      </p>
                      {c.maximum_discount_amount && (
                        <p className="text-[#94A3B8]">
                          Max Cap: ${Number(c.maximum_discount_amount).toFixed(2)}
                        </p>
                      )}
                    </td>

                    {/* Usage Count */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-extrabold text-[#0F172A]">
                        {c.used_count || 0}
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        {c.usage_limit ? ` / ${c.usage_limit}` : ' (Unlimited)'}
                      </span>
                    </td>

                    {/* Validity Period */}
                    <td className="py-4 px-4 text-xs text-[#64748B]">
                      <div className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-[#94A3B8]" />
                        <span>{new Date(c.starts_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        {c.expires_at
                          ? `Expires: ${new Date(c.expires_at).toLocaleDateString()}`
                          : 'No expiry date'}
                      </p>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4 text-center">
                      {c.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          title="Edit Coupon"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9EDF7] bg-white text-[#6366F1] transition-all hover:border-[#6366F1] hover:bg-indigo-50 shadow-sm"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setDeletingCoupon(c)}
                          title="Delete Coupon"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50/60 text-red-600 transition-all hover:bg-red-600 hover:text-white shadow-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CREATE / EDIT COUPON MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E9EDF7] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                  </h3>
                  <p className="text-xs text-[#707EAE]">
                    {editingCoupon
                      ? `Update parameters for promo code ${editingCoupon.code}`
                      : 'Configure discount rules, order thresholds, and validity'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Promo Code Input */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 font-mono text-sm font-extrabold text-[#0F172A] uppercase outline-none focus:border-[#6366F1]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25% discount for summer sale"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Discount Type *
                  </label>
                  <MuiSelect
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_type: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    options={[
                      { value: 'percentage', label: 'Percentage (%)' },
                      { value: 'fixed', label: 'Fixed Amount ($)' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder={
                      formData.discount_type === 'percentage' ? 'e.g. 20' : 'e.g. 15.00'
                    }
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({ ...formData, discount_value: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs font-extrabold text-[#0F172A] outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              {/* Minimum Order & Max Discount Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Min Order Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.minimum_order_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimum_order_amount: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Max Discount Cap ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Optional cap"
                    value={formData.maximum_discount_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maximum_discount_amount: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              {/* Usage Limit & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Usage Limit (Count)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Optional limit"
                    value={formData.usage_limit}
                    onChange={(e) =>
                      setFormData({ ...formData, usage_limit: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Status *
                  </label>
                  <MuiSelect
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                  />
                </div>
              </div>

              {/* Start Date & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.starts_at}
                    onChange={(e) =>
                      setFormData({ ...formData, starts_at: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) =>
                      setFormData({ ...formData, expires_at: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9EDF7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#E9EDF7] px-4 py-2.5 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:scale-105"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deletingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-extrabold text-[#0F172A]">Delete Coupon</h3>
            <p className="mt-1 text-xs text-[#707EAE]">
              Are you sure you want to delete promo code{' '}
              <strong className="text-[#0F172A]">{deletingCoupon.code}</strong>? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingCoupon(null)}
                className="rounded-xl border border-[#E9EDF7] px-4 py-2.5 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-500/25 hover:bg-red-700"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Delete Coupon</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
