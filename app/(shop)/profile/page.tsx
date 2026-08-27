'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  User,
  Mail,
  Phone,
  Shield,
  KeyRound,
  Package,
  MapPin,
  Heart,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Sparkles,
  Save,
  Building,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { useWishlistStore } from '@/app/store/wishliststore';
import MuiSelect from '@/components/ui/MuiSelect';

type Profile = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin';
  status: string;
  last_login_at: string | null;
  created_at: string;
};

type OrderItemDetail = {
  id: number;
  product_id: number;
  variant_id?: number | null;
  product_name: string;
  variant_name?: string | null;
  sku?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_slug?: string | null;
  product_image?: string | null;
};

type OrderDetail = {
  id: number;
  order_number: string;
  user_id: number;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  coupon_code?: string | null;
  status: string;
  payment_status: string;
  shipping_full_name: string;
  shipping_phone: string;
  shipping_address_line1?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_postal_code?: string | null;
  item_count?: number;
  created_at: string;
  items?: OrderItemDetail[];
};

type Address = {
  id?: number;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type?: 'home' | 'work' | 'other';
  is_default?: boolean;
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'addresses' | 'security'>('info');

  // Form states - Profile Info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  // Change Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Password visibility toggle states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Address Modal & Form states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [addrCountry, setAddrCountry] = useState('India');
  const [addrType, setAddrType] = useState<'home' | 'work' | 'other'>('home');
  const [addrSaving, setAddrSaving] = useState(false);
  const [addrMsg, setAddrMsg] = useState('');
  const [addrErr, setAddrErr] = useState('');

  // Order Details Modal state
  const [viewingOrder, setViewingOrder] = useState<OrderDetail | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // Wishlist count
  const wishlistCount = useWishlistStore((state) => state.count);

  async function fetchProfileData() {
    try {
      setLoading(true);
      setSaveError('');

      const res = await fetch('/api/profile');
      if (res.status === 401) {
        router.push('/login?callbackUrl=/profile');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load profile');
      }

      setProfile(data.data);
      setName(data.data.name || '');
      setPhone(data.data.phone || '');

      // Fetch orders
      try {
        const orderRes = await fetch('/api/orders');
        const orderData = await orderRes.json();
        if (orderRes.ok && orderData.success) {
          setOrders(orderData.data || []);
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
      }

      // Fetch addresses
      fetchAddresses();
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setSaveError(err.message || 'Failed to load profile information');
    } finally {
      setLoading(false);
    }
  }

  async function fetchAddresses() {
    try {
      const addrRes = await fetch('/api/addresses');
      const addrData = await addrRes.json();
      if (addrRes.ok && addrData.success) {
        setAddresses(addrData.data || []);
      }
    } catch (err) {
      console.error('Fetch addresses error:', err);
    }
  }

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Lock background body scroll when any modal is open
  useEffect(() => {
    if (showAddressModal || viewingOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddressModal, viewingOrder]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaveMessage('');
    setSaveError('');
    setSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSaveMessage('Profile information updated successfully!');
      if (profile) {
        setProfile({ ...profile, name, phone });
      }
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err: any) {
      console.error('Update profile error:', err);
      setSaveError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to change password');
      }

      setPasswordMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 4000);
    } catch (err: any) {
      console.error('Change password error:', err);
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  }

  function openNewAddressModal() {
    setEditingAddress(null);
    setAddrFullName(profile?.name || '');
    setAddrPhone(profile?.phone || '');
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('');
    setAddrState('');
    setAddrPostalCode('');
    setAddrCountry('India');
    setAddrType('home');
    setAddrMsg('');
    setAddrErr('');
    setShowAddressModal(true);
  }

  function openEditAddressModal(addr: Address) {
    setEditingAddress(addr);
    setAddrFullName(addr.full_name || '');
    setAddrPhone(addr.phone || '');
    setAddrLine1(addr.address_line1 || '');
    setAddrLine2(addr.address_line2 || '');
    setAddrCity(addr.city || '');
    setAddrState(addr.state || '');
    setAddrPostalCode(addr.postal_code || '');
    setAddrCountry(addr.country || 'India');
    setAddrType(addr.address_type || 'home');
    setAddrMsg('');
    setAddrErr('');
    setShowAddressModal(true);
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    setAddrMsg('');
    setAddrErr('');
    setAddrSaving(true);

    const payload = {
      full_name: addrFullName,
      phone: addrPhone,
      address_line1: addrLine1,
      address_line2: addrLine2,
      city: addrCity,
      state: addrState,
      postal_code: addrPostalCode,
      country: addrCountry,
      address_type: addrType,
    };

    try {
      let res;
      if (editingAddress?.id) {
        res = await fetch(`/api/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save address');
      }

      setAddrMsg(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
      fetchAddresses();
      setTimeout(() => {
        setShowAddressModal(false);
        setAddrMsg('');
      }, 1000);
    } catch (err: any) {
      console.error('Save address error:', err);
      setAddrErr(err.message || 'Failed to save address');
    } finally {
      setAddrSaving(false);
    }
  }

  async function handleDeleteAddress(id?: number) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this shipping address?')) return;

    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete address');
      }

      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      console.error('Delete address error:', err);
      alert(err.message || 'Failed to delete address');
    }
  }

  async function openOrderDetails(ord: OrderDetail) {
    setViewingOrder(ord);
    setLoadingOrderDetails(true);

    try {
      const res = await fetch(`/api/orders/${ord.id}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setViewingOrder(data.data);
      }
    } catch (err) {
      console.error('Fetch order detail error:', err);
    } finally {
      setLoadingOrderDetails(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 space-y-6">
        <div className="h-28 w-full animate-pulse rounded-3xl bg-slate-200" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
          <div className="md:col-span-3 h-96 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500 border border-red-100 mb-4">
          <AlertCircle size={36} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">Authentication Error</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {saveError || 'Unable to access your profile. Please log in again.'}
        </p>
        <Link
          href="/login?callbackUrl=/profile"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca] transition-all cursor-pointer"
        >
          <span>Log In</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const initialLetter = (profile.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Circle */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5b46f6] to-purple-500 text-3xl font-extrabold text-white shadow-lg ring-4 ring-white/10 font-display">
            {initialLetter}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                {profile.name}
              </h1>
              <span className="rounded-full bg-indigo-500/30 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 border border-indigo-400/20">
                {profile.role === 'admin' ? 'Administrator' : 'Verified Customer'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>{profile.email}</span>
            </p>
            {profile.created_at && (
              <p className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                <Clock className="h-3 w-3 shrink-0 text-slate-500" />
                <span>Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </p>
            )}
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
            <Link
              href="/wishlist"
              className="flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-white border border-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <Heart className="h-4 w-4 text-red-400 fill-red-400" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-1.5 rounded-2xl bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white px-4 py-2.5 text-xs font-bold border border-red-500/30 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Tabs & Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sidebar Navigation */}
        <div className="md:col-span-4 rounded-3xl border border-purple-100 bg-white p-3 shadow-xs space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-[#5b46f6] text-white shadow-md'
                : 'text-slate-700 hover:bg-purple-50 hover:text-[#5b46f6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="h-4 w-4" />
              <span>Personal Information</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-70" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#5b46f6] text-white shadow-md'
                : 'text-slate-700 hover:bg-purple-50 hover:text-[#5b46f6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </div>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold text-[#5b46f6]">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-[#5b46f6] text-white shadow-md'
                : 'text-slate-700 hover:bg-purple-50 hover:text-[#5b46f6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4" />
              <span>Saved Addresses</span>
            </div>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold text-[#5b46f6]">
              {addresses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#5b46f6] text-white shadow-md'
                : 'text-slate-700 hover:bg-purple-50 hover:text-[#5b46f6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4" />
              <span>Account Security</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-70" />
          </button>
        </div>

        {/* Right Column: Tab Content */}
        <div className="md:col-span-8">
          {/* TAB 1: Personal Information */}
          {activeTab === 'info' && (
            <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-display">Personal Details</h2>
                <p className="text-xs text-slate-500">Update your account display name and contact phone number.</p>
              </div>

              {saveMessage && (
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{saveMessage}</span>
                </div>
              )}

              {saveError && (
                <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-slate-400 font-normal lowercase">(read-only)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-xs font-semibold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="Enter mobile phone number"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#5b46f6] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Saving Changes...' : 'Save Profile Details'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: My Orders */}
          {activeTab === 'orders' && (
            <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">My Order History</h2>
                  <p className="text-xs text-slate-500">Track and view status of all your store purchases.</p>
                </div>
                <Link
                  href="/orders"
                  className="text-xs font-bold text-[#5b46f6] hover:underline"
                >
                  View All Orders →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="text-sm font-bold text-slate-800">No Orders Placed Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Explore our catalog to find exciting products and place your first order!
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca]"
                  >
                    <span>Browse Products</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => {
                    const statusColor =
                      ord.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : ord.status === 'cancelled'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';

                    return (
                      <div
                        key={ord.id}
                        onClick={() => openOrderDetails(ord)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-purple-50 p-4 hover:border-purple-200 hover:shadow-xs transition-all cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 group-hover:text-[#5b46f6] transition-colors">
                              #{ord.order_number}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${statusColor}`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Placed on {new Date(ord.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                          <span className="text-sm font-extrabold text-slate-900">
                            ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openOrderDetails(ord);
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-bold text-[#5b46f6] hover:bg-[#5b46f6] hover:text-white transition-all cursor-pointer"
                          >
                            <span>Details</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">Shipping Addresses</h2>
                  <p className="text-xs text-slate-500">Add, edit, or remove shipping addresses for quick checkout.</p>
                </div>
                <button
                  type="button"
                  onClick={openNewAddressModal}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-[#5b46f6] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca] active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="py-12 text-center space-y-3 border-2 border-dashed border-purple-100 rounded-3xl">
                  <MapPin className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="text-sm font-bold text-slate-800">No Saved Addresses</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click above to add your primary shipping address for fast orders!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr, idx) => (
                    <div
                      key={addr.id || idx}
                      className="rounded-3xl border border-purple-100 bg-purple-50/30 p-5 space-y-3 relative flex flex-col justify-between hover:border-purple-200 transition-all shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                            <Building className="h-4 w-4 text-[#5b46f6]" />
                            <span>{addr.full_name}</span>
                          </div>
                          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#5b46f6]">
                            {addr.address_type || 'home'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {addr.address_line1} {addr.address_line2 ? `, ${addr.address_line2}` : ''}<br />
                          {addr.city}, {addr.state} - {addr.postal_code}<br />
                          {addr.country}
                        </p>

                        <p className="text-[11px] font-semibold text-slate-500">
                          Phone: {addr.phone}
                        </p>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-purple-100/60">
                        <button
                          type="button"
                          onClick={() => openEditAddressModal(addr)}
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-white border border-slate-200 py-2 px-3 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#5b46f6] hover:border-purple-200 transition-all cursor-pointer shadow-2xs"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="inline-flex items-center justify-center rounded-xl bg-white border border-red-100 p-2 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer shadow-2xs"
                          title="Delete address"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Account Security */}
          {activeTab === 'security' && (
            <div className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-display">Security & Password</h2>
                <p className="text-xs text-slate-500">Change your account password to keep your profile secure.</p>
              </div>

              {passwordMessage && (
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{passwordMessage}</span>
                </div>
              )}

              {passwordError && (
                <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-10 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title={showCurrentPassword ? 'Hide password' : 'View password'}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-10 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title={showNewPassword ? 'Hide password' : 'View password'}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-10 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title={showConfirmPassword ? 'Hide password' : 'View password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#5b46f6] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Shield className="h-4 w-4" />
                    <span>{passwordSaving ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto no-scrollbar">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 font-display">
                {editingAddress ? 'Edit Shipping Address' : 'Add New Shipping Address'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {addrMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{addrMsg}</span>
              </div>
            )}

            {addrErr && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span>{addrErr}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none"
                    placeholder="Recipient name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none"
                    placeholder="Mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={addrLine1}
                  onChange={(e) => setAddrLine1(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none"
                  placeholder="Street address, house/flat number"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Address Line 2 <span className="font-normal text-slate-400 lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={addrLine2}
                  onChange={(e) => setAddrLine2(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none"
                  placeholder="Apartment, suite, landmark"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={addrPostalCode}
                    onChange={(e) => setAddrPostalCode(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-[#5b46f6] focus:outline-none"
                    placeholder="Pincode / ZIP"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Address Type
                  </label>
                  <MuiSelect
                    value={addrType}
                    onChange={(e) => setAddrType(e.target.value as 'home' | 'work' | 'other')}
                    options={[
                      { value: 'home', label: 'Home' },
                      { value: 'work', label: 'Work' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addrSaving}
                  className="rounded-xl bg-[#5b46f6] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] cursor-pointer disabled:opacity-50"
                >
                  {addrSaving ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ORDER DETAILS MODAL OVERLAY --- */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto no-scrollbar">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Fixed Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-purple-100 bg-white/95 backdrop-blur-md px-6 py-5 sm:px-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#5b46f6]">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 font-display">
                      Order #{viewingOrder.order_number}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                        viewingOrder.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : viewingOrder.status === 'cancelled'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {viewingOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Placed on {new Date(viewingOrder.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto no-scrollbar flex-1">
              {/* Recipient & Shipping Information Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Recipient Contact
                  </p>
                  <p className="text-xs font-bold text-slate-900">
                    {viewingOrder.shipping_full_name}
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{viewingOrder.shipping_phone}</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Shipping Address
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {viewingOrder.shipping_address_line1 || 'Primary Address'}<br />
                    {[
                      viewingOrder.shipping_city,
                      viewingOrder.shipping_state,
                      viewingOrder.shipping_postal_code,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>

              {/* Line Items Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Purchased Line Items
                </h4>

                {loadingOrderDetails ? (
                  <div className="py-8 text-center text-xs font-semibold text-[#5b46f6] flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading order items...</span>
                  </div>
                ) : viewingOrder.items && viewingOrder.items.length > 0 ? (
                  <div className="divide-y divide-purple-50 rounded-2xl border border-purple-100 bg-white">
                    {viewingOrder.items.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-purple-50 p-1 flex items-center justify-center border border-purple-100 shrink-0">
                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 line-clamp-1">
                              {item.product_name}
                            </p>
                            {item.variant_name && (
                              <p className="text-[10px] font-bold text-[#5b46f6]">
                                Variant: {item.variant_name}
                              </p>
                            )}
                            <p className="text-[11px] text-slate-400">
                              Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-slate-900 shrink-0">
                          ₹{Number(item.total_price || item.unit_price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-xs text-slate-500 italic bg-purple-50/20 rounded-2xl">
                    Order summary recorded.
                  </div>
                )}
              </div>

              {/* Financial Summary */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">
                    ₹{Number(viewingOrder.subtotal).toLocaleString('en-IN')}
                  </span>
                </div>
                {Number(viewingOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({viewingOrder.coupon_code || 'Promo'})</span>
                    <span>-₹{Number(viewingOrder.discount_amount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-slate-900">
                    ₹{Number(viewingOrder.shipping_amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax Amount</span>
                  <span className="font-bold text-slate-900">
                    ₹{Number(viewingOrder.tax_amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="border-t border-purple-200/60 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Amount Paid</span>
                  <span className="text-[#5b46f6]">
                    ₹{Number(viewingOrder.total_amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
