'use client';

import { Star, Quote, CheckCircle2, ThumbsUp } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const testimonials = [
  {
    id: 1,
    name: 'Sophia Reynolds',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment:
      'The quality of the wooden swing exceeded all my expectations! Assembly was super straightforward, and it has become the favorite spot in our garden.',
    productBought: 'Handcrafted Oak Porch Swing',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'Interior Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment:
      'I source items for client home projects regularly, and NexCart delivers exceptional craftsmanship every single time. Customer service is top-notch.',
    productBought: 'Nordic Minimalist Lounge Chair',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment:
      'Fast shipping and packaging was extremely secure. The finish on the table looks identical to high-end boutique stores at a fraction of the cost.',
    productBought: 'Solid Walnut Coffee Table',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3.5 py-1 text-xs font-bold text-[#5b46f6] mb-3">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Loved by 10,000+ Customers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
              What Our Customers Say
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Real stories and unedited reviews from homeowners who upgraded their living spaces with NexCart.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((review, idx) => (
            <ScrollReveal key={review.id} delay={idx * 150} direction="up">
              <div className="group relative flex flex-col justify-between rounded-3xl border border-purple-100/80 bg-white/80 backdrop-blur-md p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-purple-300/80 transition-all duration-500 hover:-translate-y-1.5 h-full">
                {/* Quote Mark Decoration */}
                <Quote className="absolute top-6 right-6 h-8 w-8 text-purple-200/60 transition-transform group-hover:scale-110" />

                <div>
                  {/* 5-Star Rating */}
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-slate-700 leading-relaxed font-normal italic">
                    &quot;{review.comment}&quot;
                  </p>
                </div>

                {/* Reviewer Meta */}
                <div className="mt-6 border-t border-purple-100/60 pt-4 flex items-center gap-3.5">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-11 w-11 rounded-full object-cover border-2 border-purple-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900">{review.name}</h3>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Purchased: <span className="text-[#5b46f6] font-semibold">{review.productBought}</span>
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

