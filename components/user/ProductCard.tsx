'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Sparkles, ShoppingBag } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  slug?: string;
  price: number;
  compare_at_price?: number | null;
  short_description?: string | null;
  description?: string | null;
  mainImage?: string | null;
  primary_image?: string | null;
  image_url?: string | null;
  category_name?: string | null;
};

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const [imgErr, setImgErr] = useState(false);
  const rawImageSrc = product.primary_image || product.mainImage || product.image_url;
  const imageSrc = imgErr || !rawImageSrc ? '/hero-img.png' : rawImageSrc;

  // Strip HTML tags if description/short_description contains HTML string from rich editor
  const rawDesc = product.short_description || product.description || '';
  const cleanDesc = rawDesc.replace(/<[^>]*>/g, '').trim();

  const isDiscounted =
    product.compare_at_price && Number(product.compare_at_price) > Number(product.price);

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-purple-100/70 bg-white shadow-xs hover:shadow-xl hover:border-purple-300/80 transition-all duration-500 hover:-translate-y-1.5"
    >
      {/* Top Image Container - Pure White Unified with Card */}
      <div className="relative aspect-square w-full overflow-hidden bg-white p-5 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImgErr(true)}
          className="h-full w-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Category Pill Tag */}
        {product.category_name && (
          <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-purple-50/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#5b46f6] border border-purple-100 shadow-2xs">
            <Sparkles className="h-3 w-3 text-[#5b46f6]" />
            {product.category_name}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-3.5 right-3.5 z-10 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 hover:scale-110 active:scale-95 cursor-pointer"
          title="Add to Wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>


      </div>

      {/* Card Details Section - Pure White Unified */}
      <div className="p-5 pt-1 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#5b46f6] transition-colors line-clamp-1 font-display">
            {product.name}
          </h3>

          {cleanDesc && (
            <p className="mt-1 text-xs text-slate-500 font-normal leading-relaxed line-clamp-2">
              {cleanDesc}
            </p>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {isDiscounted && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ₹{Number(product.compare_at_price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-50 text-[#5b46f6] group-hover:bg-[#5b46f6] group-hover:text-white transition-all duration-300 shadow-2xs">
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}


