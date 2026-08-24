'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Sparkles, Clock, ShieldCheck, Zap } from 'lucide-react';

import ScrollReveal from '../ui/ScrollReveal';

export default function FlashSale() {
  // Simulated countdown timer (14 hours, 36 minutes, 45 seconds remaining)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-8 sm:p-12 lg:p-14 text-white shadow-2xl border border-purple-800/40">
            {/* Glowing Background Accent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Flash Deal Text & Countdown Timer */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-xs">
                  <Flame className="h-4 w-4 text-amber-400 animate-bounce" />
                  <span>Limited Time Offer</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-tight">
                  Weekend Flash Sale! <br className="hidden sm:inline" />
                  Save Up to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-300">40% OFF</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed mx-auto lg:mx-0">
                  Premium handcrafted furniture & home accents at limited-time promotional pricing. Grab yours before stock runs out!
                </p>

                {/* Countdown Timer Widget */}
                <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
                  <div className="flex flex-col items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
                    <span className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Hours</span>
                  </div>
                  <span className="text-2xl font-extrabold text-amber-400">:</span>

                  <div className="flex flex-col items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
                    <span className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Mins</span>
                  </div>
                  <span className="text-2xl font-extrabold text-amber-400">:</span>

                  <div className="flex flex-col items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
                    <span className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Secs</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/products?featured=true"
                    className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-sm font-extrabold text-slate-900 shadow-xl shadow-amber-500/25 hover:scale-105 hover:bg-amber-300 active:scale-95 transition-all"
                  >
                    <Zap className="h-4 w-4 fill-slate-900" />
                    <span>Claim Deal Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Verified Original Quality</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Featured Deal Product Preview Badge */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="group relative w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl text-center animate-float-slow">
                  <span className="absolute top-4 right-4 z-10 rounded-full bg-red-500 px-3 py-1 text-[11px] font-extrabold uppercase text-white shadow-md">
                    40% OFF
                  </span>

                  <div className="aspect-square w-full rounded-2xl bg-white/80 p-6 flex items-center justify-center overflow-hidden mb-5">
                    <img
                      src="/hero-img.png"
                      alt="Featured Flash Deal"
                      className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-white font-display line-clamp-1">
                    Handcrafted Porch Swing Seat
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1 font-normal">
                    Solid oak wood with weather-resistant cushions
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <span className="text-2xl font-extrabold text-amber-300">₹4,999</span>
                    <span className="text-sm font-medium text-slate-400 line-through">₹8,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

