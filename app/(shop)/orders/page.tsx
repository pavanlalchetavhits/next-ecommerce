'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

type OrderItem = {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  item_count: number;
  created_at: string;
  shipping_full_name: string;
};

const ITEMS_PER_PAGE = 10;

export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchUserOrders() {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/orders');
      if (res.status === 401) {
        router.push('/login?callbackUrl=/orders');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data.data || []);
    } catch (err: any) {
      console.error('My orders fetch error:', err);
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-2xl bg-slate-200" />
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, idx) => (
            <div key={idx} className="h-28 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500 border border-red-100 mb-4">
          <AlertCircle size={36} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">Authentication Required</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">{error}</p>
        <Link
          href="/login?callbackUrl=/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca]"
        >
          <span>Log In to View Orders</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-purple-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#5b46f6] font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Customer Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            My Orders ({orders.length})
          </h1>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca] transition-all cursor-pointer shrink-0"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Filter Tabs */}
      {orders.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
          <button
            type="button"
            onClick={() => handleFilterChange('all')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#5b46f6] text-white shadow-xs'
                : 'bg-purple-50 text-slate-700 hover:bg-purple-100'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange('confirmed')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'confirmed'
                ? 'bg-[#5b46f6] text-white shadow-xs'
                : 'bg-purple-50 text-slate-700 hover:bg-purple-100'
            }`}
          >
            Confirmed ({orders.filter((o) => o.status === 'confirmed').length})
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange('shipped')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'shipped'
                ? 'bg-[#5b46f6] text-white shadow-xs'
                : 'bg-purple-50 text-slate-700 hover:bg-purple-100'
            }`}
          >
            Shipped ({orders.filter((o) => o.status === 'shipped').length})
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange('delivered')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'delivered'
                ? 'bg-[#5b46f6] text-white shadow-xs'
                : 'bg-purple-50 text-slate-700 hover:bg-purple-100'
            }`}
          >
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-3xl border-2 border-dashed border-purple-100 bg-purple-50/20">
          <Package className="mx-auto h-14 w-14 text-purple-300" />
          <h2 className="text-lg font-bold text-slate-900">No Orders Found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {orders.length === 0
              ? "You haven't placed any orders yet. Start shopping to view order tracking here!"
              : 'No orders match the selected filter category.'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca]"
          >
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedOrders.map((ord) => {
            const statusBg =
              ord.status === 'delivered'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : ord.status === 'cancelled'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div
                key={ord.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-purple-100 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all duration-300"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-slate-900">
                      #{ord.order_number}
                    </span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase border tracking-wider ${statusBg}`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <p>
                      Date:{' '}
                      <span className="font-semibold text-slate-800">
                        {new Date(ord.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </p>
                    <p>
                      Items:{' '}
                      <span className="font-semibold text-slate-800">
                        {ord.item_count || 1}
                      </span>
                    </p>
                    <p>
                      Recipient:{' '}
                      <span className="font-semibold text-slate-800">
                        {ord.shipping_full_name}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-purple-50">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Amount</p>
                    <p className="text-base font-extrabold text-slate-900">
                      ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <Link
                    href={`/orders/${ord.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 border border-purple-100 px-4 py-2.5 text-xs font-bold text-[#5b46f6] hover:bg-[#5b46f6] hover:text-white transition-all shadow-2xs"
                  >
                    <span>View Order</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Reusable Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => setCurrentPage(page)}
            itemLabel="orders"
          />
        </div>
      )}
    </div>
  );
}
