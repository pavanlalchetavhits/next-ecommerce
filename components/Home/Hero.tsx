
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-transparent py-12 lg:py-16">
      {/* Background Decorative Ambient Circle */}
      <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-3xl animate-pulse-glow" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          
          {/* Left Column Content */}
          <div className="lg:col-span-6 xl:col-span-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#5b46f6]">
              WELCOME TO NEXCART
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Make Your Home <br />
              <span>Feel Special</span>
            </h1>

            <p className="mt-5 text-base text-slate-600 sm:text-lg leading-relaxed max-w-xl">
              Discover beautifully crafted products designed to make your home
              more comfortable and stylish
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-[#4a36e3] hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-xl border border-[#5b46f6]/30 bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#5b46f6] backdrop-blur-sm transition-all hover:bg-white hover:border-[#5b46f6]/60 active:scale-95"
              >
                Explore Categories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 grid grid-cols-1 gap-4 pt-6 border-t border-purple-200/60 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b46f6]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Premium Quality</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">Carefully selected for your home</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b46f6]">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Fast Delivery</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">Free shipping on orders over ₹150</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b46f6]">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Easy Returns</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">30-day hassle-free returns</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column Image */}
          <div className="relative lg:col-span-6 xl:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Soft circle backdrop behind image */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-purple-200/40 blur-2xl -z-10 animate-pulse-glow" />
              <div className="overflow-hidden rounded-3xl bg-purple-100/30 shadow-2xl shadow-indigo-900/10 border border-white/60 animate-float">
                <img
                  src="/hero-img.png"
                  alt="NexCart Furniture Hero"
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

