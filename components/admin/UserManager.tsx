'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle,
  UserX,
  UserCheck,
  Eye,
  ShoppingBag,
  IndianRupee,
  Phone,
  Mail,
  Calendar,
  X,
  Loader2,
  ShieldAlert,
  Clock,
  Filter,
  RefreshCw,
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

import { useDebounce } from '@/app/hooks';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: 'active' | 'blocked' | 'suspended';
  created_at: string;
  last_login_at?: string | null;
  order_count: number;
  total_spent: number | string;
}

interface CustomerOrder {
  id: number;
  order_number: string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  total_items: number;
}

interface Summary {
  total_customers: number;
  active_customers: number;
  blocked_customers: number;
}

export default function UserManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [summary, setSummary] = useState<Summary>({
    total_customers: 0,
    active_customers: 0,
    blocked_customers: 0,
  });

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Status toggle confirmation modal
  const [statusTarget, setStatusTarget] = useState<Customer | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, statusFilter, debouncedSearch]);

  async function fetchCustomers() {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearch.trim(),
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load customer list');
      }

      setCustomers(data.data || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.total || 0);
      }
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (err: any) {
      console.error('Fetch customers error:', err);
      setError(err.message || 'Failed to load customer list');
    } finally {
      setLoading(false);
    }
  }

  async function openCustomerDetails(customer: Customer) {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
    setLoadingOrders(true);
    setCustomerOrders([]);
    try {
      const res = await fetch(`/api/admin/users/${customer.id}/orders`);
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomerOrders(data.data || []);
      }
    } catch (err) {
      console.error('Fetch customer order history error:', err);
    } finally {
      setLoadingOrders(false);
    }
  }

  async function handleToggleStatus() {
    if (!statusTarget) return;

    const newStatus = statusTarget.status === 'active' ? 'blocked' : 'active';
    try {
      setStatusUpdating(true);
      const res = await fetch(`/api/admin/users/${statusTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update account status');
      }

      // Refresh customers list
      fetchCustomers();
      setStatusTarget(null);
      if (selectedCustomer && selectedCustomer.id === statusTarget.id) {
        setSelectedCustomer((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update customer status');
    } finally {
      setStatusUpdating(false);
    }
  }

  // Calculate total customer revenue across current page or summary
  const totalRevenue = customers.reduce(
    (sum, c) => sum + Number(c.total_spent || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Customer Management
          </h1>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Monitor registered customers, inspect order metrics, and manage account statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchCustomers()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Customers */}
        <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#A3AED0]">
              Total Customers
            </p>
            <h3 className="text-2xl font-extrabold text-[#0F172A] mt-1">
              {summary.total_customers.toLocaleString()}
            </h3>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
              Registered users
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1]">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Active Accounts */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#A3AED0]">
              Active Users
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
              {summary.active_customers.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              In good standing
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Blocked / Suspicious */}
        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#A3AED0]">
              Blocked / Suspended
            </p>
            <h3 className="text-2xl font-extrabold text-red-700 mt-1">
              {summary.blocked_customers.toLocaleString()}
            </h3>
            <p className="text-[11px] text-red-600 font-semibold mt-0.5">
              Access restricted
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <UserX className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Page Revenue Generated */}
        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#A3AED0]">
              Total Page Revenue
            </p>
            <h3 className="text-2xl font-extrabold text-[#5b46f6] mt-1">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-purple-600 font-semibold mt-0.5">
              Across listed customers
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#5b46f6]">
            <IndianRupee className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white shadow-xs overflow-hidden">
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 border-b border-[#F1F5F9] bg-[#F8FAFC]/50">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email, or phone..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 hidden sm:inline-block" />
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
              {[
                { id: 'all', label: 'All Users' },
                { id: 'active', label: 'Active' },
                { id: 'blocked', label: 'Blocked' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-white text-[#6366F1] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Table */}
        {loading ? (
          <div className="py-16 text-center text-xs font-semibold text-[#6366F1] flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
            <span>Loading registered customer records...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-xs font-semibold text-red-600 bg-red-50/50 p-4 rounded-xl m-4 border border-red-100">
            {error}
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No customer accounts found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search
                ? `No customers match "${search}". Try adjusting your search keyword.`
                : 'No registered customers available under selected filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  <th className="py-3.5 px-6">Customer Details</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 px-4 text-right">Total Spent</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {customers.map((c) => {
                  const isBlocked = c.status !== 'active';
                  const initials = c.name
                    ? c.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U';

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-purple-50/20 transition-colors group"
                    >
                      {/* Customer Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-extrabold text-xs shadow-2xs ${
                              isBlocked
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gradient-to-tr from-[#6366F1] to-purple-500 text-white'
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 group-hover:text-[#6366F1] transition-colors">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">{c.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone Column */}
                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {c.phone || <span className="text-slate-400 italic">Not set</span>}
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 font-medium text-slate-600">
                        {new Date(c.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Order Count */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-extrabold text-[#6366F1] border border-purple-100">
                          <ShoppingBag className="h-3 w-3" />
                          <span>{c.order_count}</span>
                        </span>
                      </td>

                      {/* Total Amount Spent */}
                      <td className="py-4 px-4 text-right font-extrabold text-slate-900">
                        ₹{Number(c.total_spent).toLocaleString('en-IN')}
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider border ${
                            c.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {c.status === 'active' ? (
                            <CheckCircle className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <ShieldAlert className="h-3 w-3 text-red-600" />
                          )}
                          <span>{c.status}</span>
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Details & Orders Button */}
                          <button
                            type="button"
                            onClick={() => openCustomerDetails(c)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-1.5 text-xs font-extrabold text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-all cursor-pointer shadow-2xs group/btn"
                            title="View Customer Details & Order History"
                          >
                            <Eye className="h-3.5 w-3.5 transition-colors group-hover/btn:text-white" />
                            <span>Details</span>
                          </button>

                          {/* Block / Unblock Toggle Button */}
                          <button
                            type="button"
                            onClick={() => setStatusTarget(c)}
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                              isBlocked
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                                : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-600 hover:text-white'
                            }`}
                            title={isBlocked ? 'Unblock Customer Account' : 'Block / Suspend Account'}
                          >
                            {isBlocked ? (
                              <UserCheck className="h-4 w-4" />
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        <div className="p-4 border-t border-[#F1F5F9]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={(newPage) => setPage(newPage)}
            onItemsPerPageChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            itemsPerPageOptions={[10, 20, 50, 100]}
            itemLabel="customers"
          />
        </div>
      </div>

      {/* --- CUSTOMER DETAILS & ORDER HISTORY MODAL OVERLAY --- */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto no-scrollbar">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-indigo-100 bg-white/95 backdrop-blur-md px-6 py-5 sm:px-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6366F1] to-purple-500 text-white font-extrabold text-base shadow-md">
                  {selectedCustomer.name
                    ? selectedCustomer.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 font-display">
                      {selectedCustomer.name}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                        selectedCustomer.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Customer ID #{selectedCustomer.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto no-scrollbar flex-1">
              {/* Info Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Mail className="h-3 w-3 text-indigo-500" />
                    <span>Email Address</span>
                  </p>
                  <p className="font-bold text-slate-900 truncate">{selectedCustomer.email}</p>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-indigo-500" />
                    <span>Phone Number</span>
                  </p>
                  <p className="font-bold text-slate-900">
                    {selectedCustomer.phone || 'Not provided'}
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-indigo-500" />
                    <span>Joined Date</span>
                  </p>
                  <p className="font-bold text-slate-900">
                    {new Date(selectedCustomer.created_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <IndianRupee className="h-3 w-3 text-indigo-500" />
                    <span>Total Amount Spent</span>
                  </p>
                  <p className="font-bold text-indigo-600">
                    ₹{Number(selectedCustomer.total_spent).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Order History Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-[#6366F1]" />
                    <span>Customer Order History ({customerOrders.length})</span>
                  </h4>
                </div>

                {loadingOrders ? (
                  <div className="py-8 text-center text-xs font-semibold text-[#6366F1] flex items-center justify-center gap-2 bg-indigo-50/30 rounded-2xl">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading customer orders...</span>
                  </div>
                ) : customerOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 italic bg-indigo-50/20 rounded-2xl border border-indigo-100/60">
                    This customer has not placed any orders yet.
                  </div>
                ) : (
                  <div className="divide-y divide-indigo-50 rounded-2xl border border-indigo-100 bg-white overflow-hidden shadow-2xs">
                    {customerOrders.map((ord) => {
                      const itemCount = ord.total_items ?? (ord as any).item_count ?? 1;
                      const paymentMethod = ord.payment_method
                        ? ord.payment_method.toUpperCase()
                        : ord.payment_status
                        ? ord.payment_status.toUpperCase()
                        : 'CARD';

                      return (
                        <div
                          key={ord.id}
                          className="p-4 flex items-center justify-between gap-4 hover:bg-indigo-50/30 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">
                                #{ord.order_number}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase border ${
                                  ord.status === 'delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : ord.status === 'cancelled'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {new Date(ord.created_at).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}{' '}
                              • {itemCount} {itemCount === 1 ? 'item' : 'items'} • {paymentMethod}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-extrabold text-slate-900">
                              ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-indigo-100 bg-slate-50/50 p-4 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setStatusTarget(selectedCustomer);
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCustomer.status === 'active'
                    ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                {selectedCustomer.status === 'active' ? (
                  <>
                    <UserX className="h-3.5 w-3.5" />
                    <span>Block Customer Account</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Unblock Account</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BLOCK / UNBLOCK CONFIRMATION MODAL --- */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center space-y-4">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
                statusTarget.status === 'active'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {statusTarget.status === 'active' ? (
                <ShieldAlert className="h-7 w-7" />
              ) : (
                <UserCheck className="h-7 w-7" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {statusTarget.status === 'active'
                  ? 'Block / Deactivate Customer?'
                  : 'Reactivate Customer Account?'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {statusTarget.status === 'active'
                  ? `Are you sure you want to block ${statusTarget.name} (${statusTarget.email})? Blocking this account will prevent them from signing in or placing orders.`
                  : `Are you sure you want to restore active access for ${statusTarget.name} (${statusTarget.email})?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer flex-1"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={statusUpdating}
                onClick={handleToggleStatus}
                className={`rounded-xl px-5 py-2.5 text-xs font-extrabold text-white shadow-md cursor-pointer flex-1 disabled:opacity-50 ${
                  statusTarget.status === 'active'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                }`}
              >
                {statusUpdating
                  ? 'Updating...'
                  : statusTarget.status === 'active'
                  ? 'Yes, Block Account'
                  : 'Yes, Restore Access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
