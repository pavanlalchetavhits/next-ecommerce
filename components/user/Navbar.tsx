'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Tag,
  PhoneCall,
  HelpCircle,
  Truck,
  Heart,
  Compass,
} from 'lucide-react';
import { useCart, useWishlist, useAuth, useClickOutside, useFetch } from '@/app/hooks';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

  // Dynamic Cart and Wishlist count from custom hooks
  const { uniqueCount: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  // Fetch active coupons using custom useFetch hook
  const { data: couponsData } = useFetch<any[]>('/api/coupons?status=active');
  const activeCoupons = Array.isArray(couponsData) ? couponsData : [];
  const [couponIndex, setCouponIndex] = useState(0);

  useEffect(() => {
    if (activeCoupons.length <= 1) return;
    const timer = setInterval(() => {
      setCouponIndex((prev) => (prev + 1) % activeCoupons.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeCoupons]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', icon: Compass },
    { label: 'Shop All', href: '/products', icon: ShoppingBag },
    { label: 'Categories', href: '/categories', icon: Tag },
    { label: 'Deals', href: '/deals', icon: Sparkles },
    { label: 'About', href: '/about', icon: HelpCircle },
    { label: 'Contact', href: '/contact', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden transition-all duration-200">
      
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-[10px] sm:text-[11px] font-semibold py-1.5 px-2.5 sm:px-4 border-b border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-indigo-600 text-white shrink-0">
              <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </span>
            <span className="truncate">
              Free Express Shipping on orders over <strong className="text-indigo-400 font-bold">₹150</strong>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            {activeCoupons.length > 0 ? (
              <span className="hidden md:flex items-center gap-1 text-emerald-400 transition-all duration-300">
                <Tag className="w-3 h-3 text-emerald-400" /> Use code{' '}
                <strong className="font-extrabold uppercase text-amber-300">
                  {activeCoupons[couponIndex]?.code}
                </strong>{' '}
                for{' '}
                <span className="font-bold">
                  {activeCoupons[couponIndex]?.discount_type === 'percentage'
                    ? `${Number(activeCoupons[couponIndex]?.discount_value)}% OFF`
                    : `₹${Number(activeCoupons[couponIndex]?.discount_value)} OFF`}
                </span>
              </span>
            ) : (
              <span className="hidden md:flex items-center gap-1 text-emerald-400">
                <Tag className="w-3 h-3 text-emerald-400" /> Use code{' '}
                <strong className="font-extrabold uppercase text-amber-300">WELCOME10</strong> for 10% OFF
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-5 text-slate-300">
            <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-indigo-400" />
              <span>Support</span>
            </Link>
            <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-indigo-400" />
              <span>FAQ</span>
            </Link>
            <div className="flex items-center gap-1 text-slate-400 border-l border-slate-700 pl-4">
              <span>INR (₹)</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div
        className={`bg-[#f8f5ff]/80 backdrop-blur-md border-b border-purple-200/50 transition-all duration-200 ${
          scrolled ? 'shadow-md py-2.5' : 'py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-3 shrink-0 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none font-display">
                Nex<span className="text-indigo-600 dark:text-indigo-400">Cart</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                Next-Gen Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const IconComp = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="flex relative items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 border border-purple-100/80 shadow-2xs hover:bg-[#5b46f6] hover:text-white hover:border-[#5b46f6] hover:scale-110 active:scale-95 transition-all duration-300 group"
              title="Wishlist"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] font-extrabold ring-2 ring-white animate-in zoom-in-50 duration-200">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="flex relative items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 border border-purple-100/80 shadow-2xs hover:bg-[#5b46f6] hover:text-white hover:border-[#5b46f6] hover:scale-110 active:scale-95 transition-all duration-300 group"
              title="View Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] font-extrabold ring-2 ring-white animate-in zoom-in-50 duration-200">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / Profile Link */}
            <Link
              href={user ? '/profile' : '/login?callbackUrl=/profile'}
              className="flex relative items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 border border-purple-100/80 shadow-2xs hover:bg-[#5b46f6] hover:text-white hover:border-[#5b46f6] hover:scale-110 active:scale-95 transition-all duration-300 group"
              title={user ? `Logged in as ${user.name || 'User'}` : 'Account Login'}
            >
              {user ? (
                <span className="flex h-5.5 w-5.5 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#5b46f6] to-purple-500 text-[10px] sm:text-xs font-extrabold text-white shadow-2xs">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top duration-300">
          <div className="p-4 space-y-4">
            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const IconComp = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      pathname === link.href
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

          </div>
        </div>
      )}

    </header>
  );
}