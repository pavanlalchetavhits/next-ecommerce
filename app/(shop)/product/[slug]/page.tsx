import Link from 'next/link';
import { PackageX, ArrowLeft } from 'lucide-react';
import { getProductByIdOrSlug, getProducts } from '@/services/product.service';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-[#5b46f6] mx-auto mb-4">
          <PackageX className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">Product Not Found</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          The product you are looking for might have been moved, renamed, or is currently unavailable.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products Catalog</span>
        </Link>
      </div>
    );
  }

  // Fetch related products in the same category
  const allProducts = await getProducts({ category_id: product.category_id });
  const relatedProducts = Array.isArray(allProducts)
    ? (allProducts as any[]).filter((p) => p.id !== product.id)
    : [];

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

