'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Warehouse,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  Edit3,
  X,
  Loader2,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import api from '@/lib/axios';
import Pagination from '@/components/ui/Pagination';

export interface InventoryItem {
  product_id: number;
  product_name: string;
  product_sku: string;
  product_price: number;
  product_status: string;
  category_name?: string | null;
  primary_image?: string | null;

  inventory_id?: number | null;
  variant_id?: number | null;
  variant_name?: string | null;
  variant_sku?: string | null;

  quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  updated_at?: string | null;
}

interface InventoryManagerProps {
  inventory: InventoryItem[];
}

export default function InventoryManager({ inventory }: InventoryManagerProps) {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  >('all');

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);
  const [thresholdInput, setThresholdInput] = useState<number>(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Statistics
  const totalItems = inventory.length;
  const lowStockCount = inventory.filter(
    (item) => item.quantity > 0 && item.quantity <= item.low_stock_threshold
  ).length;
  const outOfStockCount = inventory.filter((item) => item.quantity <= 0).length;
  const inStockCount = inventory.filter(
    (item) => item.quantity > item.low_stock_threshold
  ).length;

  // Filter items
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(search.toLowerCase()) ||
      item.product_sku.toLowerCase().includes(search.toLowerCase()) ||
      (item.category_name &&
        item.category_name.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'in_stock') {
      return item.quantity > item.low_stock_threshold;
    }
    if (statusFilter === 'low_stock') {
      return item.quantity > 0 && item.quantity <= item.low_stock_threshold;
    }
    if (statusFilter === 'out_of_stock') {
      return item.quantity <= 0;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedInventory = filteredInventory.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  // Open Edit Stock Modal
  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setStockInput(item.quantity);
    setThresholdInput(item.low_stock_threshold || 5);
    setError('');
  };

  // Submit Stock Adjustment
  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.put('/api/inventory', {
        inventory_id: editingItem.inventory_id,
        product_id: editingItem.product_id,
        variant_id: editingItem.variant_id,
        quantity: Number(stockInput),
        low_stock_threshold: Number(thresholdInput),
      });

      if (res.status === 200 || res.data?.success) {
        setSuccessMsg(`Stock updated for ${editingItem.product_name}!`);
        setEditingItem(null);
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update stock');
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
            Inventory Management
          </h1>
          <p className="text-sm font-medium text-[#707EAE]">
            Monitor stock levels, manage low stock alerts, and adjust quantities
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary Statistic Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Items */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707EAE] uppercase">
              Total Products
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
              <Warehouse className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{totalItems}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">Tracked in catalog</p>
        </div>

        {/* In Stock */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase">
              In Stock
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{inStockCount}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">Healthy inventory levels</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase">
              Low Stock Alerts
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {lowStockCount}
          </p>
          <p className="mt-1 text-xs text-amber-600 font-medium">
            Requires restock soon
          </p>
        </div>

        {/* Out of Stock */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 uppercase">
              Out of Stock
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {outOfStockCount}
          </p>
          <p className="mt-1 text-xs text-red-600 font-medium">Unavailable to buyers</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-[#E9EDF7] bg-white p-1.5 shadow-sm">
          <button
            onClick={() => {
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            All ({inventory.length})
          </button>

          <button
            onClick={() => {
              setStatusFilter('in_stock');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'in_stock'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            In Stock ({inStockCount})
          </button>

          <button
            onClick={() => {
              setStatusFilter('low_stock');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'low_stock'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>

          <button
            onClick={() => {
              setStatusFilter('out_of_stock');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'out_of_stock'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-[#64748B] hover:bg-red-50 hover:text-red-700'
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-[#E9EDF7] bg-white py-2.5 pl-10 pr-4 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none shadow-sm transition-all focus:border-[#6366F1]"
          />
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm">
        {filteredInventory.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mx-auto mb-4">
              <Warehouse className="h-7 w-7" />
            </div>
            <p className="text-base font-bold text-[#0F172A]">No Inventory Items Found</p>
            <p className="text-xs text-[#707EAE] mt-1 max-w-sm mx-auto">
              No products match your current search or status filter criteria.
            </p>
          </div>
        ) : (
          <div className="max-h-[62vh] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                <tr className="border-b border-[#F1F5F9] text-xs font-bold text-[#94A3B8] uppercase">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Stock Quantity</th>
                  <th className="py-3 px-4 text-center">Low Stock Alert</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {paginatedInventory.map((item) => {
                  const isOutOfStock = item.quantity <= 0;
                  const isLowStock =
                    item.quantity > 0 && item.quantity <= item.low_stock_threshold;
                  const isInStock = item.quantity > item.low_stock_threshold;

                  return (
                    <tr key={item.product_id} className="group hover:bg-[#F8FAFC]">
                      {/* Product Thumbnail & Details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {item.primary_image ? (
                            <img
                              src={item.primary_image}
                              alt={item.product_name}
                              className="h-11 w-11 rounded-xl object-cover border border-[#E9EDF7] shadow-sm shrink-0 bg-[#F8FAFC]"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E9EDF7] text-[#94A3B8] shrink-0">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[#0F172A]">
                              {item.product_name}
                            </p>
                            {item.variant_name && (
                              <span className="inline-block rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-[#6366F1]">
                                Variant: {item.variant_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 font-semibold text-[#6366F1]">
                        {item.category_name || 'Uncategorized'}
                      </td>

                      {/* SKU */}
                      <td className="py-4 px-4 font-mono text-xs text-[#94A3B8]">
                        {item.variant_sku || item.product_sku}
                      </td>

                      {/* Status Pill */}
                      <td className="py-4 px-4 text-center">
                        {isInStock && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            In Stock
                          </span>
                        )}
                        {isLowStock && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 border border-red-200">
                            <XCircle className="h-3 w-3" />
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`text-base font-extrabold ${
                            isOutOfStock
                              ? 'text-red-600'
                              : isLowStock
                              ? 'text-amber-600'
                              : 'text-[#0F172A]'
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <span className="block text-[10px] text-[#94A3B8] font-medium">
                          {item.reserved_quantity > 0
                            ? `(${item.reserved_quantity} Reserved)`
                            : 'Available'}
                        </span>
                      </td>

                      {/* Low Stock Alert Threshold */}
                      <td className="py-4 px-4 text-center font-bold text-[#64748B] text-xs">
                        &le; {item.low_stock_threshold} units
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EDF7] bg-white px-3.5 py-2 text-xs font-bold text-[#6366F1] shadow-sm transition-all hover:border-[#6366F1] hover:bg-indigo-50"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Adjust Stock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredInventory.length > 0 && (
          <div className="pt-6">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={filteredInventory.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) =>
                setCurrentPage(Math.min(Math.max(page, 1), totalPages))
              }
              itemLabel="inventory items"
            />
          </div>
        )}
      </div>

      {/* --- STOCK ADJUSTMENT MODAL --- */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E9EDF7] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
                  <Warehouse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Adjust Stock
                  </h3>
                  <p className="text-xs text-[#707EAE] truncate max-w-[220px]">
                    {editingItem.product_name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error in Modal */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleStockSubmit} className="mt-5 space-y-5">
              {/* Quick Stock Controls */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1.5">
                  Stock Quantity (On Hand) *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStockInput((prev) => Math.max(0, prev - 10))}
                    className="rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] px-3 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#6366F1]"
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockInput((prev) => Math.max(0, prev - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#6366F1]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <input
                    type="number"
                    min={0}
                    required
                    value={stockInput}
                    onChange={(e) => setStockInput(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-center text-lg font-extrabold text-[#0F172A] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setStockInput((prev) => prev + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#6366F1]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockInput((prev) => prev + 10)}
                    className="rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] px-3 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#6366F1]"
                  >
                    +10
                  </button>
                </div>
              </div>

              {/* Low Stock Alert Threshold */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Low Stock Threshold Alert
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] p-2.5 text-sm font-bold text-[#0F172A] outline-none focus:border-[#6366F1] focus:bg-white"
                />
                <p className="mt-1 text-[11px] text-[#94A3B8]">
                  Triggers low stock alert status when quantity is at or below this value.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9EDF7]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
                  <span>Save Stock Quantity</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
