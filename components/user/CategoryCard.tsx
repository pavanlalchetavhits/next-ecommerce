import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

type Category = {
  id: number;
  name: string;
  slug?: string;
  image?: string | null;
  image_url?: string | null;
  primary_image?: string | null;
  description?: string | null;
};

export default function CategoryCard({
  category,
}: {
  category: Category;
}) {
  const imgSrc = category.image || category.image_url || category.primary_image;

  return (
    <Link
      href={`/products?category=${category.id}`}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-3xl border border-purple-100/60 bg-slate-900 shadow-md shadow-purple-900/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-purple-300/80 hover:shadow-2xl hover:shadow-purple-600/20"
    >
      {/* Background Image or Rich Gradient Fallback */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5] via-[#5b46f6] to-[#7c3aed] flex items-center justify-center p-6 text-white/25 group-hover:scale-105 transition-transform duration-700">
          <Layers className="h-20 w-20 stroke-1" />
        </div>
      )}

      {/* Dark Overlay Gradient for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent transition-opacity duration-300 group-hover:from-slate-950/95" />



      {/* Bottom Content Area */}
      <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end text-white">
        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight font-display text-white group-hover:text-purple-200 transition-colors drop-shadow-md">
          {category.name}
        </h3>

        {category.description && (
          <p className="mt-1 text-xs text-slate-300/90 line-clamp-1 font-normal leading-relaxed">
            {category.description}
          </p>
        )}

        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 group-hover:text-white transition-colors">
          <span>Explore Catalog</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}