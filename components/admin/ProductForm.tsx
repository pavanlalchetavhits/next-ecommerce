'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Tag,
  DollarSign,
  Barcode,
  Sparkles,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Star,
  Plus,
  FileText,
  HeartHandshake,
  ListChecks,
  Truck,
  HelpCircle,
} from 'lucide-react';
import api from '@/lib/axios';
import MuiSelect from '@/components/ui/MuiSelect';
import CKEditorWrapper from '@/components/ui/CKEditorWrapper';

interface CategoryOption {
  id: number;
  name: string;
}

interface ProductImageItem {
  id?: number;
  image_url: string;
  is_primary: boolean;
  alt_text?: string;
}

interface ProductSpecificationItem {
  key: string;
  value: string;
}

interface ProductFaqItem {
  question: string;
  answer: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: {
    id?: number;
    category_id: number;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    care_instructions?: string;
    specifications?: ProductSpecificationItem[] | string;
    shipping_info?: string;
    faq?: ProductFaqItem[];
    sku: string;
    price: number;
    compare_at_price?: number | null;
    status: 'active' | 'inactive' | 'draft';
    featured: boolean;
    images?: ProductImageItem[];
  };
}

export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    category_id: initialData?.category_id || 0,
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    short_description: initialData?.short_description || '',
    description: initialData?.description || '',
    care_instructions: initialData?.care_instructions || '',
    specifications:
      typeof initialData?.specifications === 'string'
        ? initialData.specifications
        : Array.isArray(initialData?.specifications)
          ? initialData.specifications
            .map((s) => `<p><strong>${s.key}:</strong> ${s.value}</p>`)
            .join('')
          : '',
    shipping_info: initialData?.shipping_info || '',
    sku: initialData?.sku || '',
    price: initialData?.price ? String(initialData.price) : '',
    compare_at_price: initialData?.compare_at_price
      ? String(initialData.compare_at_price)
      : '',
    status: initialData?.status || 'active',
    featured: initialData?.featured || false,
  });

  // Specifications state (dynamic key-value array fallback)
  const [specifications, setSpecifications] = useState<ProductSpecificationItem[]>(() => {
    const raw = initialData?.specifications;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        const items: ProductSpecificationItem[] = [];
        const regex = /<p>(?:<strong>)?(.*?)(?:<\/strong>)?:?\s*(.*?)<\/p>/gi;
        let match;
        while ((match = regex.exec(raw)) !== null) {
          const key = match[1].replace(/<\/?[^>]+(>|$)/g, '').replace(/:$/, '').trim();
          const value = match[2].replace(/<\/?[^>]+(>|$)/g, '').trim();
          if (key) {
            items.push({ key, value });
          }
        }
        if (items.length > 0) return items;
      }
    }
    return [];
  });

  // FAQ state (dynamic question-answer array)
  const [faq, setFaq] = useState<ProductFaqItem[]>(
    Array.isArray(initialData?.faq) ? initialData.faq : []
  );

  // Images State
  const [images, setImages] = useState<ProductImageItem[]>(
    initialData?.images || []
  );
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  // Handlers for Specifications
  const addSpecRow = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }]);
  };

  const updateSpecRow = (index: number, field: 'key' | 'value', val: string) => {
    setSpecifications((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const removeSpecRow = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Handlers for FAQ
  const addFaqRow = () => {
    setFaq((prev) => [...prev, { question: '', answer: '' }]);
  };

  const updateFaqRow = (index: number, field: 'question' | 'answer', val: string) => {
    setFaq((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const removeFaqRow = (index: number) => {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-generate Slug & SKU from Name
  const handleNameChange = (nameVal: string) => {
    const slugVal = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-');

    const generatedSku =
      formData.sku ||
      `SKU-${nameVal
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 5)}-${Math.floor(100 + Math.random() * 900)}`;

    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: slugVal,
      sku: isEdit ? prev.sku : generatedSku,
    }));
  };

  // Upload image via file API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await api.post('/api/upload/image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.data?.url) {
        const uploadedUrl = res.data.data.url;
        setImages((prev) => [
          ...prev,
          {
            image_url: uploadedUrl,
            is_primary: prev.length === 0, // Make first uploaded image primary
          },
        ]);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to upload image. Try adding URL.'
      );
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Add Image via Direct URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;

    setImages((prev) => [
      ...prev,
      {
        image_url: imageUrlInput.trim(),
        is_primary: prev.length === 0,
      },
    ]);
    setImageUrlInput('');
  };

  // Set Primary Image
  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  };

  // Remove Image
  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newFieldErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newFieldErrors.name = 'Product name is required (at least 2 characters)';
    }

    if (!formData.slug.trim()) {
      newFieldErrors.slug = 'Slug is required';
    }

    if (!formData.category_id || Number(formData.category_id) <= 0) {
      newFieldErrors.category_id = 'Please select a valid category';
    }

    if (
      !formData.price ||
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newFieldErrors.price = 'Selling price is required (must be greater than 0)';
    }

    if (!formData.sku.trim()) {
      newFieldErrors.sku = 'Stock SKU code is required';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError('Please review highlighted fields and correct input errors.');
      setLoading(false);
      return;
    }

    setFieldErrors({});

    const filteredSpecs = specifications.filter(
      (s) => s.key.trim() !== '' && s.value.trim() !== ''
    );
    const filteredFaq = faq.filter(
      (f) => f.question.trim() !== '' && f.answer.trim() !== ''
    );

    const payload = {
      category_id: Number(formData.category_id),
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      short_description: formData.short_description.trim() || undefined,
      description: formData.description.trim() || undefined,
      care_instructions: formData.care_instructions.trim() || undefined,
      specifications:
        formData.specifications.trim() !== ''
          ? formData.specifications.trim()
          : filteredSpecs.length > 0
            ? filteredSpecs
            : undefined,
      shipping_info: formData.shipping_info.trim() || undefined,
      faq: filteredFaq.length > 0 ? filteredFaq : undefined,
      sku: formData.sku.trim(),
      price: parseFloat(formData.price) || 0,
      compare_at_price: formData.compare_at_price
        ? parseFloat(formData.compare_at_price)
        : null,
      status: formData.status,
      featured: formData.featured,
      images: images.map((img, i) => ({
        id: img.id,
        image_url: img.image_url,
        alt_text: img.alt_text || null,
        is_primary: Boolean(img.is_primary),
        sort_order: i,
      })),
    };

    try {
      let productId = initialData?.id;

      if (isEdit && productId) {
        await api.put(`/api/products/${productId}`, payload);
      } else {
        const res = await api.post('/api/products', payload);
        productId = res.data?.data?.insertId || res.data?.data?.id;
      }

      setSuccessMsg(
        isEdit
          ? 'Product updated successfully!'
          : 'Product created & published successfully!'
      );
      setTimeout(() => router.push('/admin/products'), 1000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? 'Please check input fields and format.'
          : 'Failed to save product.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9EDF7] bg-white text-[#64748B] shadow-sm transition-all hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-[#707EAE]">
              {isEdit
                ? 'Update product specifications, images, and pricing'
                : 'Create a new product listing for your NexCart catalog'}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Basic Information */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <Package className="h-5 w-5 text-[#6366F1]" />
            <h2 className="text-base font-bold text-[#0F172A]">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Wireless Noise-Canceling Headphones"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full rounded-xl border bg-[#F8FAFC] p-3 text-sm text-[#0F172A] outline-none transition-all focus:bg-white ${
                  fieldErrors.name
                    ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                    : 'border-[#E9EDF7] focus:border-[#6366F1]'
                }`}
              />
              {fieldErrors.name && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{fieldErrors.name}</span>
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Slug *
              </label>
              <input
                type="text"
                placeholder="e.g. wireless-headphones"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className={`w-full rounded-xl border bg-[#F8FAFC] p-3 text-sm font-mono text-[#6366F1] outline-none transition-all focus:bg-white ${
                  fieldErrors.slug
                    ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                    : 'border-[#E9EDF7] focus:border-[#6366F1]'
                }`}
              />
              {fieldErrors.slug && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{fieldErrors.slug}</span>
                </p>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Category *
              </label>
              <MuiSelect
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: Number(e.target.value) })
                }
                options={[
                  { value: 0, label: '-- Select a Category --' },
                  ...categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  })),
                ]}
              />
              {fieldErrors.category_id && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{fieldErrors.category_id}</span>
                </p>
              )}
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Short Description
              </label>
              <CKEditorWrapper
                value={formData.short_description}
                onChange={(data) =>
                  setFormData({ ...formData, short_description: data })
                }
                placeholder="Brief summary of the product (displayed on product cards, quick views, and subtitle areas)..."
              />
            </div>

            {/* Full Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Full Description
              </label>
              <CKEditorWrapper
                value={formData.description}
                onChange={(data) =>
                  setFormData({ ...formData, description: data })
                }
                placeholder="Enter detailed product specifications, features, and overview..."
              />
            </div>
          </div>
        </div>

        {/* Card 2: Product Images Upload Section */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-[#6366F1]" />
              <h2 className="text-base font-bold text-[#0F172A]">
                Product Images
              </h2>
            </div>
            <span className="text-xs text-[#707EAE]">
              Upload image file or enter direct URL
            </span>
          </div>

          {/* Upload Drop Zone & URL Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Area */}
            <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 cursor-pointer hover:border-[#6366F1] hover:bg-indigo-50/30 transition-all">
              {uploadingImage ? (
                <div className="flex flex-col items-center py-2">
                  <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
                  <p className="mt-2 text-xs font-bold text-[#0F172A]">
                    Uploading image...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-[#6366F1] mb-2">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-[#0F172A]">
                    Click to Upload Image
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    JPG, PNG, WEBP, GIF, SVG
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Direct URL Input Area */}
            <div className="flex flex-col justify-center rounded-2xl border border-[#E9EDF7] bg-[#F8FAFC] p-6 space-y-3">
              <label className="block text-xs font-bold text-[#0F172A] uppercase">
                Add Image via URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/product.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="flex items-center gap-1 shrink-0 rounded-xl bg-[#6366F1] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#4F46E5]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Paste any external image link directly into catalog
              </p>
            </div>
          </div>

          {/* Uploaded Gallery Grid */}
          {images.length > 0 && (
            <div className="pt-4 border-t border-[#F1F5F9]">
              <p className="text-xs font-bold text-[#0F172A] uppercase mb-3">
                Uploaded Product Gallery ({images.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative group rounded-xl border p-2 bg-white transition-all ${img.is_primary
                        ? 'border-[#6366F1] ring-2 ring-indigo-500/20'
                        : 'border-[#E9EDF7] hover:border-[#CBD5E1]'
                      }`}
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-lg bg-slate-100">
                      {/* eslint-disable-next-html-element-suppression */}
                      <img
                        src={img.image_url}
                        alt="Product preview"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(idx)}
                        className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition-all ${img.is_primary
                            ? 'bg-indigo-100 text-[#6366F1]'
                            : 'bg-slate-100 text-[#64748B] hover:bg-indigo-50 hover:text-[#6366F1]'
                          }`}
                      >
                        <Star
                          className={`h-3 w-3 ${img.is_primary ? 'fill-[#6366F1]' : ''
                            }`}
                        />
                        <span>{img.is_primary ? 'Primary' : 'Set Primary'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Pricing & Inventory SKU */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <DollarSign className="h-5 w-5 text-[#6366F1]" />
            <h2 className="text-base font-bold text-[#0F172A]">
              Pricing & Inventory
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Selling Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="99.99"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className={`w-full rounded-xl border bg-[#F8FAFC] py-3 pl-8 pr-3 text-sm font-bold text-[#0F172A] outline-none transition-all focus:bg-white ${
                    fieldErrors.price
                      ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                      : 'border-[#E9EDF7] focus:border-[#6366F1]'
                  }`}
                />
              </div>
              {fieldErrors.price && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{fieldErrors.price}</span>
                </p>
              )}
            </div>

            {/* Compare at Price */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Original Price (₹) (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="129.99"
                  value={formData.compare_at_price}
                  onChange={(e) =>
                    setFormData({ ...formData, compare_at_price: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] py-3 pl-8 pr-3 text-sm text-[#0F172A] outline-none transition-all focus:border-[#6366F1] focus:bg-white"
                />
              </div>
            </div>

            {/* SKU */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Stock SKU Code *
              </label>
              <div className="relative">
                <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="e.g. PRD-1029"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className={`w-full rounded-xl border bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-mono text-[#0F172A] outline-none transition-all focus:bg-white ${
                    fieldErrors.sku
                      ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                      : 'border-[#E9EDF7] focus:border-[#6366F1]'
                  }`}
                />
              </div>
              {fieldErrors.sku && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{fieldErrors.sku}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Status & Visibility */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <Tag className="h-5 w-5 text-[#6366F1]" />
            <h2 className="text-base font-bold text-[#0F172A]">
              Status & Visibility
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Select */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                Product Status
              </label>
              <MuiSelect
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'active' | 'inactive' | 'draft',
                  })
                }
                options={[
                  { value: 'active', label: 'Active (Visible on Store)' },
                  { value: 'draft', label: 'Draft (Hidden)' },
                  { value: 'inactive', label: 'Inactive (Out of Stock)' },
                ]}
              />
            </div>

            {/* Featured Product Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] p-3 w-full hover:bg-white transition-all">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-[#CBD5E1] text-[#6366F1] focus:ring-[#6366F1]"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>Featured Showcase Product</span>
                  </div>
                  <p className="text-xs text-[#707EAE]">
                    Highlight this product on the home page hero grid
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Card 5: Care & Shipping Information */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <HeartHandshake className="h-5 w-5 text-[#6366F1]" />
            <h2 className="text-base font-bold text-[#0F172A]">
              Care & Shipping Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Care Instructions */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1 flex items-center gap-1.5">
                <HeartHandshake className="h-3.5 w-3.5 text-rose-500" />
                <span>Care Instructions</span>
              </label>
              <CKEditorWrapper
                value={formData.care_instructions}
                onChange={(data) =>
                  setFormData({ ...formData, care_instructions: data })
                }
                placeholder="e.g. Hand wash in cold water. Do not bleach. Lay flat to dry or dry clean only."
              />
            </div>

            {/* Shipping Information */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-blue-500" />
                <span>Shipping Information</span>
              </label>
              <CKEditorWrapper
                value={formData.shipping_info}
                onChange={(data) =>
                  setFormData({ ...formData, shipping_info: data })
                }
                placeholder="e.g. Dispatched within 24 hours. Free standard express delivery on orders over ₹50."
              />
            </div>
          </div>
        </div>

        {/* Card 6: Technical Specifications */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-[#6366F1]" />
              <h2 className="text-base font-bold text-[#0F172A]">
                Product Specifications
              </h2>
            </div>
          </div>

          <CKEditorWrapper
            value={formData.specifications}
            onChange={(data) =>
              setFormData({ ...formData, specifications: data })
            }
            placeholder="Enter technical specifications, tables, dimensions, weight, and features..."
          />
        </div>

        {/* Card 7: Product FAQ */}
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#6366F1]" />
              <h2 className="text-base font-bold text-[#0F172A]">
                Product FAQ (Frequently Asked Questions)
              </h2>
            </div>
            <button
              type="button"
              onClick={addFaqRow}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-[#6366F1] hover:bg-indigo-100 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add FAQ Question</span>
            </button>
          </div>

          {faq.length === 0 ? (
            <div className="py-6 text-center rounded-xl border border-dashed border-[#E9EDF7] bg-[#F8FAFC]">
              <p className="text-xs text-[#94A3B8]">
                No FAQ items added yet. Click &quot;Add FAQ Question&quot; to answer common customer queries.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {faq.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] p-4 space-y-2 relative group">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase text-[#6366F1]">
                      FAQ #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFaqRow(idx)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-all"
                      title="Remove FAQ item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Question (e.g. Is this product compatible with iOS?)"
                    value={item.question}
                    onChange={(e) => updateFaqRow(idx, 'question', e.target.value)}
                    className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs font-bold text-[#0F172A] outline-none focus:border-[#6366F1]"
                  />
                  <textarea
                    rows={2}
                    placeholder="Answer (e.g. Yes, it works seamlessly with iOS 14 and above...)"
                    value={item.answer}
                    onChange={(e) => updateFaqRow(idx, 'answer', e.target.value)}
                    className="w-full rounded-xl border border-[#E9EDF7] bg-white p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#6366F1]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="rounded-xl cursor-pointer border border-[#E9EDF7] bg-white px-5 py-3 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isEdit ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}