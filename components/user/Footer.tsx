'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Newsletter Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 border border-indigo-700/50 p-8 md:p-12 overflow-hidden shadow-2xl">
          
          {/* Subtle decorative glow circles */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join NexCart VIP Club</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                Subscribe & Get 15% OFF Your Next Order!
              </h2>
              <p className="text-sm text-indigo-100/80 max-w-lg">
                Be the first to receive exclusive drops, flash sales, promo coupons, and insider product updates.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl flex items-center gap-3 text-emerald-200 text-sm font-semibold animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Success! Check your inbox for your 15% promo code.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-indigo-400/30 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group shrink-0"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* 4-Column Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pt-4">
          
          {/* Column 1: Brand & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-display">
                Nex<span className="text-indigo-400">Cart</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Next-generation e-commerce platform delivering high-quality products, instant payment authorization, and real-time order tracking.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>742 Evergreen Terrace, San Francisco, CA 94107</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (800) 555-NEXC (Mon - Fri, 9am - 6pm EST)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@nexcart.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/products" className="hover:text-indigo-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-indigo-400 transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/products?sort=latest" className="hover:text-indigo-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-indigo-400 transition-colors">
                  Featured Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-indigo-400 transition-colors">
                  Payment & Checkout
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">
                  About NexCart
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-indigo-400 transition-colors">
                  My Account & Orders
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-indigo-400 transition-colors">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Legal & Policies
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/terms" className="hover:text-indigo-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-indigo-400 transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-indigo-400 transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-indigo-400 transition-colors">
                  Cookie & Tracking Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NexCart Store Inc. All rights reserved.</p>

          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span>Visa</span> • <span>Mastercard</span> • <span>RuPay</span> • <span>UPI</span> • <span>Cashfree</span>
          </div>
        </div>

      </div>
    </footer>
  );
}