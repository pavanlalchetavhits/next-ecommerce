'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  Search,
  X,
  Layers,
  Sparkles,
  ArrowRight,
  Package,
  Grid,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import CategoryCard from '@/components/user/CategoryCard';

type Category = {
  id: number;
  name: string;
  slug?: string;
  image?: string | null;
  image_url?: string | null;
  primary_image?: string | null;
  description?: string | null;
  product_count?: number;
};

const CATEGORY_FAQS = [
  {
    question: 'How do I choose the right product category?',
    answer:
      'Browse through our curated catalog cards above or use the live search bar to quickly locate specific departments like Electronics, Wearables, or Home Essentials. Clicking any category opens its dedicated product collection.',
  },
  {
    question: 'Are products across all categories genuine & covered by warranty?',
    answer:
      'Yes! 100% of products in all categories are sourced directly from certified manufacturers and brand distributors, backed by standard manufacturer warranties.',
  },
  {
    question: 'How frequently are new categories and products added?',
    answer:
      'Our catalog is updated weekly with new product arrivals, seasonal collections, and trending category lines.',
  },
  {
    question: 'Can I filter products by price, rating, or brand within a category?',
    answer:
      'Absolutely. Selecting any category tile opens the full catalog view equipped with interactive filters for price range, stock availability, customer ratings, and sorting options.',
  },
  {
    question: 'Do all categories qualify for express shipping and easy returns?',
    answer:
      'Yes, express 2-4 business day delivery and our hassle-free 30-day return policy apply across all product categories.',
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get('/api/categories');
        const list = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.categories)
          ? response.data.categories
          : Array.isArray(response.data)
          ? response.data
          : [];
        setCategories(list);
      } catch (err: any) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again later.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase().trim();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query))
    );
  }, [categories, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl shadow-indigo-950/20 border border-indigo-900/50">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#5b46f6]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-indigo-300 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Explore Collections</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              Product Categories
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              Browse through our handpicked categories to discover premium electronics, stylish accessories, home goods, and more.
            </p>

            {/* Search Input Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl bg-white/10 border border-white/15 pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b46f6] focus:bg-white/15 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-200 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 shrink-0">
                <Grid className="h-4 w-4 text-indigo-400" />
                <span>
                  {loading
                    ? 'Loading...'
                    : `${filteredCategories.length} ${
                        filteredCategories.length === 1 ? 'Category' : 'Categories'
                      }`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-[4/5] animate-pulse rounded-3xl bg-slate-200/80 border border-slate-200"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 p-8 text-center border border-red-100 max-w-lg mx-auto space-y-3">
            <Package className="h-10 w-10 text-red-500 mx-auto" />
            <h3 className="text-lg font-bold text-red-900">Oops! Couldn't load categories</h3>
            <p className="text-xs text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-purple-100 shadow-xs max-w-md mx-auto space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-[#5b46f6] mx-auto">
              <Layers className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">No categories found</h3>
            <p className="text-xs text-slate-500">
              {searchQuery
                ? `No category matches "${searchQuery}". Try searching with a different keyword.`
                : 'No product categories are currently available.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4338ca] transition-colors shadow-xs"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {/* Category Buyer Guide & FAQ Accordion */}
        <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-10 shadow-xs space-y-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3 py-1 text-xs font-bold text-[#5b46f6]">
              <HelpCircle className="h-3.5 w-3.5" />
              Shopping Assistance
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 font-display">
              Category Buyer Guide & FAQs
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Answers to frequently asked questions about our collections, warranties, and shipping.
            </p>
          </div>

          <div className="space-y-3">
            {CATEGORY_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-purple-200 bg-purple-50/40 shadow-2xs'
                      : 'border-slate-100 bg-white hover:border-purple-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#5b46f6] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-purple-100/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Value Highlights Footer Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
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
              <h4 className="text-xs font-bold text-slate-900">Hassle-Free Returns</h4>
              <p className="text-[10px] text-slate-500">30-day money-back policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-purple-100/70 shadow-2xs">
            <ShieldCheck className="h-6 w-6 text-[#5b46f6] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Authentic</h4>
              <p className="text-[10px] text-slate-500">Direct from top brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-purple-100/70 shadow-2xs">
            <Award className="h-6 w-6 text-[#5b46f6] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Guaranteed Quality</h4>
              <p className="text-[10px] text-slate-500">Verified product specs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
