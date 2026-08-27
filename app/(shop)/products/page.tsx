"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Search,
  RotateCcw,
  Sparkles,
  PackageX,
  X,
} from "lucide-react";
import ProductCard from "@/components/user/ProductCard";
import Pagination from "@/components/ui/Pagination";

import { TextField, InputAdornment } from "@mui/material";
import MuiSelect from "@/components/ui/MuiSelect";

type Product = {
  id: number;
  name: string;
  slug?: string;
  price: number;
  mainImage?: string | null;
  primary_image?: string | null;
  image_url?: string | null;
  category_name?: string;
};

type Category = {
  id: number;
  name: string;
  slug?: string;
};

type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL search params directly as single source of truth
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "latest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  // Local state for search text input so user can type freely before submitting
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Helper to update URL search params
  const updateUrlFilters = (updates: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.category !== undefined) {
      if (updates.category) params.set("category", updates.category);
      else params.delete("category");
    }

    if (updates.search !== undefined) {
      if (updates.search.trim()) params.set("search", updates.search.trim());
      else params.delete("search");
    }

    if (updates.sort !== undefined) {
      if (updates.sort && updates.sort !== "latest") params.set("sort", updates.sort);
      else params.delete("sort");
    }

    if (updates.page !== undefined) {
      if (updates.page > 1) params.set("page", String(updates.page));
      else params.delete("page");
    } else {
      // Reset page to 1 whenever filters change
      params.delete("page");
    }

    const queryString = params.toString();
    router.replace(queryString ? `/products?${queryString}` : "/products", { scroll: false });
  };

  // Fetch categories list once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("/api/categories");
        const catArray = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.categories)
          ? response.data.categories
          : Array.isArray(response.data)
          ? response.data
          : [];
        setCategories(catArray);
      } catch (err) {
        console.error("Category Fetch Error:", err);
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products whenever URL parameters change
  useEffect(() => {
    async function FetchProducts() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (currentSearch.trim()) {
          params.set("search", currentSearch.trim());
        }
        if (currentCategory) {
          params.set("category", currentCategory);
        }
        if (currentSort && currentSort !== "latest") {
          params.set("sort", currentSort);
        }

        params.set("page", String(currentPage));
        params.set("limit", "12");

        const response = await axios.get(`/api/products?${params.toString()}`);

        const dataArray = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.products)
          ? response.data.products
          : Array.isArray(response.data)
          ? response.data
          : [];

        setProducts(dataArray);

        if (response.data?.pagination) {
          setPagination(response.data.pagination);
        } else {
          setPagination({
            total: dataArray.length,
            page: currentPage,
            limit: 12,
            totalPages: 1,
          });
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    FetchProducts();
  }, [currentCategory, currentSearch, currentSort, currentPage]);

  const handleReset = () => {
    setSearchInput("");
    router.replace("/products", { scroll: false });
  };

  const handleCategoryChange = (val: string) => {
    updateUrlFilters({ category: val });
  };

  const handleSortChange = (val: string) => {
    updateUrlFilters({ sort: val });
  };

  const handleSearchSubmit = () => {
    updateUrlFilters({ search: searchInput });
  };

  const isFiltered = currentSearch !== "" || currentCategory !== "" || currentSort !== "latest" || currentPage > 1;

  const activeCategoryObject = categories.find(
    (c) => String(c.id) === String(currentCategory) || c.slug === currentCategory || c.name === currentCategory
  );

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const sortOptions = [
    { value: "latest", label: "Sort: Latest" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-purple-200/50 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3 py-1 text-xs font-bold text-[#5b46f6] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {activeCategoryObject ? activeCategoryObject.name : "NexCart Catalog"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            {activeCategoryObject ? `${activeCategoryObject.name} Collection` : "Explore Our Collection"}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl">
            {activeCategoryObject
              ? `Browse high-quality products under ${activeCategoryObject.name}.`
              : "Discover premium gadgets, wearables, home essentials & lifestyle products."}
          </p>
        </div>

        {/* Live Results Count Badge */}
        {!loading && !error && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-700 shadow-xs border border-purple-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              {pagination.total} {pagination.total === 1 ? "Product" : "Products"} Total
            </span>
          </div>
        )}
      </div>

      {/* Modern Filter Toolbar */}
      <div className="rounded-2xl border border-purple-100 bg-white/70 backdrop-blur-md p-3 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* MUI Search Input */}
          <div className="flex-1">
            <TextField
              size="small"
              placeholder="Search by product name, model, or keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="h-4 w-4 text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: searchInput ? (
                    <InputAdornment position="end">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput("");
                          updateUrlFilters({ search: "" });
                        }}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.875rem",
                  "& fieldset": {
                    borderColor: "#E2E8F0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#CBD5E1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5b46f6",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </div>

          {/* MUI Category Dropdown & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="sm:w-48">
              <MuiSelect
                value={currentCategory}
                onChange={(e) => handleCategoryChange(String(e.target.value))}
                options={categoryOptions}
                fullWidth
              />
            </div>

            <div className="sm:w-48">
              <MuiSelect
                value={currentSort}
                onChange={(e) => handleSortChange(String(e.target.value))}
                options={sortOptions}
                fullWidth
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-[#4a36e3] active:scale-95 transition-all flex-1 sm:flex-none cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>

            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset Filters"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm font-semibold text-red-600">
          <X className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Product Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200/60 bg-white/40 p-4 space-y-4">
              <div className="aspect-square animate-pulse rounded-xl bg-slate-200/70" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200/70" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200/70" />
            </div>
          ))}
        </div>
      ) : !Array.isArray(products) || products.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-purple-200 bg-white/40 backdrop-blur-xs p-8 max-w-md mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-[#5b46f6] mb-4">
            <PackageX className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Products Found</h2>
          <p className="mt-1 text-xs text-slate-500">
            {currentCategory
              ? "No products are currently available in this category."
              : "We couldn't find any products matching your filters."}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#4a36e3] transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Reusable Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={(newPage) => {
              updateUrlFilters({ page: newPage });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-sm text-slate-500">
          Loading products catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
