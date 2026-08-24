"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  PackageX,
  X,
} from "lucide-react";
import ProductCard from "@/components/user/ProductCard";

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
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function FetchProducts() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }
      if (category) {
        params.set("category", category);
      }
      if (sort) {
        params.set("sort", sort);
      }

      const response = await axios.get(`/api/products?${params.toString()}`);

      const dataArray = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.products)
        ? response.data.products
        : Array.isArray(response.data)
        ? response.data
        : [];

      setProducts(dataArray);
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

  useEffect(() => {
    FetchProducts();
  }, [category, sort]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function handleReset() {
    setSearch("");
    setCategory("");
    setSort("latest");
  }

  const isFiltered = search.trim() !== "" || category !== "" || sort !== "latest";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-purple-200/50 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3 py-1 text-xs font-bold text-[#5b46f6] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>NexCart Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            Explore Our Collection
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl">
            Discover handcrafted furniture & home decor designed for style, comfort, and longevity.
          </p>
        </div>

        {/* Live Results Count Badge */}
        {!loading && !error && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs border border-purple-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              {Array.isArray(products) ? products.length : 0} Products Listed
            </span>
          </div>
        )}
      </div>

      {/* Modern Filter Toolbar */}
      <div className="mb-10 rounded-2xl border border-purple-100 bg-white/70 backdrop-blur-md p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* MUI Search Input */}
          <div className="flex-1">
            <TextField
              size="small"
              placeholder="Search by name, material, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") FetchProducts();
              }}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="h-4 w-4 text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setTimeout(() => FetchProducts(), 0);
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
                value={category}
                onChange={(e) => setCategory(String(e.target.value))}
                options={categoryOptions}
                fullWidth
              />
            </div>

            <div className="sm:w-48">
              <MuiSelect
                value={sort}
                onChange={(e) => setSort(String(e.target.value))}
                options={sortOptions}
                fullWidth
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={FetchProducts}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-[#4a36e3] active:scale-95 transition-all flex-1 sm:flex-none"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>

            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset Filters"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all"
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
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm font-semibold text-red-600">
          <X className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Product Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, idx) => (
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
            We couldn't find any products matching your filters.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#4a36e3] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

