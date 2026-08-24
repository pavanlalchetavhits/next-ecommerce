'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ProductCard from '../user/ProductCard';

type Product = {
  id: number;
  name: string;
  slug?: string;
  price: number;
  mainImage?: string | null;
  primary_image?: string | null;
  image_url?: string | null;
};

import ScrollReveal from '../ui/ScrollReveal';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('/api/products');
        const list = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.products)
          ? response.data.products
          : Array.isArray(response.data)
          ? response.data
          : [];
        setProducts(list);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl font-display text-slate-900">
                Featured Products
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Our most popular handcrafted home products
              </p>
            </div>

            <Link
              href="/products"
              className="hidden text-sm font-semibold text-[#5b46f6] hover:underline sm:block"
            >
              View All →
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-3">
                <div className="aspect-square animate-pulse rounded-2xl bg-purple-100/60" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 4).map((product, idx) => (
              <ScrollReveal key={product.id} delay={idx * 120} direction="up">
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}