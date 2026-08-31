'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import api from '@/lib/axios';
import Pagination from '@/components/ui/Pagination';

export interface ProductItem {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  care_instructions?: string | null;
  specifications?: Array<{ key: string; value: string }> | null;
  shipping_info?: string | null;
  faq?: Array<{ question: string; answer: string }> | null;
  sku: string;
  price: number;
  compare_at_price?: number | null;
  primary_image?: string | null;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  created_at: string;
}

interface ProductManagerProps {
  products: ProductItem[];
}

export default function ProductManager({ products }: ProductManagerProps) {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const itemsPerPage = 10;

  // Filter products by search term
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.category_name &&
        p.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.delete(`/api/products/${deletingProduct.id}`);

      if (res.status === 200 || res.data?.success) {
        setSuccessMsg('Product deleted successfully!');
        setDeletingProduct(null);
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? String(err.response.data.message)
          : 'Failed to delete product';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Products
          </h1>
          <p className="text-sm font-medium text-[#707EAE]">
            Manage store products, stock SKUs, and pricing
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search products by name, SKU, or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-[#E9EDF7] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none shadow-sm transition-all focus:border-[#6366F1]"
          />
        </div>

        <p className="text-xs font-bold text-[#707EAE]">
          Showing {filteredProducts.length} of {products.length} Products
        </p>
      </div>

      {/* Products Table Card */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mx-auto mb-4">
              <Package className="h-7 w-7" />
            </div>
            <p className="text-base font-bold text-[#0F172A]">
              {search ? 'No Matching Products' : 'No Products Listed'}
            </p>
            <p className="text-xs text-[#707EAE] mt-1 max-w-sm mx-auto">
              {search
                ? `No products match "${search}". Try searching with a different term.`
                : 'Click "Add Product" to publish your first item to the store.'}
            </p>

            {!search && (
              <Link
                href="/admin/products/new"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#4F46E5]"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product Now</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="max-h-[62vh] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                <tr className="border-b border-[#F1F5F9] text-xs font-bold text-[#94A3B8] uppercase">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="group hover:bg-[#F8FAFC]">
                    <td className="py-4 px-4 font-bold text-[#0F172A]">
                      <div className="flex items-center gap-3">
                        {prod.primary_image ? (
                          <img
                            src={prod.primary_image}
                            alt={prod.name}
                            className="h-11 w-11 rounded-xl object-cover border border-[#E9EDF7] shadow-sm shrink-0 bg-[#F8FAFC]"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E9EDF7] text-[#94A3B8] shrink-0">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0F172A]">{prod.name}</span>
                            {prod.featured && (
                              <span
                                title="Featured Showcase Product"
                                className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-200"
                              >
                                <Sparkles className="h-2.5 w-2.5" />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#94A3B8] font-normal">{prod.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#6366F1]">
                      {prod.category_name || 'Uncategorized'}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[#94A3B8]">
                      {prod.sku}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#0F172A]">
                      ₹{Number(prod.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {prod.compare_at_price && (
                        <span className="ml-1.5 text-xs text-[#94A3B8] line-through font-normal">
                          ₹{Number(prod.compare_at_price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {prod.status === 'active' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                          Active
                        </span>
                      )}
                      {prod.status === 'draft' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
                          Draft
                        </span>
                      )}
                      {prod.status === 'inactive' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${prod.id}/edit`}
                          title="Edit Product"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9EDF7] bg-white text-[#6366F1] transition-all hover:border-[#6366F1] hover:bg-indigo-50 shadow-sm"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => setDeletingProduct(prod)}
                          title="Delete Product"
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

        {!filteredProducts.length ? null : (
          <div className="pt-6">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))}
              itemLabel="products"
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-extrabold text-[#0F172A]">
              Delete Product?
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Are you sure you want to delete product{' '}
              <strong className="text-[#0F172A]">&quot;{deletingProduct.name}&quot;</strong>?
              This action cannot be undone.
            </p>

            {error && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="rounded-xl border border-[#E9EDF7] px-4 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteConfirm}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 hover:bg-red-700"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
