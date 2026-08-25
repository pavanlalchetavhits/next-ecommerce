'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Share2,
  HelpCircle,
  Award,
} from 'lucide-react';
import ProductCard from '@/components/user/ProductCard';

interface ProductImage {
  id?: number;
  image_url: string;
  alt_text?: string;
  is_primary?: boolean;
}

interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    compare_at_price?: number | null;
    category_id?: number;
    category_name?: string | null;
    short_description?: string | null;
    description?: string | null;
    care_instructions?: string | null;
    specifications?: any;
    shipping_info?: string | null;
    faq?: any;
    sku?: string | null;
    images?: ProductImage[];
  };
  relatedProducts?: any[];
}

function parseSpecifications(raw: any): { key: string; value: string }[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.filter((s) => s && (s.key || s.value));
  }

  if (typeof raw === 'string') {
    // 1. Try parsing JSON string
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((s) => s && (s.key || s.value));
    } catch {
      // Not JSON
    }

    const items: { key: string; value: string }[] = [];

    // 2. Try parsing HTML <table>, <tr>, <td> / <th> tags
    if (/<tr/i.test(raw)) {
      const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let trMatch;
      while ((trMatch = trRegex.exec(raw)) !== null) {
        const rowContent = trMatch[1];
        const cellRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
        const cells: string[] = [];
        let cellMatch;
        while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
          const cleanCell = cellMatch[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
          cells.push(cleanCell);
        }
        if (cells.length >= 2) {
          const key = cells[0];
          const value = cells.slice(1).join(' ');
          // Skip header row if it's "Specification" & "Detail"
          if (
            /specification|feature|key|parameter/i.test(key) &&
            /detail|value|specificationsdetails/i.test(value)
          ) {
            continue;
          }
          if (key || value) {
            items.push({ key, value });
          }
        } else if (cells.length === 1 && cells[0]) {
          const parts = cells[0].split(/\t|:\s*/);
          if (parts.length >= 2) {
            items.push({ key: parts[0].trim(), value: parts.slice(1).join(' ').trim() });
          }
        }
      }
      if (items.length > 0) return items;
    }

    // 3. Try parsing <p><strong>Key:</strong> Value</p> or <p>Key\tValue</p>
    if (/<p/i.test(raw)) {
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let pMatch;
      while ((pMatch = pRegex.exec(raw)) !== null) {
        const pText = pMatch[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
        if (!pText) continue;
        if (pText.includes('\t')) {
          const parts = pText.split('\t').filter(Boolean);
          if (parts.length >= 2) {
            items.push({ key: parts[0].trim(), value: parts.slice(1).join(' ').trim() });
          }
        } else if (pText.includes(':')) {
          const parts = pText.split(':');
          items.push({ key: parts[0].trim(), value: parts.slice(1).join(':').trim() });
        } else {
          items.push({ key: 'Specification', value: pText });
        }
      }
      if (items.length > 0) return items;
    }

    // 4. Fallback: split by lines or tabs
    const lines = raw.split(/\r?\n|<br\s*\/?>/i);
    for (const line of lines) {
      const cleanLine = line.replace(/<\/?[^>]+(>|$)/g, '').trim();
      if (!cleanLine) continue;

      if (cleanLine.includes('\t')) {
        const parts = cleanLine.split('\t').filter(Boolean);
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(' ').trim();
          if (!/specification|feature/i.test(key) || !/detail|value/i.test(value)) {
            items.push({ key, value });
          }
        }
      } else if (cleanLine.includes(':')) {
        const parts = cleanLine.split(':');
        items.push({ key: parts[0].trim(), value: parts.slice(1).join(':').trim() });
      } else {
        items.push({ key: 'Specification', value: cleanLine });
      }
    }
    return items;
  }

  return [];
}

