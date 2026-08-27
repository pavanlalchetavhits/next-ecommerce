'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Search,
  Printer,
  Copy,
  Check,
  Clock,
  Calendar,
  ChevronRight,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Scale,
  Lock,
  RotateCcw,
  Ban,
  Cookie,
  X,
} from 'lucide-react';

export type PolicyHighlight = {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
};

export type PolicySection = {
  id?: string;
  title: string;
  content: React.ReactNode;
  summaryNote?: string;
  category?: string;
};

export type PolicyType = 'terms' | 'privacy' | 'returns' | 'cancellation' | 'cookie';

type PolicyPageProps = {
  activePolicy: PolicyType;
  title: string;
  description: string;
  lastUpdated?: string;
  version?: string;
  readTime?: string;
  highlights?: PolicyHighlight[];
  sections: PolicySection[];
};

export default function PolicyPage({
  activePolicy,
  title,
  description,
  lastUpdated = '27 August 2026',
  version = 'v2.4',
  readTime = '7 min read',
  highlights = [],
  sections,
}: PolicyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Format ID helper
  const getSectionId = (title: string, index: number, customId?: string) => {
    if (customId) return customId;
    return `section-${index + 1}-${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}`;
  };

  const formattedSections = sections.map((sec, idx) => ({
    ...sec,
    computedId: getSectionId(sec.title, idx, sec.id),
  }));

  // Filter sections by search query
  const filteredSections = formattedSections.filter((section) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = section.title.toLowerCase().includes(query);
    const summaryMatch = section.summaryNote?.toLowerCase().includes(query) || false;
    return titleMatch || summaryMatch;
  });

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const section of formattedSections) {
        const element = document.getElementById(section.computedId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSectionId(section.computedId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [formattedSections]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -110;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSectionId(id);
    }
  };

  const policyTabs = [
    { id: 'terms', label: 'Terms & Conditions', href: '/terms', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'privacy', label: 'Privacy Policy', href: '/privacy-policy', icon: <Lock className="w-3.5 h-3.5" /> },
    { id: 'returns', label: 'Return & Refund', href: '/return-policy', icon: <RotateCcw className="w-3.5 h-3.5" /> },
    { id: 'cancellation', label: 'Cancellation', href: '/cancellation-policy', icon: <Ban className="w-3.5 h-3.5" /> },
    { id: 'cookie', label: 'Cookie Policy', href: '/cookie-policy', icon: <Cookie className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Breadcrumb & Policy Selector Header */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full w-fit shrink-0">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>NexCart Legal Center</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-700 capitalize">
                {policyTabs.find((t) => t.id === activePolicy)?.label || activePolicy}
              </span>
            </div>

            {/* Responsive Policy Tab Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-200/70 dark:bg-slate-800/60 rounded-2xl border border-slate-300/60 shadow-inner no-scrollbar">
              {policyTabs.map((tab) => {
                const isActive = activePolicy === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-md scale-[1.02]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Hero Banner Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-indigo-500/20">
            
            {/* Ambient Background Glow Effects */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Version & Date Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 font-extrabold rounded-full border border-indigo-400/40">
                  {version}
                </span>
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Last Updated: {lastUpdated}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{readTime}</span>
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Official & Binding Policy
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3 max-w-3xl">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
                  {title}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Action Controls Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-800">
                
                {/* Search Bar Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search policy sections, keywords..."
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick Utility Actions */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/70 transition-all flex items-center gap-2 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Policy</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Highlights At A Glance Cards */}
        {highlights.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Key Highlights at a Glance</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Layout: Sidebar TOC + Section Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sticky Table of Contents Navigation (4 Cols on desktop) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-lg backdrop-blur-md space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Table of Contents</span>
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {filteredSections.length} {filteredSections.length === 1 ? 'Section' : 'Sections'}
                </span>
              </div>

              {/* Navigation Section Links */}
              <nav className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto no-scrollbar pr-1">
                {filteredSections.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No matching topics found.</p>
                ) : (
                  filteredSections.map((sec, idx) => {
                    const isActive = activeSectionId === sec.computedId;
                    return (
                      <button
                        key={sec.computedId}
                        onClick={() => scrollToSection(sec.computedId)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-start gap-2.5 group ${
                          isActive
                            ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 translate-x-1'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="line-clamp-2 leading-snug">{sec.title}</span>
                      </button>
                    );
                  })
                )}
              </nav>

              {/* Need Help Box */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <p className="text-slate-500 font-medium">Need immediate clarification?</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  <span>Contact Compliance Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

          {/* Right Column: Detailed Policy Content Cards (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {filteredSections.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3">
                <Search className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  No matching policy sections found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching for terms like &quot;refund&quot;, &quot;cancel&quot;, &quot;cookies&quot;, or &quot;delivery&quot;.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredSections.map((section, index) => (
                <article
                  key={section.computedId}
                  id={section.computedId}
                  className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-md transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700/60 scroll-mt-28 space-y-4"
                >
                  {/* Section Title Header */}
                  <div className="flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-xs rounded-xl shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                      {section.title}
                    </h2>
                  </div>

                  {/* Summary Note Callout if provided */}
                  {section.summaryNote && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold">Summary: </span>
                        {section.summaryNote}
                      </div>
                    </div>
                  )}

                  {/* Section Body Content */}
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal prose prose-indigo max-w-none">
                    {section.content}
                  </div>
                </article>
              ))
            )}

            {/* Bottom Support Banner */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-8 shadow-xl border border-indigo-400/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Have Questions?
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  Still have queries about our store policies or procedures?
                </h3>
                <p className="text-xs text-indigo-100 max-w-md">
                  Our customer support team is available 24/7 to clarify any questions regarding returns, refunds, or cancellations.
                </p>
              </div>

              <Link
                href="/contact"
                className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 group shrink-0"
              >
                <span>Contact Support</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}