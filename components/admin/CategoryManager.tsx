'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import api from '@/lib/axios';
import MuiSelect from '@/components/ui/MuiSelect';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
}

interface CategoryManagerProps {
  categories: Category[];
}

export default function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    sort_order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-generate slug from name
  const handleNameChange = (nameVal: string) => {
    const slugVal = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-');

    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: slugVal,
    }));
  };

  // Open Add Modal
  const openAddModal = () => {
    setError('');
    setFieldErrors({});
    setFormData({
      name: '',
      slug: '',
      description: '',
      status: 'active',
      sort_order: 0,
    });
    setIsAddOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (cat: Category) => {
    setError('');
    setFieldErrors({});
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      status: cat.status || 'active',
      sort_order: cat.sort_order || 0,
    });
  };

  // Submit Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newFieldErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newFieldErrors.name = 'Category name is required (at least 2 characters)';
    }
    if (!formData.slug.trim()) {
      newFieldErrors.slug = 'Category slug is required';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError('Please fix highlighted input errors.');
      setLoading(false);
      return;
    }
    setFieldErrors({});

    try {
      const res = await api.post('/api/categories', formData);

      if (res.status === 201 || res.data?.success) {
        setSuccessMsg('Category created successfully!');
        setIsAddOpen(false);
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setLoading(true);
    setError('');

    const newFieldErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newFieldErrors.name = 'Category name is required (at least 2 characters)';
    }
    if (!formData.slug.trim()) {
      newFieldErrors.slug = 'Category slug is required';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError('Please fix highlighted input errors.');
      setLoading(false);
      return;
    }
    setFieldErrors({});

    try {
      const res = await api.put(`/api/categories/${editingCategory.id}`, formData);

      if (res.status === 200 || res.data?.success) {
        setSuccessMsg('Category updated successfully!');
        setEditingCategory(null);
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  // Submit Delete
  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.delete(`/api/categories/${deletingCategory.id}`);

      if (res.status === 200 || res.data?.success) {
        setSuccessMsg('Category deleted successfully!');
        setDeletingCategory(null);
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Categories
          </h1>
          <p className="text-sm font-medium text-[#707EAE]">
            Manage, edit, and organize product categories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && !isAddOpen && !editingCategory && !deletingCategory && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category Table Card */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm">
        {categories.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mx-auto mb-4">
              <FolderTree className="h-7 w-7" />
            </div>
            <p className="text-base font-bold text-[#0F172A]">No Categories Found</p>
            <p className="text-xs text-[#707EAE] mt-1 max-w-sm mx-auto">
              Add your first category to start organizing store products into groups.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#4F46E5]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Category</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-xs font-bold text-[#94A3B8] uppercase">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Sort Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-[#F8FAFC]">
                    <td className="py-4 px-4 font-bold text-[#0F172A]">
                      {cat.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[#6366F1]">
                      {cat.slug}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#64748B] max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="py-4 px-4">
                      {cat.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-xs font-bold text-[#64748B]">
                      {cat.sort_order}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(cat)}
                          title="Edit Category"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9EDF7] bg-white text-[#6366F1] transition-all hover:border-[#6366F1] hover:bg-indigo-50 shadow-sm"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          title="Delete Category"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50/60 text-red-600 transition-all hover:bg-red-600 hover:text-white shadow-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {(isAddOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E9EDF7] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
                  <FolderTree className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h3>
                  <p className="text-xs text-[#707EAE]">
                    {editingCategory
                      ? `Update details for "${editingCategory.name}"`
                      : 'Fill in category details below'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingCategory(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error in Modal */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Modal Form */}
            <form
              onSubmit={editingCategory ? handleEditSubmit : handleAddSubmit}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Footwear"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full rounded-xl border bg-[#F8FAFC] p-2.5 text-sm text-[#0F172A] outline-none transition-all focus:bg-white ${
                    fieldErrors.name
                      ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                      : 'border-[#E9EDF7] focus:border-[#6366F1]'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  placeholder="e.g. electronics"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className={`w-full rounded-xl border bg-[#F8FAFC] p-2.5 text-sm font-mono text-[#6366F1] outline-none transition-all focus:bg-white ${
                    fieldErrors.slug
                      ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                      : 'border-[#E9EDF7] focus:border-[#6366F1]'
                  }`}
                />
                {fieldErrors.slug && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{fieldErrors.slug}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this category..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] p-2.5 text-sm text-[#0F172A] outline-none transition-all focus:border-[#6366F1] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Status
                  </label>
                  <MuiSelect
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sort_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] p-2.5 text-sm text-[#0F172A] outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9EDF7]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingCategory(null);
                  }}
                  className="rounded-xl border border-[#E9EDF7] px-4 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:scale-105"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-extrabold text-[#0F172A]">
              Delete Category?
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Are you sure you want to delete category{' '}
              <strong className="text-[#0F172A]">&quot;{deletingCategory.name}&quot;</strong>?
              This action cannot be undone.
            </p>

            {error && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="rounded-xl border border-[#E9EDF7] px-4 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteConfirm}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 hover:bg-red-700"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
