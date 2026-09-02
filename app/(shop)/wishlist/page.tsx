'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, AlertCircle, Check, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/app/store/cartstore';
import { useWishlistStore } from '@/app/store/wishliststore';

type WishlistProduct = {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  sku?: string | null;
  stock_quantity?: number;
  main_image: string | null;
  created_at: string;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedItemsMap, setAddedItemsMap] = useState<Record<number, boolean>>({});

  const addItem = useCartStore((state) => state.addItem);
  const setWishlistIds = useWishlistStore((state) => state.setWishlistIds);
  const removeWishlistId = useWishlistStore((state) => state.removeWishlistId);

  async function fetchWishlist() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/wishlist');
      const data = await response.json();

      if (response.status === 401) {
        setError('Please login to view your saved wishlist.');
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch wishlist items');
      }

      const fetchedItems = data.data || [];
      setItems(fetchedItems);
      setWishlistIds(fetchedItems.map((i: any) => Number(i.product_id)));
    } catch (err: any) {
      console.error('Wishlist fetch error:', err);
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function removeWishlist(productId: number) {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to remove item');
      }

      setItems((previous) => previous.filter((item) => item.product_id !== productId));
      removeWishlistId(productId);
    } catch (err) {
      console.error('Remove wishlist error:', err);
    }
  }

  async function handleAddToCart(item: WishlistProduct) {
    const isOutOfStock = item.stock_quantity !== undefined && Number(item.stock_quantity) <= 0;
    if (isOutOfStock) return;

    addItem({
      productId: item.product_id,
      name: item.name,
      sku: item.sku || '',
      image: item.main_image || '/hero-img.png',
      price: Number(item.price),
      quantity: 1,
      stock: Number(item.stock_quantity ?? 99),
    });

    // Remove item from wishlist database & UI state
    await removeWishlist(item.product_id);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, idx) => (
            <div key={idx} className="rounded-3xl border border-purple-100 bg-white p-4 space-y-3 shadow-xs">
              <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500 border border-red-100 mb-4">
          <Heart size={36} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">Authentication Required</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">{error}</p>
        <Link
          href="/login?callbackUrl=/wishlist"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca] transition-all cursor-pointer"
        >
          <span>Log In to Account</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-50 text-[#5b46f6] border border-purple-100">
            <Heart size={36} className="fill-purple-100" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">Your Wishlist is Empty</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Save your favorite catalog items here to track sales and purchase them anytime with one click.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca] transition-all cursor-pointer"
          >
            <span>Explore Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-purple-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#5b46f6] font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Saved Favorites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            My Wishlist ({items.length})
          </h1>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-xs font-bold text-[#5b46f6] border border-purple-100 hover:bg-purple-100 transition-colors shrink-0"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const isOutOfStock = item.stock_quantity !== undefined && Number(item.stock_quantity) <= 0;
          const isDiscounted = item.compare_at_price && Number(item.compare_at_price) > Number(item.price);
          const isAdded = Boolean(addedItemsMap[item.product_id]);

          return (
            <div
              key={item.product_id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-purple-100 bg-white p-4 shadow-2xs hover:shadow-xl hover:border-purple-300 transition-all duration-300"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white p-3 flex items-center justify-center border border-purple-50">
                <Link href={`/product/${item.slug || item.product_id}`} className="w-full h-full flex items-center justify-center">
                  <img
                    src={item.main_image || '/hero-img.png'}
                    alt={item.name}
                    className={`h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105 ${
                      isOutOfStock ? 'opacity-60 grayscale' : ''
                    }`}
                  />
                </Link>

                {/* Out of Stock / Discount Badge */}
                {isOutOfStock ? (
                  <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                    Out of Stock
                  </span>
                ) : isDiscounted ? (
                  <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                    SALE
                  </span>
                ) : null}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeWishlist(item.product_id)}
                  className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-slate-100 text-slate-400 shadow-xs hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                  title={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Info & Add to Cart */}
              <div className="mt-3 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <Link href={`/product/${item.slug || item.product_id}`}>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-[#5b46f6] transition-colors leading-snug">
                      {item.name}
                    </h2>
                  </Link>

                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </span>
                    {isDiscounted && (
                      <span className="text-[11px] font-medium text-slate-400 line-through">
                        ₹{Number(item.compare_at_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  disabled={isOutOfStock}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all shadow-xs ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                      : isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#5b46f6] text-white hover:bg-[#4338ca] active:scale-95 cursor-pointer'
                  }`}
                >
                  {isOutOfStock ? (
                    <span>Out of Stock</span>
                  ) : isAdded ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
