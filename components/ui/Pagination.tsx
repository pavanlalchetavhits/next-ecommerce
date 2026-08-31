'use client';

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  itemLabel?: string;
  className?: string;
  showCounter?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  itemLabel = 'items',
  className = '',
  showCounter = true,
}: PaginationProps) {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with smart ellipsis handling matching reference design (< 1 2 3 4 5 ... 30 >)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        // Near start: 1 2 3 4 5 ... 30
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near end: 1 ... 26 27 28 29 30
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle: 1 ... 14 15 16 ... 30
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
      {/* Item Counter Info */}
      {showCounter && (
        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900 font-bold">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-slate-900 font-bold">{totalItems}</strong> {itemLabel}
        </span>
      )}

      {/* Floating Pill Bar Container matching user image design */}
      <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full bg-white px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-200/80 shadow-md shadow-slate-200/40">
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-1 text-xs font-semibold text-slate-400 select-none"
              >
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = currentPage === pageNum;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageClick(pageNum)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center justify-center ${
                isActive
                  ? 'border-2 border-[#5b46f6]/60 bg-purple-50 text-[#5b46f6] shadow-2xs scale-105'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Items Per Page Selector Pill */}
        {onItemsPerPageChange ? (
          <div className="relative inline-flex items-center ml-2 border border-slate-200 bg-slate-50/80 rounded-full px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer">
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="appearance-none bg-transparent pr-4 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
            <ChevronDown className="h-3 w-3 text-slate-500 absolute right-2.5 pointer-events-none" />
          </div>
        ) : (
          <div className="relative inline-flex items-center ml-2 border border-slate-200 bg-slate-50/80 rounded-full px-3 py-1 text-xs font-semibold text-slate-700">
            <span>{itemsPerPage} / page</span>
          </div>
        )}
      </div>
    </div>
  );
}
