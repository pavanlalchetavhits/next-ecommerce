'use client';

import { useState, useEffect } from 'react';
import { useCartStore, CartItem } from '@/app/store/cartstore';

export type { CartItem };

export function useCart() {
  const [isHydrated, setIsHydrated] = useState(false);

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  // Prevent Next.js SSR hydration mismatch with persisted Zustand store
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const subtotal = isHydrated ? getSubtotal() : 0;
  const totalItems = isHydrated ? getTotalItems() : 0;
  const cartItems = isHydrated ? items : [];
  const isEmpty = cartItems.length === 0;

  const isInCart = (productId: number, variantId?: number): boolean => {
    return cartItems.some(
      (item) => item.productId === productId && item.variantId === variantId
    );
  };

  const getItemQuantity = (productId: number, variantId?: number): number => {
    const item = cartItems.find(
      (item) => item.productId === productId && item.variantId === variantId
    );
    return item ? item.quantity : 0;
  };

  return {
    items: cartItems,
    totalItems,
    subtotal,
    isEmpty,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
}
