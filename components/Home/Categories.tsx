'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import CategoryCard from '../user/CategoryCard';

type Category = {
  id: number;
  name: string;
  slug?: string;
  image?: string | null;
  image_url?: string | null;
  primary_image?: string | null;
};

import ScrollReveal from '../ui/ScrollReveal';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get('/api/categories');
        const list = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.categories)
          ? response.data.categories
          : Array.isArray(response.data)
          ? response.data
          : [];
        setCategories(list);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ScrollReveal direction="up">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl font-display text-slate-900">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Find the perfect products for your home.
            </p>
          </div>

          <Link
            href="/categories"
            className="hidden text-sm font-semibold text-[#5b46f6] hover:underline sm:block"
          >
            View All →
          </Link>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="aspect-[4/5] animate-pulse rounded-3xl bg-purple-100/60" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.slice(0, 4).map((category, idx) => (
            <ScrollReveal key={category.id} delay={idx * 120} direction="up">
              <CategoryCard category={category} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}


