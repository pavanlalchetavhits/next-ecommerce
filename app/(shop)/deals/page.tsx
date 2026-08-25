'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  Sparkles,
  Tag,
  Clock,
  Copy,
  Check,
  Percent,
  Flame,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  Package,
  FileText,
  X,
  Info,
  CheckCircle2,
} from 'lucide-react';
import ProductCard from '@/components/user/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

type Product = {
  id: number;
  name: string;
  slug?: string;
  price: number;
  compare_at_price?: number | null;
  short_description?: string | null;
  description?: string | null;
  primary_image?: string | null;
  image_url?: string | null;
  category_name?: string | null;
  featured?: boolean;
};

type Coupon = {
  id: number;
  code: string;
  description?: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount?: number;
  maximum_discount_amount?: number | null;
  starts_at: string;
  expires_at?: string | null;
  status?: string;
};

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | '30' | '20' | 'featured'>('all');
  const [sortBy, setSortBy] = useState<string>('discount');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [tcModalCoupon, setTcModalCoupon] = useState<Coupon | null>(null);

  // Live Timer State (Countdown to midnight)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, couponRes] = await Promise.allSettled([
          axios.get('/api/products'),
          axios.get('/api/coupons?status=active'),
        ]);

        if (prodRes.status === 'fulfilled') {
          const list = Array.isArray(prodRes.value.data?.data)
            ? prodRes.value.data.data
            : Array.isArray(prodRes.value.data)
            ? prodRes.value.data
            : [];
          setProducts(list);
        }

        if (couponRes.status === 'fulfilled') {
          const cList = Array.isArray(couponRes.value.data?.data)
            ? couponRes.value.data.data
            : Array.isArray(couponRes.value.data)
            ? couponRes.value.data
            : [];
          setCoupons(cList);
        }
      } catch (err) {
        console.error('Failed to fetch data for deals page:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Calculate discount percentage and filter products
  const dealProducts = useMemo(() => {
    let list = products.map((p) => {
      const isDiscounted =
        p.compare_at_price && Number(p.compare_at_price) > Number(p.price);
      const discountPct = isDiscounted
        ? Math.round(
            ((Number(p.compare_at_price) - Number(p.price)) /
              Number(p.compare_at_price)) *
              100
          )
        : 0;
      return { ...p, discountPct, isDiscounted };
    });

    // Filter
    if (activeFilter === '30') {
      list = list.filter((p) => p.discountPct >= 30);
    } else if (activeFilter === '20') {
      list = list.filter((p) => p.discountPct >= 20);
    } else if (activeFilter === 'featured') {
      list = list.filter((p) => p.featured);
    } else {
      // 'all' -> return items with discount or featured status
      list = list.filter((p) => p.isDiscounted || p.featured);
    }

    // Sort
    if (sortBy === 'discount') {
      list.sort((a, b) => b.discountPct - a.discountPct);
    } else if (sortBy === 'price_low') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return list;
  }, [products, activeFilter, sortBy]);

  // Featured Hero Coupon
  const featuredCoupon = coupons.length > 0 ? coupons[0] : null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Flash Sale Section */}
        <ScrollReveal direction="down">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-slate-900 p-8 sm:p-14 text-white shadow-xl shadow-indigo-950/20 border border-indigo-900/50">
            {/* Ambient Glow Orbs */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Offer Details & Timer */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-red-500/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-red-300 border border-red-500/30">
                  <Flame className="h-4 w-4 text-red-400 fill-red-400" />
                  <span>Limited Time Flash Sale</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
                  Hot Deals & Special Offers
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                  Unlock instant savings of up to 50% on top electronics, luxury watches, and daily essentials. Offers refresh daily!
                </p>

                {/* Countdown Timer */}
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-indigo-400" />
                    Offer Ends In:
                  </span>
                  <div className="flex items-center gap-2 text-center">
                    <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 min-w-[48px]">
                      <span className="text-lg font-extrabold text-white font-mono">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                      <p className="text-[9px] text-slate-400 uppercase">Hrs</p>
                    </div>
                    <span className="text-lg font-bold text-indigo-400">:</span>
                    <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 min-w-[48px]">
                      <span className="text-lg font-extrabold text-white font-mono">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                      <p className="text-[9px] text-slate-400 uppercase">Min</p>
                    </div>
                    <span className="text-lg font-bold text-indigo-400">:</span>
                    <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 min-w-[48px]">
                      <span className="text-lg font-extrabold font-mono text-red-400 animate-pulse">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                      <p className="text-[9px] text-slate-400 uppercase">Sec</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Featured Promo Voucher Box */}
              {featuredCoupon ? (
                <div className="lg:col-span-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                      <Percent className="h-3.5 w-3.5" />
                      Active Promo Code
                    </span>
                    <button
                      type="button"
                      onClick={() => setTcModalCoupon(featuredCoupon)}
                      className="text-xs font-bold text-indigo-300 hover:text-white underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Terms & Conditions</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white font-display">
                      {featuredCoupon.discount_type === 'percentage'
                        ? `Extra ${featuredCoupon.discount_value}% Instant OFF`
                        : `Extra ₹${featuredCoupon.discount_value} Instant OFF`}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {featuredCoupon.description ||
                        `Apply code at checkout on orders over ₹${featuredCoupon.minimum_order_amount || 0}.`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-950/80 p-3 border border-white/10">
                    <span className="text-sm font-extrabold text-amber-400 font-mono tracking-widest pl-2">
                      {featuredCoupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(featuredCoupon.code)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#5b46f6] px-4 py-2 text-xs font-bold text-white hover:bg-[#4338ca] transition-all active:scale-95 cursor-pointer"
                    >
                      {copiedCode === featuredCoupon.code ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                      <Tag className="h-3.5 w-3.5" />
                      Flash Discounts
                    </span>
                    <span className="text-xs text-slate-300 font-medium">Automatic Deals</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white font-display">Instant Savings At Checkout</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Discounted pricing is automatically applied on all flash items listed below.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Dynamic Promo Coupons Grid */}
        {coupons.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#5b46f6]" />
                <h2 className="text-lg font-extrabold text-slate-900 font-display">
                  Active Promo Vouchers ({coupons.length})
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Click Terms & Conditions for full offer rules
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="rounded-2xl border border-purple-100 bg-white p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-extrabold text-[#5b46f6] border border-purple-100">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}% OFF`
                        : `₹${coupon.discount_value} OFF`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTcModalCoupon(coupon)}
                      className="text-[11px] font-bold text-[#5b46f6] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Terms & Conditions</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    {coupon.description || 'Valid on all eligible catalog items at checkout.'}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-purple-50">
                    <span className="font-mono text-xs font-bold text-slate-900">{coupon.code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(coupon.code)}
                      className="text-xs font-bold text-[#5b46f6] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Deals Filter & Sort Bar */}
        <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Active Deals' },
              { id: '30', label: '30%+ OFF' },
              { id: '20', label: '20%+ OFF' },
              { id: 'featured', label: 'Featured Deals' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#5b46f6] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-purple-50 hover:text-[#5b46f6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-purple-100 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="discount">Highest Discount</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Deal Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square animate-pulse rounded-3xl bg-slate-200/80 border border-slate-200"
              />
            ))}
          </div>
        ) : dealProducts.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-purple-100 shadow-xs max-w-md mx-auto space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-[#5b46f6] mx-auto">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">No deals match this filter</h3>
            <p className="text-xs text-slate-500">
              Try switching your filter to "All Active Deals" to explore all discounted items.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4338ca] transition-colors shadow-xs"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {dealProducts.map((product, idx) => (
              <ScrollReveal key={product.id} delay={(idx % 4) * 100} direction="up">
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Guarantees Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-purple-100/70 shadow-2xs">
            <Truck className="h-6 w-6 text-[#5b46f6] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Fast Shipping</h4>
              <p className="text-[10px] text-slate-500">Pan-India express delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-purple-100/70 shadow-2xs">
            <RotateCcw className="h-6 w-6 text-[#5b46f6] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">30-Day Returns</h4>
              <p className="text-[10px] text-slate-500">Hassle-free money back</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-purple-100/70 shadow-2xs">
            <ShieldCheck className="h-6 w-6 text-[#5b46f6] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Genuine</h4>
              <p className="text-[10px] text-slate-500">Verified manufacturer stock</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-purple-100/70 shadow-2xs">
            <Sparkles className="h-6 w-6 text-[#5b46f6] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Daily Flash Sales</h4>
              <p className="text-[10px] text-slate-500">Fresh deals added daily</p>
            </div>
          </div>
        </div>

      </div>

      {/* Customer Coupon Terms & Conditions Modal */}
      {tcModalCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 border border-purple-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-[#5b46f6]">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-slate-900 text-lg tracking-wider">
                      {tcModalCoupon.code}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                      {tcModalCoupon.discount_type === 'percentage'
                        ? `${tcModalCoupon.discount_value}% OFF`
                        : `₹${tcModalCoupon.discount_value} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Terms & Conditions of Offer</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTcModalCoupon(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Terms List */}
            <div className="space-y-4 text-xs text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#5b46f6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Discount Offer:</span>{' '}
                    {tcModalCoupon.discount_type === 'percentage'
                      ? `Enjoy ${tcModalCoupon.discount_value}% instant discount on your cart total.`
                      : `Enjoy flat ₹${tcModalCoupon.discount_value} cash discount on your order.`}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#5b46f6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Minimum Order Requirement:</span>{' '}
                    {tcModalCoupon.minimum_order_amount && Number(tcModalCoupon.minimum_order_amount) > 0
                      ? `Requires a minimum order value of ₹${tcModalCoupon.minimum_order_amount}.`
                      : 'No minimum order amount required.'}
                  </div>
                </div>

                {tcModalCoupon.maximum_discount_amount && (
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#5b46f6] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Maximum Discount Cap:</span>{' '}
                      Maximum savings capped at ₹{tcModalCoupon.maximum_discount_amount} per transaction.
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#5b46f6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Validity Period:</span>{' '}
                    Offer valid from{' '}
                    <span className="font-semibold">{new Date(tcModalCoupon.starts_at).toLocaleDateString()}</span>{' '}
                    until{' '}
                    <span className="font-semibold">
                      {tcModalCoupon.expires_at
                        ? new Date(tcModalCoupon.expires_at).toLocaleDateString()
                        : 'stocks last'}
                    </span>.
                  </div>
                </div>
              </div>

              {/* Offer Description */}
              {tcModalCoupon.description && (
                <div className="flex items-start gap-2.5 rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100 text-indigo-950">
                  <Info className="h-4 w-4 text-[#5b46f6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Additional Notes:</span> {tcModalCoupon.description}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">
              <button
                type="button"
                onClick={() => setTcModalCoupon(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCopyCode(tcModalCoupon.code);
                  setTcModalCoupon(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca] transition-all cursor-pointer"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Code & Shop Deals</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
