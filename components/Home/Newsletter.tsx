'use client';

import { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          {/* Ambient Glowing Orbs Background */}
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Discount Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300 border border-white/20 mb-6 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              <span>Exclusive Member Discount</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display">
              Join the Insider Club & Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">15% OFF</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300/90 max-w-xl mx-auto leading-relaxed">
              Subscribe to receive secret flash sale alerts, new collection drops, and home styling inspiration directly to your inbox.
            </p>

            {/* Newsletter Form */}
            {submitted ? (
              <div className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 px-6 py-4 text-sm font-bold text-emerald-300 backdrop-blur-md">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>Thank you for subscribing! Your 15% OFF promo code has been sent to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/20 bg-white/10 pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-400 outline-none backdrop-blur-md transition-all focus:border-purple-400 focus:bg-white/15"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5b46f6] to-[#4338ca] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/30 hover:scale-105 hover:shadow-indigo-600/50 active:scale-95 transition-all"
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            <p className="mt-4 text-[11px] text-slate-400 font-medium">
              🔒 We respect your privacy. No spam ever — unsubscribe at any time with 1-click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
