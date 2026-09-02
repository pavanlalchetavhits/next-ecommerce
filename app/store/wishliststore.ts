import { create } from "zustand";

type WishlistStore = {
  wishlistIds: number[];
  count: number;
  loading: boolean;
  hasFetched: boolean;
  fetchWishlist: (force?: boolean) => Promise<void>;
  addWishlistId: (productId: number) => void;
  removeWishlistId: (productId: number) => void;
  setWishlistIds: (ids: number[]) => void;
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistIds: [],
  count: 0,
  loading: false,
  hasFetched: false,

  fetchWishlist: async (force = false) => {
    if (!force && (get().loading || get().hasFetched)) {
      return;
    }

    try {
      set({ loading: true });
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        const ids = data.data.map((item: any) => Number(item.product_id));
        set({ wishlistIds: ids, count: ids.length, hasFetched: true });
      } else {
        set({ wishlistIds: [], count: 0, hasFetched: true });
      }
    } catch {
      set({ wishlistIds: [], count: 0, hasFetched: true });
    } finally {
      set({ loading: false });
    }
  },

  addWishlistId: (productId: number) => {
    const current = get().wishlistIds;
    if (!current.includes(productId)) {
      const updated = [...current, productId];
      set({ wishlistIds: updated, count: updated.length });
    }
  },

  removeWishlistId: (productId: number) => {
    const current = get().wishlistIds;
    const updated = current.filter((id) => id !== productId);
    set({ wishlistIds: updated, count: updated.length });
  },

  setWishlistIds: (ids: number[]) => {
    set({ wishlistIds: ids, count: ids.length, hasFetched: true });
  },
}));
