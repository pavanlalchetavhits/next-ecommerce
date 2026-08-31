'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Search,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  X,
  Loader2,
  AlertCircle,
  Check,
  Package,
} from 'lucide-react';
import api from '@/lib/axios';
import Pagination from '@/components/ui/Pagination';

export interface ReviewItem {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  title?: string | null;
  comment?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  customer_name?: string | null;
  customer_email?: string | null;
  product_name?: string | null;
  product_slug?: string | null;
  product_image?: string | null;
}

interface ReviewManagerProps {
  reviews: ReviewItem[];
}

export default function ReviewManager({ reviews }: ReviewManagerProps) {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const [viewingReview, setViewingReview] = useState<ReviewItem | null>(null);
  const [deletingReview, setDeletingReview] = useState<ReviewItem | null>(null);

  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Statistics
  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / totalReviews).toFixed(1)
      : '0.0';

  // Filtered Reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      (r.customer_name && r.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (r.customer_email && r.customer_email.toLowerCase().includes(search.toLowerCase())) ||
      (r.product_name && r.product_name.toLowerCase().includes(search.toLowerCase())) ||
      (r.title && r.title.toLowerCase().includes(search.toLowerCase())) ||
      (r.comment && r.comment.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter !== 'all' && r.status !== statusFilter) return false;

    if (ratingFilter !== 'all' && Number(r.rating) !== Number(ratingFilter)) return false;

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedReviews = filteredReviews.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  // Handle Moderation Status Update (Approve / Reject)
  const handleStatusUpdate = async (reviewId: number, newStatus: 'approved' | 'rejected' | 'pending') => {
    setLoadingId(reviewId);
    setError('');

    try {
      const res = await api.patch(`/api/reviews/${reviewId}`, {
        status: newStatus,
      });

      if (res.status === 200 || res.data?.success) {
        setSuccessMsg(`Review #${reviewId} status updated to "${newStatus}"!`);
        if (viewingReview && viewingReview.id === reviewId) {
          setViewingReview((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update review status');
    } finally {
      setLoadingId(null);
    }
  };

  // Delete Review
  const handleDelete = async () => {
    if (!deletingReview) return;
    setLoadingId(deletingReview.id);
    setError('');

    try {
      await api.delete(`/api/reviews/${deletingReview.id}`);
      setSuccessMsg(`Review deleted successfully!`);
      setDeletingReview(null);
      if (viewingReview && viewingReview.id === deletingReview.id) {
        setViewingReview(null);
      }
      router.refresh();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setLoadingId(null);
    }
  };

  // Render Stars Helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Product Reviews & Moderation
          </h1>
          <p className="text-sm font-medium text-[#707EAE]">
            Review customer feedback, approve ratings, and moderate product reviews
          </p>
        </div>
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
        {/* Total Reviews */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707EAE] uppercase">
              Total Reviews
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{totalReviews}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">Submitted by buyers</p>
        </div>

        {/* Pending Moderation */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase">
              Pending Approval
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{pendingCount}</p>
          <p className="mt-1 text-xs text-amber-600 font-medium">Awaiting moderation</p>
        </div>

        {/* Approved Reviews */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase">
              Approved & Public
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">{approvedCount}</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Visible on store</p>
        </div>

        {/* Average Rating */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-500 uppercase">
              Average Rating
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0F172A]">
            {averageRating} <span className="text-xs text-[#94A3B8] font-normal">/ 5.0</span>
          </p>
          <p className="mt-1 text-xs text-[#94A3B8]">Overall score</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Status & Rating Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-[#E9EDF7] bg-white p-1 shadow-sm">
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
              All ({reviews.length})
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
              Pending ({pendingCount})
            </button>

            <button
              onClick={() => {
                setStatusFilter('approved');
                setCurrentPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[#64748B] hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              Approved ({approvedCount})
            </button>

            <button
              onClick={() => {
                setStatusFilter('rejected');
                setCurrentPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === 'rejected'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-[#64748B] hover:bg-red-50 hover:text-red-700'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Star Filter Dropdown */}
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-xl border border-[#E9EDF7] bg-white px-3 py-2 text-xs font-bold text-[#0F172A] outline-none shadow-sm transition-all focus:border-[#6366F1]"
          >
            <option value="all">All Rating Stars</option>
            <option value="5">5 Stars ★★★★★</option>
            <option value="4">4 Stars ★★★★☆</option>
            <option value="3">3 Stars ★★★☆☆</option>
            <option value="2">2 Stars ★★☆☆☆</option>
            <option value="1">1 Star ★☆☆☆☆</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by product, customer, or comment..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-[#E9EDF7] bg-white py-2.5 pl-10 pr-10 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none shadow-sm transition-all focus:border-[#6366F1]"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear review search"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#64748B] transition-colors hover:bg-slate-100 hover:text-[#0F172A]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reviews Table Card */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm">
        {filteredReviews.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mx-auto mb-4">
              <MessageSquare className="h-7 w-7" />
            </div>
            <p className="text-base font-bold text-[#0F172A]">No Product Reviews Found</p>
            <p className="text-xs text-[#707EAE] mt-1 max-w-sm mx-auto">
              No product reviews match your current search query or rating filter selection.
            </p>
          </div>
        ) : (
          <div className="max-h-[62vh] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                <tr className="border-b border-[#F1F5F9] text-xs font-bold text-[#94A3B8] uppercase">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-center">Rating</th>
                  <th className="py-3 px-4">Review Content</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {paginatedReviews.map((rev) => (
                  <tr key={rev.id} className="group hover:bg-[#F8FAFC]">
                    {/* Product Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {rev.product_image ? (
                          <img
                            src={rev.product_image}
                            alt={rev.product_name || 'Product'}
                            className="h-10 w-10 rounded-lg object-cover border border-[#E9EDF7] shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8FAFC] border border-[#E9EDF7] text-[#94A3B8] shrink-0">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                        <p className="font-bold text-[#0F172A] max-w-[160px] truncate">
                          {rev.product_name || 'Unknown Product'}
                        </p>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-[#0F172A]">
                        {rev.customer_name || 'Anonymous User'}
                      </p>
                      <p className="text-xs text-[#94A3B8] font-normal">
                        {rev.customer_email || 'N/A'}
                      </p>
                    </td>

                    {/* Star Rating */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        {renderStars(Number(rev.rating))}
                      </div>
                      <span className="block text-[11px] font-bold text-[#64748B] mt-0.5">
                        {rev.rating} / 5
                      </span>
                    </td>

                    {/* Review Title & Comment Snippet */}
                    <td className="py-4 px-4">
                      {rev.title && (
                        <p className="font-bold text-[#0F172A] text-xs">
                          {rev.title}
                        </p>
                      )}
                      <p className="text-xs text-[#64748B] line-clamp-2 max-w-sm">
                        {rev.comment || 'No comment text provided.'}
                      </p>
                      <span className="text-[10px] text-[#94A3B8] block mt-1">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4 text-center">
                      {rev.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                          Approved
                        </span>
                      )}
                      {rev.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
                          Pending
                        </span>
                      )}
                      {rev.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 border border-red-200">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(rev.id, 'approved')}
                            disabled={loadingId === rev.id}
                            title="Approve Review"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}

                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(rev.id, 'rejected')}
                            disabled={loadingId === rev.id}
                            title="Reject Review"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setViewingReview(rev)}
                          title="View Review Details"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EDF7] bg-white text-[#6366F1] hover:border-[#6366F1] hover:bg-indigo-50 transition-all shadow-sm"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setDeletingReview(rev)}
                          title="Delete Review"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
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

        {filteredReviews.length > 0 && (
          <div className="pt-6">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={filteredReviews.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) =>
                setCurrentPage(Math.min(Math.max(page, 1), totalPages))
              }
              itemLabel="reviews"
            />
          </div>
        )}
      </div>

      {/* --- REVIEW DETAIL & MODERATION MODAL --- */}
      {viewingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E9EDF7] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Review Moderation
                  </h3>
                  <p className="text-xs text-[#707EAE]">
                    Submitted by {viewingReview.customer_name || 'Customer'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingReview(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="mt-5 space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] p-3">
                {viewingReview.product_image ? (
                  <img
                    src={viewingReview.product_image}
                    alt={viewingReview.product_name || 'Product'}
                    className="h-11 w-11 rounded-lg object-cover border border-[#E9EDF7] shrink-0"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border border-[#E9EDF7] text-[#94A3B8] shrink-0">
                    <Package className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">
                    {viewingReview.product_name}
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">
                    Submitted on {new Date(viewingReview.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Rating & Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0F172A] uppercase">Rating</span>
                  {renderStars(Number(viewingReview.rating))}
                </div>
                {viewingReview.title && (
                  <p className="text-sm font-extrabold text-[#0F172A] mt-2">
                    "{viewingReview.title}"
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Customer Comment
                </label>
                <div className="rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] leading-relaxed">
                  {viewingReview.comment || 'No comment text written.'}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E9EDF7]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(viewingReview.id, 'approved')}
                    disabled={loadingId === viewingReview.id}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(viewingReview.id, 'rejected')}
                    disabled={loadingId === viewingReview.id}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Reject</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingReview(null)}
                  className="rounded-xl border border-[#E9EDF7] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deletingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-extrabold text-[#0F172A]">Delete Review</h3>
            <p className="mt-1 text-xs text-[#707EAE]">
              Are you sure you want to delete this customer review? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingReview(null)}
                className="rounded-xl border border-[#E9EDF7] px-4 py-2.5 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loadingId === deletingReview.id}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-500/25 hover:bg-red-700"
              >
                {loadingId === deletingReview.id && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>Delete Review</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
