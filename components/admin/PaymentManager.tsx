'use client';

import { useState } from 'react';
import MuiSelect from '@/components/ui/MuiSelect';

const GATEWAY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Gateways' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'cashfree', label: 'Cashfree' },
  { value: 'cod', label: 'Cash on Delivery (COD)' },
];
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  X,
  DollarSign,
  User,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export interface PaymentItem {
  id: number;
  order_id: number;
  payment_gateway: 'razorpay' | 'cashfree' | 'cod' | string;
  payment_id?: string | null;
  order_reference?: string | null;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded' | string;
  payment_method?: string | null;
  gateway_response?: any;
  paid_at?: string | null;
  created_at: string;
  order_number?: string | null;
  order_total?: number | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
}

interface PaymentManagerProps {
  payments: PaymentItem[];
}

export default function PaymentManager({ payments = [] }: PaymentManagerProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');
  const [viewingPayment, setViewingPayment] = useState<PaymentItem | null>(null);

  // Statistics
  const totalCount = payments.length;
  const totalVolume = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const successCount = payments.filter((p) => p.status === 'success').length;
  const pendingCount = payments.filter((p) => p.status === 'pending' || p.status === 'processing').length;
  const failedCount = payments.filter((p) => p.status === 'failed' || p.status === 'refunded').length;

  // Filter logic
  const filteredPayments = payments.filter((payment) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (payment.payment_id && payment.payment_id.toLowerCase().includes(searchLower)) ||
      (payment.order_number && payment.order_number.toLowerCase().includes(searchLower)) ||
      (payment.customer_name && payment.customer_name.toLowerCase().includes(searchLower)) ||
      (payment.customer_email && payment.customer_email.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    if (statusFilter !== 'all' && payment.status !== statusFilter) {
      return false;
    }

    if (gatewayFilter !== 'all' && payment.payment_gateway?.toLowerCase() !== gatewayFilter.toLowerCase()) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Payment Transactions
          </h1>
          <p className="text-sm font-medium text-[#707EAE]">
            Monitor gateway transactions, payment statuses, and revenue details
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Volume */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase">
              Paid Volume
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            ${totalVolume.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Successful volume</p>
        </div>

        {/* Successful Payments */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase">
              Successful Transactions
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {successCount}
          </p>
          <p className="mt-1 text-xs text-[#94A3B8]">Completed payments</p>
        </div>

        {/* Pending Payments */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase">
              Pending Payments
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {pendingCount}
          </p>
          <p className="mt-1 text-xs text-amber-600 font-medium">Awaiting authorization / COD</p>
        </div>

        {/* Failed / Refunded */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 uppercase">
              Failed / Refunded
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {failedCount}
          </p>
          <p className="mt-1 text-xs text-red-600 font-medium">Declined or refunded</p>
        </div>
      </div>

      {/* Filter Options & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E9EDF7] bg-white p-1.5 shadow-sm">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            All Statuses ({totalCount})
          </button>

          <button
            onClick={() => setStatusFilter('success')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'success'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            Success ({successCount})
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            Pending ({pendingCount})
          </button>

          <button
            onClick={() => setStatusFilter('failed')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'failed'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-red-50 hover:text-red-700'
            }`}
          >
            Failed ({failedCount})
          </button>
        </div>

        {/* Gateway Select & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-auto">
            <MuiSelect
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(String(e.target.value))}
              options={GATEWAY_FILTER_OPTIONS}
              maxWidth="180px"
            />
          </div>

          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by Payment ID, Order #, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E9EDF7] bg-white py-2.5 pl-10 pr-4 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none shadow-sm transition-all focus:border-[#6366F1]"
            />
          </div>
        </div>

      </div>

      {/* Payments Table Card */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm">
        {filteredPayments.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mx-auto mb-4">
              <CreditCard className="h-7 w-7" />
            </div>
            <p className="text-base font-bold text-[#0F172A]">No Payment Records Found</p>
            <p className="text-xs text-[#707EAE] mt-1 max-w-sm mx-auto">
              No transactions match your search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-xs font-bold text-[#94A3B8] uppercase">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-center">Gateway & Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="group hover:bg-[#F8FAFC]">
                    
                    {/* Transaction ID */}
                    <td className="py-4 px-4 font-mono text-xs font-bold text-[#6366F1]">
                      {pay.payment_id || `PAY-${pay.id}`}
                    </td>

                    {/* Order Ref */}
                    <td className="py-4 px-4 font-mono text-xs font-bold text-[#0F172A]">
                      {pay.order_number || `#ORD-${pay.order_id}`}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-[#0F172A]">
                        {pay.customer_name || 'Guest User'}
                      </p>
                      <p className="text-xs text-[#94A3B8] font-normal">
                        {pay.customer_email || 'N/A'}
                      </p>
                    </td>

                    {/* Gateway & Method */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-[11px] uppercase border border-indigo-200">
                        {pay.payment_gateway}
                      </span>
                      {pay.payment_method && (
                        <p className="text-[10px] text-[#707EAE] font-semibold capitalize mt-0.5">
                          {pay.payment_method.replace('_', ' ')}
                        </p>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-black text-[#0F172A] font-mono">
                      ${Number(pay.amount).toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      {pay.status === 'success' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Success
                        </span>
                      )}
                      {pay.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {(pay.status === 'failed' || pay.status === 'refunded') && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 border border-red-200 capitalize">
                          <XCircle className="w-3 h-3" />
                          {pay.status}
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-[#64748B]">
                      {new Date(pay.paid_at || pay.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setViewingPayment(pay)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EDF7] bg-white px-3.5 py-2 text-xs font-bold text-[#6366F1] shadow-sm transition-all hover:border-[#6366F1] hover:bg-indigo-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Details</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- PAYMENT TRANSACTION DETAILS MODAL --- */}
      {viewingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E9EDF7] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Payment Transaction Details
                  </h3>
                  <p className="text-xs text-[#707EAE] font-mono">
                    ID: {viewingPayment.payment_id || `PAY-${viewingPayment.id}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingPayment(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E9EDF7] space-y-1">
                <span className="text-[#94A3B8] font-semibold">Payment Gateway</span>
                <p className="font-extrabold uppercase text-[#0F172A]">
                  {viewingPayment.payment_gateway}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E9EDF7] space-y-1">
                <span className="text-[#94A3B8] font-semibold">Payment Method</span>
                <p className="font-extrabold capitalize text-[#0F172A]">
                  {viewingPayment.payment_method?.replace('_', ' ') || 'N/A'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E9EDF7] space-y-1">
                <span className="text-[#94A3B8] font-semibold">Associated Order</span>
                <p className="font-extrabold font-mono text-[#6366F1]">
                  {viewingPayment.order_number || `#ORD-${viewingPayment.order_id}`}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E9EDF7] space-y-1">
                <span className="text-[#94A3B8] font-semibold">Amount Charged</span>
                <p className="font-black text-[#0F172A]">
                  ${Number(viewingPayment.amount).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-xl border border-[#E9EDF7] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] uppercase">
                <User className="h-4 w-4 text-[#6366F1]" />
                <span>Customer Info</span>
              </div>
              <p className="text-sm font-extrabold text-[#0F172A]">
                {viewingPayment.customer_name || 'Customer'}
              </p>
              <p className="text-xs text-[#64748B]">
                {viewingPayment.customer_email || 'No email registered'}
              </p>
            </div>

            {/* Gateway Response Snippet if available */}
            {viewingPayment.gateway_response && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#0F172A] uppercase">
                  Gateway Metadata JSON
                </span>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-40">
                  {typeof viewingPayment.gateway_response === 'string'
                    ? viewingPayment.gateway_response
                    : JSON.stringify(viewingPayment.gateway_response, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewingPayment(null)}
                className="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Close Modal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
