import DashboardCard from '@/components/DashboardCard';
import { getDashboardStats } from '@/services/dashboard.service';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 pb-8">
      {/* Top Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm font-medium text-[#707EAE]">
            Live real-time metrics from your NexCart database.
          </p>
        </div>

        {/* <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 rounded-xl border border-[#E9EDF7] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition-all hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
          >
            <FolderTree className="h-4 w-4 text-[#6366F1]" />
            <span>Categories</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Link>
        </div> */}
      </div>

      {/* 4 Dynamic Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          subtitle="Real-time completed orders total"
        />
        <DashboardCard
          title="Total Orders"
          value={stats.ordersCount.toLocaleString()}
          icon={ShoppingBag}
          subtitle="Orders placed across store"
        />
        <DashboardCard
          title="Active Products"
          value={stats.productsCount.toLocaleString()}
          icon={Package}
          subtitle={`Across ${stats.categoriesCount} categories`}
        />
        <DashboardCard
          title="Total Customers"
          value={stats.usersCount.toLocaleString()}
          icon={Users}
          subtitle="Registered customer accounts"
        />
      </div>

      {/* Main Content Layout: Recent Orders & Quick Management */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-6 border-b border-[#E9EDF7]">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                Recent Transactions
              </h2>
              <p className="text-xs text-[#707EAE]">
                Live customer transactions from database
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-bold text-[#6366F1] hover:underline"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mb-3">
                <Inbox className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-[#0F172A]">No Recent Orders</p>
              <p className="text-xs text-[#707EAE] mt-1 max-w-xs">
                Orders will automatically appear here once customers purchases.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#F1F5F9] text-xs font-bold text-[#94A3B8] uppercase">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 font-bold text-[#6366F1]">
                        {order.id}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-[#0F172A]">
                          {order.customer}
                        </p>
                        <p className="text-xs text-[#94A3B8]">{order.email}</p>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#0F172A]">
                        {order.amount}
                      </td>
                      <td className="py-4 px-4">
                        {order.status === 'Completed' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                        {order.status === 'Processing' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 border border-blue-200">
                            <Clock className="h-3 w-3" />
                            Processing
                          </span>
                        )}
                        {order.status !== 'Completed' &&
                          order.status !== 'Processing' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
                              <AlertCircle className="h-3 w-3" />
                              {order.status}
                            </span>
                          )}
                      </td>
                      <td className="py-4 px-4 text-right text-xs text-[#94A3B8]">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links & Platform Status Side Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0F172A]">Quick Actions</h3>
            <p className="text-xs text-[#707EAE] mb-4">
              Manage your database entities directly
            </p>

            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="flex items-center justify-between rounded-xl border border-[#E9EDF7] p-3.5 transition-all hover:border-[#6366F1] hover:bg-indigo-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-[#6366F1]">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">
                      Products ({stats.productsCount})
                    </p>
                    <p className="text-xs text-[#94A3B8]">Manage store items</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#94A3B8]" />
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center justify-between rounded-xl border border-[#E9EDF7] p-3.5 transition-all hover:border-[#6366F1] hover:bg-indigo-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <FolderTree className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">
                      Categories ({stats.categoriesCount})
                    </p>
                    <p className="text-xs text-[#94A3B8]">Organize catalog</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#94A3B8]" />
              </Link>

              <Link
                href="/admin/inventory"
                className="flex items-center justify-between rounded-xl border border-[#E9EDF7] p-3.5 transition-all hover:border-[#6366F1] hover:bg-indigo-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">
                      Customers ({stats.usersCount})
                    </p>
                    <p className="text-xs text-[#94A3B8]">Registered accounts</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#94A3B8]" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] p-6 text-white shadow-xl shadow-indigo-950/20">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                ● Live Database Active
              </span>
              <span className="text-xs text-slate-400">MySQL Connection</span>
            </div>
            <h4 className="mt-4 text-lg font-bold">Real-time Data Sync</h4>
            <p className="mt-1 text-xs text-slate-300">
              All metrics on this page are connected to your active MySQL database tables (`products`, `categories`, `users`, `orders`).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}