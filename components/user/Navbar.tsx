'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
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

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart items count simulation (can be bound to zustand cart store)
  const cartCount = 2;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/products?featured=true' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
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
            <Link href="/contact-us" className="hover:text-white transition-colors flex items-center gap-1">
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
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search Box & Quick Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Input (Desktop) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="hidden md:flex items-center relative w-48 lg:w-64"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </form>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="flex relative items-center justify-center w-10 h-10 rounded-full bg-white text-slate-700 border border-purple-100/80 shadow-2xs hover:bg-[#5b46f6] hover:text-white hover:border-[#5b46f6] hover:scale-110 active:scale-95 transition-all duration-300 group"
              title="Wishlist"
            >
              <Heart className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
            </Link>

            {/* Shopping Cart Button */}
            <Link
              href="/payment"
              className="flex relative items-center justify-center w-10 h-10 rounded-full bg-[#5b46f6] text-white shadow-md shadow-indigo-500/20 hover:bg-[#4338ca] hover:scale-110 active:scale-95 transition-all duration-300 group"
              title="View Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-extrabold ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/login"
              className="flex relative items-center justify-center w-10 h-10 rounded-full bg-white text-slate-700 border border-purple-100/80 shadow-2xs hover:bg-[#5b46f6] hover:text-white hover:border-[#5b46f6] hover:scale-110 active:scale-95 transition-all duration-300 group"
              title="Account Login"
            >
              <User className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
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
            
            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setMobileMenuOpen(false);
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="relative"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    pathname === link.href
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

          </div>
        </div>
      )}

    </header>
  );
}