'use client';

import { useState, useEffect } from 'react';
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
import { useCartStore } from '@/app/store/cartstore';
import { useWishlistStore } from '@/app/store/wishliststore';

import { useSession } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dynamic Cart unique items count from Zustand store
  const items = useCartStore((state) => state.items);
  const [cartCount, setCartCount] = useState(0);

  // Dynamic Wishlist count from Zustand store
  const wishlistCount = useWishlistStore((state) => state.count);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    setCartCount((items || []).length);
  }, [items]);

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
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-[11px] font-semibold py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white">
              <Truck className="w-3 h-3" />
            </span>
            <span>
              Free Express Shipping on orders over <strong className="text-indigo-400 font-bold">$150</strong>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-400">
              <Tag className="w-3 h-3" /> Use code <strong>SAVE10</strong> for 10% OFF
            </span>
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
              <span>USD ($)</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div
        className={`bg-[#f8f5ff]/80 backdrop-blur-md border-b border-purple-200/50 transition-all duration-200 ${
          scrolled ? 'shadow-md py-3' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none font-display">
                Nex<span className="text-indigo-600 dark:text-indigo-400">Cart</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
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
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="flex relative items-center justify-center w-10 h-10 rounded-full bg-white text-slate-700 border border-purple-100/80 shadow-2xs hover:bg-[#5b46f6] hover:text-white hover:border-[#5b46f6] hover:scale-110 active:scale-95 transition-all duration-300 group"
              title="Wishlist"
            >
              <Heart className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-extrabold ring-2 ring-white animate-in zoom-in-50 duration-200">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="flex relative items-center justify-center w-10 h-10 rounded-full bg-white text-slate-700 border border-purple-100/80 shadow-2xs hover:bg-[#5b46f6] hover:text-white hover:border-[#5b46f6] hover:scale-110 active:scale-95 transition-all duration-300 group"
              title="View Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-extrabold ring-2 ring-white animate-in zoom-in-50 duration-200">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / Profile Link */}
            <Link
              href={user ? '/profile' : '/login?callbackUrl=/profile'}
              className="flex relative items-center justify-center w-10 h-10 rounded-full bg-white text-slate-700 border border-purple-100/80 shadow-2xs hover:bg-[#5b46f6] hover:text-white hover:border-[#5b46f6] hover:scale-110 active:scale-95 transition-all duration-300 group"
              title={user ? `Logged in as ${user.name || 'User'}` : 'Account Login'}
            >
              {user ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#5b46f6] to-purple-500 text-xs font-extrabold text-white shadow-2xs">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top duration-300">
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