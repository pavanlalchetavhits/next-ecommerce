'use client';

import { useState, useEffect } from 'react';
import { Star, X, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import api from '@/lib/axios';

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  product: {
    id: number;
    name: string;
    image?: string | null;
    variant_name?: string | null;
  } | null;
  onReviewSubmitted?: () => void;
}

export default function ProductReviewModal({
  isOpen,
  onClose,
  userId,
  product,
  onReviewSubmitted,
}: ProductReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen && product) {
      setRating(5);
      setHoverRating(0);
      setTitle('');
      setComment('');
      setError('');
      setSuccess('');

      // Optionally fetch existing review for this product if already reviewed
      async function fetchExistingReview() {
        try {
          const res = await api.get(`/api/reviews?productId=${product?.id}&userId=${userId}`);
          if (res.data?.success && Array.isArray(res.data?.data)) {
            const userRev = res.data.data.find((r: any) => Number(r.user_id) === Number(userId));
            if (userRev) {
              setRating(userRev.rating || 5);
              setTitle(userRev.title || '');
              setComment(userRev.comment || '');
            }
          }
        } catch {
          // Silent fallback if fetch fails
        }
      }

      fetchExistingReview();
    }
  }, [isOpen, product, userId]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5 stars.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/api/reviews', {
        user_id: userId,
        product_id: product.id,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
      });

      if (res.data?.success) {
        setSuccess('Review submitted successfully! Thank you for your feedback.');
        if (onReviewSubmitted) onReviewSubmitted();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(res.data?.message || 'Failed to submit review');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Failed to submit review. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto no-scrollbar">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-5">
          <div className="flex items-center gap-2 text-[#5b46f6] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Product Review</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Preview Header Card */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-purple-100 bg-purple-50/40 p-3.5 mb-6">
          <div className="h-14 w-14 rounded-xl bg-white p-1.5 flex items-center justify-center border border-purple-100 shrink-0 overflow-hidden shadow-2xs">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <Sparkles className="h-6 w-6 text-purple-300" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1">
              {product.name}
            </h3>
            {product.variant_name && (
              <p className="text-[11px] font-bold text-[#5b46f6]">
                Variant: {product.variant_name}
              </p>
            )}
            <p className="text-[11px] text-slate-500">Verified Delivered Purchase</p>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-700 shadow-2xs">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 shadow-2xs">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating */}
          <div className="text-center space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Overall Rating *
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-100 text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-bold text-[#5b46f6]">
              {rating === 5
                ? 'Excellent - 5 Stars'
                : rating === 4
                ? 'Good - 4 Stars'
                : rating === 3
                ? 'Average - 3 Stars'
                : rating === 2
                ? 'Poor - 2 Stars'
                : 'Terrible - 1 Star'}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
              Review Title (Headline)
            </label>
            <input
              type="text"
              placeholder="e.g. Excellent quality, exceeded my expectations!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 outline-none transition-all focus:border-[#5b46f6] focus:ring-2 focus:ring-purple-500/10"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
              Detailed Review Comment
            </label>
            <textarea
              rows={4}
              placeholder="Share details of your experience with this product (build quality, design, performance, etc.)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-900 outline-none transition-all focus:border-[#5b46f6] focus:ring-2 focus:ring-purple-500/10"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] cursor-pointer disabled:opacity-50 transition-all active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Product Review</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
