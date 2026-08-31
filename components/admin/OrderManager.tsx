'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Clock,
  Truck,
  CheckCircle2,
  Eye,
  X,
  Loader2,
  AlertCircle,
  DollarSign,
  User,
  MapPin,
  Phone,
  Package,
} from 'lucide-react';
import api from '@/lib/axios';
import MuiSelect from '@/components/ui/MuiSelect';
import Pagination from '@/components/ui/Pagination';

export interface OrderItemDetail {
  id: number;
  product_id: number;
  variant_id?: number | null;
  product_name: string;
  variant_name?: string | null;
  sku?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_slug?: string | null;
  product_image?: string | null;
}

export interface OrderItem {
  id: number;
  order_number: string;
  user_id: number;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  coupon_code?: string | null;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_full_name: string;
  shipping_phone: string;
  shipping_address_line1?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_postal_code?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  item_count: number;
  created_at: string;
  items?: OrderItemDetail[];
}

interface OrderManagerProps {
  orders: OrderItem[];
}

export default function OrderManager({ orders }: OrderManagerProps) {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [viewingOrder, setViewingOrder] = useState<OrderItem | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string>('');
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState<string>('');
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingLoading, setUpdatingLoading] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (viewingOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [viewingOrder]);

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const activeProcessing = orders.filter((o) =>
    ['confirmed', 'processing', 'shipped'].includes(o.status)
  ).length;
  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const itemsPerPage = 10;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      (order.customer_name &&
        order.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (order.customer_email &&
        order.customer_email.toLowerCase().includes(search.toLowerCase())) ||
      (order.shipping_full_name &&
        order.shipping_full_name.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  // Open Order Details Modal & Fetch Line Items
  const openOrderDetails = async (order: OrderItem) => {
    setViewingOrder(order);
    setUpdatingStatus(order.status);
    setUpdatingPaymentStatus(order.payment_status || 'pending');
    setError('');
    setLoadingDetails(true);

    try {
      const res = await api.get(`/api/orders/${order.id}`);
      if (res.data?.success && res.data?.data) {
        setViewingOrder(res.data.data);
        setUpdatingStatus(res.data.data.status);
        setUpdatingPaymentStatus(res.data.data.payment_status || 'pending');
      }
    } catch {
      // Keep basic order data if fetch details fails
    } finally {
      setLoadingDetails(false);
    }
  };

  // Submit Order Status Update
  const handleStatusUpdate = async (newStatus: string) => {
    if (!viewingOrder) return;

    setUpdatingLoading(true);
    setError('');

    try {
      const res = await api.patch(`/api/orders/${viewingOrder.id}`, {
        status: newStatus,
      });

      if (res.status === 200 || res.data?.success) {
        setSuccessMsg(`Order ${viewingOrder.order_number} status updated to "${newStatus}"!`);
        setViewingOrder((prev) =>
          prev ? { ...prev, status: newStatus as OrderItem['status'] } : null
        );
        setUpdatingStatus(newStatus);
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 3500);
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? String(err.response.data.message)
          : 'Failed to update order status';

      setError(message);
    } finally {
      setUpdatingLoading(false);
    }
  };

  // Submit Payment Status Update
  const handlePaymentStatusUpdate = async (newPaymentStatus: string) => {
    if (!viewingOrder) return;

    setUpdatingLoading(true);
    setError('');

    try {
      const res = await api.patch(`/api/orders/${viewingOrder.id}`, {
        payment_status: newPaymentStatus,
      });

      if (res.status === 200 || res.data?.success) {
        setSuccessMsg(`Payment status updated to "${newPaymentStatus}" for order ${viewingOrder.order_number}!`);
        setViewingOrder((prev) =>
          prev ? { ...prev, payment_status: newPaymentStatus as OrderItem['payment_status'] } : null
        );
        setUpdatingPaymentStatus(newPaymentStatus);
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 3500);
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? String(err.response.data.message)
          : 'Failed to update payment status';

      setError(message);
    } finally {
      setUpdatingLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Order Management
          </h1>
          <p className="text-sm font-medium text-[#707EAE]">
            Track customer orders, review line items, and update fulfillment statuses
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary Statistic Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707EAE] uppercase">
              Total Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{totalOrders}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">Lifetime store orders</p>
        </div>

        {/* Pending Orders */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase">
              Pending Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {pendingOrders}
          </p>
          <p className="mt-1 text-xs text-amber-600 font-medium">Awaiting confirmation</p>
        </div>

        {/* Processing / Shipped */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase">
              In Fulfillment
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {activeProcessing}
          </p>
          <p className="mt-1 text-xs text-indigo-600 font-medium">Processing & Shipped</p>
        </div>

        {/* Total Revenue */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase">
              Total Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Paid & Delivered sales</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E9EDF7] bg-white p-1.5 shadow-sm">
          <button
            onClick={() => {
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            All ({orders.length})
          </button>

          <button
            onClick={() => {
              setStatusFilter('pending');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            Pending ({orders.filter((o) => o.status === 'pending').length})
          </button>

          <button
            onClick={() => {
              setStatusFilter('processing');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'processing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            Processing ({orders.filter((o) => o.status === 'processing').length})
          </button>

          <button
            onClick={() => {
              setStatusFilter('shipped');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'shipped'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-sky-50 hover:text-sky-700'
            }`}
          >
            Shipped ({orders.filter((o) => o.status === 'shipped').length})
          </button>

          <button
            onClick={() => {
              setStatusFilter('delivered');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'delivered'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </button>

          <button
            onClick={() => {
              setStatusFilter('cancelled');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-red-50 hover:text-red-700'
            }`}
          >
            Cancelled ({orders.filter((o) => o.status === 'cancelled').length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by order #, customer, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-[#E9EDF7] bg-white py-2.5 pl-10 pr-4 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none shadow-sm transition-all focus:border-[#6366F1]"
          />
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mx-auto mb-4">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <p className="text-base font-bold text-[#0F172A]">No Orders Found</p>
            <p className="text-xs text-[#707EAE] mt-1 max-w-sm mx-auto">
              No store orders match your search query or status filter selection.
            </p>
          </div>
        ) : (
          <div className="max-h-[62vh] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                <tr className="border-b border-[#F1F5F9] text-xs font-bold text-[#94A3B8] uppercase">
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-center">Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4 text-center">Payment Status</th>
                  <th className="py-3 px-4 text-center">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {paginatedOrders.map((ord) => (
                  <tr key={ord.id} className="group hover:bg-[#F8FAFC]">
                    {/* Order Number */}
                    <td className="py-4 px-4 font-mono text-xs font-bold text-[#6366F1]">
                      {ord.order_number}
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-[#0F172A]">
                        {ord.shipping_full_name || ord.customer_name || 'Customer'}
                      </p>
                      <p className="text-xs text-[#94A3B8] font-normal">
                        {ord.customer_email || ord.shipping_phone}
                      </p>
                    </td>

                    {/* Items Count */}
                    <td className="py-4 px-4 text-center font-bold text-[#0F172A] text-xs">
                      {ord.item_count || 1} {ord.item_count === 1 ? 'item' : 'items'}
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4 font-extrabold text-[#0F172A]">
                      ₹{Number(ord.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Payment Status Pill */}
                    <td className="py-4 px-4 text-center">
                      {ord.payment_status === 'paid' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                          Paid
                        </span>
                      )}
                      {ord.payment_status === 'pending' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
                          Pending
                        </span>
                      )}
                      {(ord.payment_status === 'failed' ||
                        ord.payment_status === 'refunded') && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 border border-red-200 capitalize">
                          {ord.payment_status}
                        </span>
                      )}
                    </td>

                    {/* Order Status Pill */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold capitalize border ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : ord.status === 'shipped'
                            ? 'bg-sky-50 text-sky-600 border-sky-200'
                            : ord.status === 'processing' || ord.status === 'confirmed'
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                            : ord.status === 'pending'
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openOrderDetails(ord)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EDF7] bg-white px-3.5 py-2 text-xs font-bold text-[#6366F1] shadow-sm transition-all hover:border-[#6366F1] hover:bg-indigo-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!filteredOrders.length ? null : (
          <div className="pt-6">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))}
              itemLabel="orders"
            />
          </div>
        )}
      </div>

      {/* --- ORDER DETAILS & STATUS UPDATE MODAL --- */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#E9EDF7] bg-white shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E9EDF7] bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Order #{viewingOrder.order_number}
                  </h3>
                  <p className="text-xs text-[#707EAE]">
                    Placed on {new Date(viewingOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingOrder(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Error in Modal */}
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Update Status Controls */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#E9EDF7] bg-[#F8FAFC] p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A] uppercase">
                      Fulfillment Status
                    </p>
                    <p className="text-xs text-[#707EAE]">
                      Change status to notify shipment or completion
                    </p>
                  </div>

                  <div className="w-full">
                    <MuiSelect
                      value={updatingStatus}
                      disabled={updatingLoading}
                      onChange={(e) => {
                        const newSt = e.target.value as string;
                        setUpdatingStatus(newSt);
                        handleStatusUpdate(newSt);
                      }}
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'confirmed', label: 'Confirmed' },
                        { value: 'processing', label: 'Processing' },
                        { value: 'shipped', label: 'Shipped' },
                        { value: 'delivered', label: 'Delivered' },
                        { value: 'cancelled', label: 'Cancelled' },
                        { value: 'refunded', label: 'Refunded' },
                      ]}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E9EDF7] bg-[#F8FAFC] p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A] uppercase">
                      Payment Status
                    </p>
                    <p className="text-xs text-[#707EAE]">
                      Update the payment state and sync it to the admin payment screen
                    </p>
                  </div>

                  <div className="w-full">
                    <MuiSelect
                      value={updatingPaymentStatus}
                      disabled={updatingLoading}
                      onChange={(e) => {
                        const newPaymentStatus = e.target.value as string;
                        setUpdatingPaymentStatus(newPaymentStatus);
                        handlePaymentStatusUpdate(newPaymentStatus);
                      }}
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'paid', label: 'Paid' },
                        { value: 'failed', label: 'Failed' },
                        { value: 'refunded', label: 'Refunded' },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Information Grid */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Card */}
                <div className="rounded-xl border border-[#E9EDF7] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] uppercase">
                    <User className="h-4 w-4 text-[#6366F1]" />
                    <span>Customer Contact</span>
                  </div>
                  <p className="text-sm font-extrabold text-[#0F172A]">
                    {viewingOrder.shipping_full_name || viewingOrder.customer_name}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {viewingOrder.customer_email || 'No email provided'}
                  </p>
                  <p className="text-xs text-[#64748B] flex items-center gap-1">
                    <Phone className="h-3 w-3 text-[#94A3B8]" />
                    <span>{viewingOrder.shipping_phone}</span>
                  </p>
                </div>

                {/* Shipping Address */}
                <div className="rounded-xl border border-[#E9EDF7] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] uppercase">
                    <MapPin className="h-4 w-4 text-[#6366F1]" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="text-xs text-[#0F172A] font-semibold">
                    {viewingOrder.shipping_address_line1 || 'Primary Address'}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {[
                      viewingOrder.shipping_city,
                      viewingOrder.shipping_state,
                      viewingOrder.shipping_postal_code,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>

              {/* Line Items List */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase">
                  Order Items
                </h4>

                {loadingDetails ? (
                  <div className="py-8 text-center text-xs font-semibold text-[#6366F1] flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading order items...</span>
                  </div>
                ) : viewingOrder.items && viewingOrder.items.length > 0 ? (
                  <div className="divide-y divide-[#F1F5F9] rounded-xl border border-[#E9EDF7]">
                    {viewingOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="h-10 w-10 rounded-lg object-cover border border-[#E9EDF7] shrink-0"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8FAFC] border border-[#E9EDF7] text-[#94A3B8] shrink-0">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-[#0F172A]">
                              {item.product_name}
                            </p>
                            {item.variant_name && (
                              <span className="text-[10px] text-[#6366F1] font-bold">
                                Variant: {item.variant_name}
                              </span>
                            )}
                            <p className="text-[11px] font-mono text-[#94A3B8]">
                              SKU: {item.sku || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-extrabold text-[#0F172A]">
                            ₹{Number(item.total_price || item.unit_price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            {item.quantity} x ₹{Number(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic py-2">
                    No detailed line items recorded for this order.
                  </p>
                )}
              </div>

              {/* Price Summary Breakdown */}
              <div className="mt-5 rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] p-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0F172A]">
                    ₹{Number(viewingOrder.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                {Number(viewingOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({viewingOrder.coupon_code || 'Promo'})</span>
                    <span>-₹{Number(viewingOrder.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#64748B]">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-[#0F172A]">
                    ₹{Number(viewingOrder.shipping_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Tax</span>
                  <span className="font-semibold text-[#0F172A]">
                    ₹{Number(viewingOrder.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-[#E9EDF7] pt-2 flex justify-between text-sm font-extrabold text-[#0F172A]">
                  <span>Total Amount</span>
                  <span className="text-[#6366F1]">
                    ₹{Number(viewingOrder.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
