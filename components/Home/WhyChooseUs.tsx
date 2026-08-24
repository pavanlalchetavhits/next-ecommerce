import Link from 'next/link';
import { ShieldCheck, Lock, Truck, Headphones, ArrowRight } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Quality Products',
      description: 'Carefully selected products made with premium quality materials.',
    },
    {
      icon: Lock,
      title: 'Secure Payment',
      description: 'Safe and encrypted payment options for seamless checkout.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Reliable and insured delivery directly to your doorstep.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: "Dedicated customer care team ready to help whenever you need.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Title */}
      <ScrollReveal direction="up">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl font-display">
            Why Choose NexCart?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We combine craftsmanship, reliability, and modern convenience to elevate your home.
          </p>
        </div>
      </ScrollReveal>

      {/* Feature Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <ScrollReveal key={idx} delay={idx * 120} direction="up">
              <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-xs border border-purple-100/80 shadow-xs hover:shadow-xl hover:border-purple-300/80 hover:-translate-y-1.5 transition-all duration-300 text-center group">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#5b46f6] group-hover:bg-[#5b46f6] group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* CTA Banner Section */}
      <ScrollReveal direction="up" delay={200}>
        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 px-6 py-14 text-center text-white shadow-2xl sm:px-12 lg:py-16">
          {/* Background glow effects */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl animate-pulse-glow" />
          <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse-glow" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/20">
              Special Collection
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
              Find Something You Love
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-indigo-200/90 max-w-xl mx-auto">
              Explore our curated collection and discover handcrafted products made specially for your home.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-950 shadow-lg hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 text-indigo-600" />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}


