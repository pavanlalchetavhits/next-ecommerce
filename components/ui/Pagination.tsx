'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = 'items',
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with smart ellipsis handling if totalPages is large
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-purple-100/80 bg-white/50 backdrop-blur-xs p-4 rounded-2xl border shadow-2xs ${className}`}
    >
      {/* Item Counter Info */}
      <span className="text-xs text-slate-500 font-medium">
        Showing{' '}
        <strong className="text-slate-900 font-bold">
          {startItem}–{endItem}
        </strong>{' '}
        of <strong className="text-slate-900 font-bold">{totalItems}</strong> {itemLabel}
      </span>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-purple-100 bg-white text-slate-700 hover:bg-purple-50 hover:text-[#5b46f6] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 transition-all shadow-2xs cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="h-9 w-9 flex items-center justify-center text-xs font-bold text-slate-400 select-none"
              >
                •••
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
              className={`h-9 w-9 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#5b46f6] text-white shadow-xs ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-700 border border-purple-100 hover:bg-purple-50 hover:text-[#5b46f6]'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-purple-100 bg-white text-slate-700 hover:bg-purple-50 hover:text-[#5b46f6] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 transition-all shadow-2xs cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
