import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  variantId?: number;
  name: string;
  variantName?: string;
  sku?: string;
  image?: string;
  price: number;
  quantity: number;
  stock: number;
};

type CartStore = {
  items: CartItem[];

  addItem: (item: CartItem) => void;

  removeItem: (
    productId: number,
    variantId?: number
  ) => void;

  updateQuantity: (
    productId: number,
    quantity: number,
    variantId?: number
  ) => void;

  clearCart: () => void;

  getSubtotal: () => number;

  getTotalItems: () => number;
};

export const useCartStore =
  create<CartStore>()(
    persist(
      (set, get) => ({
        items: [],

        addItem: (item) => {
          const existing =
            get().items.find(
              (cartItem) =>
                cartItem.productId ===
                  item.productId &&
                cartItem.variantId ===
                  item.variantId
            );

          if (existing) {
            set({
              items: get().items.map(
                (cartItem) =>
                  cartItem.productId ===
                    item.productId &&
                  cartItem.variantId ===
                    item.variantId
                    ? {
                        ...cartItem,
                        quantity: Math.min(
                          cartItem.quantity +
                            item.quantity,
                          cartItem.stock
                        ),
                      }
                    : cartItem
              ),
            });

            return;
          }

          set({
            items: [...get().items, item],
          });
        },

        removeItem: (
          productId,
          variantId
        ) => {
          set({
            items: get().items.filter(
              (item) =>
                !(
                  item.productId ===
                    productId &&
                  item.variantId ===
                    variantId
                )
            ),
          });
        },

        updateQuantity: (
          productId,
          quantity,
          variantId
        ) => {
          if (quantity <= 0) {
            get().removeItem(
              productId,
              variantId
            );

            return;
          }

          set({
            items: get().items.map(
              (item) =>
                item.productId === productId &&
                item.variantId === variantId
                  ? {
                      ...item,
                      quantity: Math.min(
                        quantity,
                        item.stock
                      ),
                    }
                  : item
            ),
          });
        },

        clearCart: () => {
          set({
            items: [],
          });
        },

        getSubtotal: () => {
          return get().items.reduce(
            (total, item) =>
              total +
              Number(item.price) *
                item.quantity,
            0
          );
        },

        getTotalItems: () => {
          return get().items.reduce(
            (total, item) =>
              total + item.quantity,
            0
          );
        },
      }),
      {
        name: "next-ecommerce",
      }
    )
  );