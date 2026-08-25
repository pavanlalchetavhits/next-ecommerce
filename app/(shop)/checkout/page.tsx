"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/app/store/cartstore";
import {
  ShoppingBag,
  MapPin,
  Plus,
  Check,
  CreditCard,
  Truck,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Sparkles,
  Home,
  Briefcase,
  User,
  Phone,
  Building,
} from "lucide-react";

type Address = {
  id: number;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: "home" | "work" | "other";
  is_default: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // New address form inline toggle & state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    address_type: "home" as "home" | "work" | "other",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getSubtotal();
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 100;
  const tax = 0;
  const total = Math.max(0, subtotal + shipping + tax - couponDiscount);

  /*
   * Fetch addresses
   */
  async function fetchAddresses() {
    try {
      setLoadingAddresses(true);
      const response = await fetch("/api/addresses");
      const data = await response.json();

      if (response.ok && data.success) {
        const addressList = data.data || [];
        setAddresses(addressList);

        const defaultAddress = addressList.find((addr: Address) => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        } else if (addressList.length > 0) {
          setSelectedAddress(addressList[0].id);
        }
      }
    } catch (err) {
      console.error("Address fetch error:", err);
    } finally {
      setLoadingAddresses(false);
    }
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  /*
   * Save inline address
   */
  async function handleSaveNewAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!newAddress.full_name || !newAddress.phone || !newAddress.address_line1 || !newAddress.city || !newAddress.state || !newAddress.postal_code) {
      setError("Please fill in all required address fields.");
      return;
    }

    try {
      setSavingAddress(true);
      setError("");

      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAddress, is_default: addresses.length === 0 }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save address");
      }

      await fetchAddresses();
      if (data.data?.id) {
        setSelectedAddress(data.data.id);
      }
      setShowAddAddress(false);
      setNewAddress({
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        address_type: "home",
      });
    } catch (err: any) {
      setError(err.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  }

  /*
   * Validate/apply coupon
   */
  async function applyCoupon() {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code.");
      return;
    }

    try {
      setCouponMessage("");
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setCouponDiscount(0);
        setCouponMessage(data.message || "Invalid coupon code.");
        return;
      }

      setCouponDiscount(Number(data.data.discount || 0));
      setCouponMessage(`🎉 Coupon applied! You saved ₹${Number(data.data.discount).toLocaleString("en-IN")}.`);
    } catch (error) {
      console.error("Coupon error:", error);
      setCouponMessage("Unable to validate coupon code.");
    }
  }

  /*
   * Place order
   */
  async function handlePlaceOrder() {
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!selectedAddress) {
      setError("Please select or add a shipping address.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address_id: selectedAddress,
          coupon_code: couponDiscount > 0 ? couponCode : null,
          discount_amount: couponDiscount,
          shipping_amount: shipping,
          tax_amount: tax,
          payment_method: paymentMethod,
          items: items.map((item) => ({
            product_id: item.productId,
            variant_id: item.variantId ?? null,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to place order");
      }

      clearCart();
      router.push(`/order-success/${data.data.order_id || data.data.id || 101}`);
    } catch (error: any) {
      console.error("Place order error:", error);
      setError(error.message || "Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  }

  /*
   * Empty cart state
   */
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-[#5b46f6] mx-auto mb-5">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">Your Cart is Empty</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Add products to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3 py-1 text-xs font-bold text-[#5b46f6] mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Fast & Secure Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Review & Place Order
            </h1>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5b46f6] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Cart</span>
          </Link>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-600 shadow-2xs">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Address & Payment */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Shipping Address Section */}
            <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-purple-50 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-[#5b46f6]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 font-display">
                      Shipping Address
                    </h2>
                    <p className="text-xs text-slate-500">Select or add your delivery location</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5b46f6] hover:bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{showAddAddress ? "Cancel" : "Add Address"}</span>
                </button>
              </div>

              {/* Inline Add New Address Form */}
              {showAddAddress && (
                <form onSubmit={handleSaveNewAddress} className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 space-y-3 animate-in fade-in duration-200">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">New Shipping Address</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newAddress.full_name}
                      onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#5b46f6]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Phone Number *"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#5b46f6]"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Flat / Building / House No., Street *"
                    value={newAddress.address_line1}
                    onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#5b46f6]"
                    required
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="City *"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#5b46f6]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State *"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#5b46f6]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#5b46f6]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca] transition-all cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{savingAddress ? "Saving..." : "Save Address"}</span>
                  </button>
                </form>
              )}

              {/* Saved Addresses List */}
              {loadingAddresses ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading saved addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-purple-200 p-6 text-center space-y-2">
                  <p className="text-xs text-slate-500 font-medium">No saved addresses found.</p>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#5b46f6] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#4338ca] transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Delivery Address</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((address) => {
                    const isSelected = selectedAddress === address.id;
                    return (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddress(address.id)}
                        className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
                          isSelected
                            ? "border-[#5b46f6] bg-purple-50/40 ring-2 ring-indigo-500/20 shadow-xs"
                            : "border-slate-200 bg-white hover:border-purple-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900">{address.full_name}</span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                              {address.address_type}
                            </span>
                          </div>

                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? "border-[#5b46f6] bg-[#5b46f6]" : "border-slate-300"}`}>
                            {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                          </div>
                        </div>

                        <p className="mt-1 text-xs text-slate-500 font-medium">📞 {address.phone}</p>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {address.address_line1}
                          {address.address_line2 ? `, ${address.address_line2}` : ""}
                          <br />
                          {address.city}, {address.state} - {address.postal_code}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 2. Payment Method Section */}
            <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-purple-50 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-[#5b46f6]">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 font-display">
                    Payment Method
                  </h2>
                  <p className="text-xs text-slate-500">Choose how you want to pay</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* COD Option */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#5b46f6] bg-purple-50/40 ring-2 ring-indigo-500/20 shadow-xs"
                      : "border-slate-200 hover:border-purple-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 accent-[#5b46f6]"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Cash on Delivery (COD)</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">Pay cash upon parcel delivery</p>
                  </div>
                </label>

                {/* Online Payment Option */}
                <label
                  onClick={() => setPaymentMethod("online")}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                    paymentMethod === "online"
                      ? "border-[#5b46f6] bg-purple-50/40 ring-2 ring-indigo-500/20 shadow-xs"
                      : "border-slate-200 hover:border-purple-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="mt-1 accent-[#5b46f6]"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Online Payment / UPI</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">Instant UPI, Cards & NetBanking</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Order Summary & Place Order */}
          <div className="lg:col-span-4 rounded-2xl border border-purple-100 bg-white p-6 shadow-2xs space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 font-display border-b border-purple-100 pb-3">
              Order Summary ({items.length} Items)
            </h2>

            {/* Cart Items List Preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 0}`}
                  className="flex items-center gap-3 rounded-xl border border-purple-50 p-2"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-50 p-1 border border-purple-100">
                    <img src={item.image || "/hero-img.png"} alt={item.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Voucher Box */}
            <div className="pt-2 border-t border-purple-100 space-y-2">
              <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <Tag className="h-3 w-3 text-[#5b46f6]" /> Coupon Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold uppercase text-slate-900 outline-none focus:border-[#5b46f6]"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponMessage && <p className="text-[11px] font-semibold text-emerald-600">{couponMessage}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-purple-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-emerald-600">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-purple-100 text-sm font-extrabold text-slate-900">
                <span>Total Payable</span>
                <span className="text-[#5b46f6]">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddress}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#4338ca] disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>{placingOrder ? "Placing Order..." : "Confirm & Place Order"}</span>
            </button>

            {/* Trust Badges */}
            <div className="pt-2 space-y-2 text-[11px] text-slate-500 border-t border-purple-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#5b46f6]" />
                <span>Encrypted 256-bit SSL Safety</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#5b46f6]" />
                <span>Pan-India Fast Express Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}