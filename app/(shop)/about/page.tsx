"use client";

import Link from "next/link";
import {
  Award,
  Heart,
  ShieldCheck,
  Truck,
  Users,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Star,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Header Section */}
        <ScrollReveal direction="down">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-14 text-white shadow-xl shadow-indigo-950/20 border border-indigo-900/50 text-center">
            {/* Ambient Glow Orbs */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#5b46f6]/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-indigo-300 border border-white/10">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>About NexCart</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
                Creating Products That Make Your Home & Life Special
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
                We believe that thoughtfully designed, premium products elevate everyday living.
                Welcome to Next-Gen Shopping tailored for you.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Our Story Section */}
        <section className="grid items-center gap-12 lg:grid-cols-2">
          {/* Decorative Media Frame */}
          <ScrollReveal direction="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-purple-100/80 bg-white p-3 shadow-sm group">
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <img
                  src="/about-story.png"
                  alt="NexCart Studio - Our Story"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Floating Header Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 px-3.5 border border-purple-100 shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5b46f6] text-white shadow-2xs">
                    <ShoppingBag className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 font-display">NexCart Studio</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Established 2024</p>
                  </div>
                </div>

                {/* Floating Bottom Stats Badges */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start gap-2 z-10">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs border border-purple-100/80">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Craftsmanship & Authenticity Assured</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs border border-purple-100/80">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span>50,000+ Delighted Customers</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3.5 py-1 text-xs font-bold text-[#5b46f6]">
                <Sparkles className="h-3.5 w-3.5 text-[#5b46f6]" />
                <span>Our Story</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                Built With Passion, <br className="hidden sm:block" />
                Designed For Modern Living
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Our journey started with a clear mission: to bring premium quality, meticulously crafted products to everyday shoppers without unnecessary markup or friction.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                From selecting top-tier manufacturers to hand-checking every package before dispatch, we prioritize quality, transparency, and delight at every step.
              </p>

              <div className="pt-2 flex items-center gap-6">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 font-display">100%</span>
                  <p className="text-xs text-slate-500 font-medium">Genuine Products</p>
                </div>
                <div className="h-8 w-px bg-purple-100" />
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 font-display">24/7</span>
                  <p className="text-xs text-slate-500 font-medium">Dedicated Support</p>
                </div>
                <div className="h-8 w-px bg-purple-100" />
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 font-display">30-Day</span>
                  <p className="text-xs text-slate-500 font-medium">Hassle-Free Returns</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Mission Statement Section */}
        <ScrollReveal direction="up">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white border border-indigo-900/40 shadow-lg text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-indigo-300 border border-white/10">
                Our Mission
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-snug">
                Quality Products. Unmatched Experiences.
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
                Our mission is to simplify how customers discover and purchase high-grade lifestyle items. We combine intuitive design, verified vendor partnerships, and fast delivery to redefine online shopping.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Why Choose Us Features Grid */}
        <section className="space-y-8">
          <ScrollReveal direction="up">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3.5 py-1 text-xs font-bold text-[#5b46f6]">
                Why Choose Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                What Sets NexCart Apart
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Award className="h-6 w-6" />,
                title: "Quality First",
                description: "We enforce rigorous quality inspections across all vendors to deliver products that last.",
              },
              {
                icon: <Heart className="h-6 w-6" />,
                title: "Customer Obsessed",
                description: "Every interface detail, checkout step, and support response is crafted around your satisfaction.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "100% Secure Shopping",
                description: "End-to-end encrypted transactions, verified payment gateways, and transparent privacy protection.",
              },
              {
                icon: <Truck className="h-6 w-6" />,
                title: "Express Logistics",
                description: "Fast 2-4 business day delivery with real-time tracking updates directly to your phone.",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Growing Community",
                description: "Over 50,000 satisfied shoppers rely on NexCart for their daily lifestyle essentials.",
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: "Handpicked Collections",
                description: "Curated catalog selections ensuring usefulness, high aesthetics, and functional durability.",
              },
            ].map((feat, idx) => (
              <ScrollReveal key={idx} delay={idx * 100} direction="up">
                <FeatureCard
                  icon={feat.icon}
                  title={feat.title}
                  description={feat.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Promise Section */}
        <ScrollReveal direction="up">
          <section className="rounded-3xl border border-purple-100 bg-white p-8 sm:p-12 shadow-xs">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3.5 py-1 text-xs font-bold text-[#5b46f6]">
                  Our Promise
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  More Than Just An Online Store
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We believe that shopping online should feel personal, transparent, and rewarding. From browsing curated items to opening your delivery package, we aim for perfection.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  If you ever have feedback, questions, or ideas, our team is always ready to listen and help.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/60 to-purple-100 p-8 border border-purple-100/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b46f6] text-white shadow-2xs">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">NexCart Guarantee</h4>
                    <p className="text-xs text-slate-500">Risk-free shopping experience</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "We stand behind every item we sell. If you aren't completely thrilled with your purchase, our 30-day return policy has you covered."
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Call To Action Banner */}
        <ScrollReveal direction="up">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5b46f6] via-indigo-600 to-[#7c3aed] p-8 sm:p-12 text-center text-white shadow-lg shadow-indigo-500/20">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                Ready to Explore Our Catalog?
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 font-normal">
                Discover top-rated products with express delivery and exclusive deals today.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-xs sm:text-sm font-extrabold text-[#5b46f6] shadow-md hover:bg-slate-50 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Shop All Products</span>
                  <ArrowRight className="h-4 w-4 text-[#5b46f6]" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-purple-100/70 bg-white p-6 shadow-2xs hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-300">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#5b46f6] group-hover:bg-[#5b46f6] group-hover:text-white transition-colors duration-300">
        {icon}
      </div>

      <h3 className="mt-5 text-base font-extrabold text-slate-900 font-display">{title}</h3>

      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{description}</p>
    </div>
  );
}