export default function ProductDetailClient({
  product,
  relatedProducts = [],
}: ProductDetailProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ image_url: '/hero-img.png' }];

  const [selectedImage, setSelectedImage] = useState(images[0]?.image_url || '/hero-img.png');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'care' | 'shipping' | 'faq'>('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isDiscounted =
    product.compare_at_price && Number(product.compare_at_price) > Number(product.price);
  
  const discountPercentage = isDiscounted
    ? Math.round(
        ((Number(product.compare_at_price) - Number(product.price)) /
          Number(product.compare_at_price)) *
          100
      )
    : 0;

  // Clean description string from rich text HTML
  const cleanShortDesc = product.short_description
    ? product.short_description.replace(/<[^>]*>/g, '').trim()
    : '';

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto py-1">
        <Link href="/" className="hover:text-[#5b46f6] transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <Link href="/products" className="hover:text-[#5b46f6] transition-colors shrink-0">
          Catalog
        </Link>
        {product.category_name && (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <Link
              href={`/products?category=${product.category_id}`}
              className="hover:text-[#5b46f6] transition-colors shrink-0"
            >
              {product.category_name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-6 space-y-3">
          {/* Active Primary View Box */}
          <div className="relative aspect-square w-full max-w-lg mx-auto overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 shadow-xs flex items-center justify-center group">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* Discount Badge */}
            {isDiscounted && (
              <span className="absolute top-3 left-3 z-10 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                -{discountPercentage}% OFF
              </span>
            )}

            {/* Wishlist Floating Button */}
            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`absolute top-3 right-3 z-10 flex h-8.5 w-8.5 items-center justify-center rounded-full border shadow-xs transition-all active:scale-95 ${
                isWishlisted
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-white/90 border-slate-100 text-slate-400 hover:text-red-500 hover:bg-white'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1.5 transition-all ${
                    selectedImage === img.image_url
                      ? 'border-[#5b46f6] ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-purple-100 hover:border-purple-300'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || `Product view ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* Header Info */}
          <div>
            {product.category_name && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100/80 px-2.5 py-0.5 text-[11px] font-bold text-[#5b46f6] mb-2">
                <Sparkles className="h-3 w-3 text-[#5b46f6]" />
                {product.category_name}
              </span>
            )}

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-display tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* SKU & Ratings */}
            <div className="mt-2 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 font-bold text-slate-900 text-xs">5.0</span>
                <span className="text-slate-400 font-normal text-xs">(24 reviews)</span>
              </div>

              {product.sku && (
                <span className="text-slate-400 font-mono border-l border-slate-200 pl-3 text-[11px]">
                  SKU: <strong className="text-slate-700 font-semibold">{product.sku}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="rounded-xl border border-purple-100/80 bg-white p-4 shadow-xs flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-extrabold text-slate-900">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {isDiscounted && (
                  <span className="text-xs text-slate-400 line-through font-medium">
                    ₹{Number(product.compare_at_price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <Check className="h-3 w-3" /> Inclusive of all taxes & instant delivery calculation
              </p>
            </div>

            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              In Stock
            </span>
          </div>

          {/* Short Description */}
          {product.short_description && (
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line break-words space-y-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5 [&_p]:mb-1.5 [&_strong]:font-semibold">
              <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                Quantity:
              </label>
              <div className="flex items-center rounded-lg border border-purple-200 bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-purple-50 transition-colors rounded-l-lg"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-slate-900 font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-purple-50 transition-colors rounded-r-lg"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold transition-all duration-300 shadow-xs ${
                  addedToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#5b46f6] text-white hover:bg-[#4338ca] hover:shadow-indigo-500/20 active:scale-95'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Buy Now Button */}
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition-all"
              >
                <span>Buy Now</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Trust Guarantees Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-purple-100/80">
            <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 border border-purple-100/60 shadow-xs">
              <Truck className="h-4 w-4 text-[#5b46f6] shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-900">Express Delivery</h4>
                <p className="text-[9px] text-slate-500">Fast 2-4 business days</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 border border-purple-100/60 shadow-xs">
              <RotateCcw className="h-4 w-4 text-[#5b46f6] shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-900">30-Day Guarantee</h4>
                <p className="text-[9px] text-slate-500">Hassle-free returns</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 border border-purple-100/60 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-[#5b46f6] shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-900">100% Authentic</h4>
                <p className="text-[9px] text-slate-500">Certified craftsmanship</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 border border-purple-100/60 shadow-xs">
              <Award className="h-4 w-4 text-[#5b46f6] shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-900">2-Year Warranty</h4>
                <p className="text-[9px] text-slate-500">Full manufacturer coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specs, Care, Shipping, FAQ */}
      <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-sm">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-purple-100 pb-4 overflow-x-auto">
          {[
            { id: 'description', label: 'Full Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'care', label: 'Care & Maintenance' },
            { id: 'shipping', label: 'Shipping & Returns' },
            { id: 'faq', label: 'FAQs' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#5b46f6] text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-[#5b46f6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line break-words space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_p]:mb-3 [&_strong]:font-extrabold [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p className="text-slate-500 italic font-normal">
                  No detailed description available for this product yet.
                </p>
              )}
            </div>
          )}

          {activeTab === 'specs' && (() => {
            const specList = parseSpecifications(product.specifications);
            return (
              <div className="space-y-4">
                {specList.length > 0 ? (
                  <div className="overflow-x-auto rounded-2xl border border-purple-100/80 shadow-2xs bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-purple-100 bg-purple-50/70 text-xs font-bold text-[#5b46f6] uppercase tracking-wider">
                          <th className="py-3.5 px-6 w-1/3">Specification</th>
                          <th className="py-3.5 px-6">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100/50 text-xs">
                        {specList.map((spec, idx) => (
                          <tr
                            key={idx}
                            className="even:bg-purple-50/20 hover:bg-purple-50/40 transition-colors"
                          >
                            <td className="py-3.5 px-6 font-extrabold text-slate-900 bg-slate-50/40 w-1/3 border-r border-purple-100/40">
                              {spec.key}
                            </td>
                            <td className="py-3.5 px-6 text-slate-700 font-medium leading-relaxed">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Standard specifications apply for this item.
                  </p>
                )}
              </div>
            );
          })()}

          {activeTab === 'care' && (
            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line break-words space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_p]:mb-3 [&_strong]:font-extrabold [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold">
              {product.care_instructions ? (
                <div dangerouslySetInnerHTML={{ __html: product.care_instructions }} />
              ) : (
                <p className="text-xs text-slate-500 italic font-normal">
                  Clean with a soft, damp cloth. Avoid harsh abrasive cleaners or prolonged direct moisture exposure.
                </p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line break-words space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_p]:mb-3 [&_strong]:font-extrabold [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold">
              {product.shipping_info ? (
                <div dangerouslySetInnerHTML={{ __html: product.shipping_info }} />
              ) : (
                <div className="space-y-3 text-xs text-slate-600 font-normal">
                  <p>🚚 <strong>Standard Delivery:</strong> Dispatched within 24-48 hours. Delivered in 3-5 business days.</p>
                  <p>📦 <strong>Packaging:</strong> Insured, reinforced eco-friendly packaging for maximum safety.</p>
                  <p>🔄 <strong>30-Day Returns:</strong> If you are not completely satisfied, return within 30 days for a full refund.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              {Array.isArray(product.faq) && product.faq.length > 0 ? (
                product.faq.map((item: any, idx: number) => (
                  <div key={idx} className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-[#5b46f6] shrink-0" />
                      <span>{item.question}</span>
                    </h4>
                    <p className="mt-2 text-xs text-slate-600 pl-6 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Have questions about this item? Contact our 24/7 support team anytime!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <div className="pt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              You Might Also Like
            </h2>
            <Link
              href="/products"
              className="text-xs font-bold text-[#5b46f6] hover:underline"
            >
              Explore Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
