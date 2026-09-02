'use client';

import { useEffect, useState } from 'react';
import { useWishlistStore } from '@/app/store/wishliststore';
import api from '@/lib/axios';

export function useWishlist() {
  const wishlistIds = useWishlistStore((state) => state.wishlistIds);
  const count = useWishlistStore((state) => state.count);
  const loading = useWishlistStore((state) => state.loading);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const addWishlistId = useWishlistStore((state) => state.addWishlistId);
  const removeWishlistId = useWishlistStore((state) => state.removeWishlistId);

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Fetch initial wishlist state on client mount
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if a specific product is in the user's wishlist
  const isInWishlist = (productId: number): boolean => {
    return wishlistIds.includes(productId);
  };

  // Toggle item in/out of wishlist with optimistic state updating & rollback on failure
  const toggleWishlist = async (productId: number): Promise<boolean> => {
    setActionLoadingId(productId);
    const inWishlist = isInWishlist(productId);

    try {
      if (inWishlist) {
        removeWishlistId(productId);
        const res = await api.delete(`/api/wishlist?product_id=${productId}`);
        if (res.status !== 200 && !res.data?.success) {
          addWishlistId(productId);
          return false;
        }
      } else {
        addWishlistId(productId);
        const res = await api.post('/api/wishlist', { product_id: productId });
        if (res.status !== 200 && res.status !== 201 && !res.data?.success) {
          removeWishlistId(productId);
          return false;
        }
      }
      return true;
    } catch (error) {
      // Revert optimistic state update on error
      if (inWishlist) {
        addWishlistId(productId);
      } else {
        removeWishlistId(productId);
      }
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  return {
    wishlistIds,
    count,
    loading,
    actionLoadingId,
    isInWishlist,
    toggleWishlist,
    refetchWishlist: fetchWishlist,
  };
}
