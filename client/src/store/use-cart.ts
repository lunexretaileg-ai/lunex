import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductVariant } from '@shared/schema';

export interface CartItem {
  id: string; // unique string like `${productId}-${variantId}`
  productId: number;
  variantId: number;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  quantity: number;
  storage: string | null;
  color: string | null;
  conditionScore: number;
  batteryHealth: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === newItem.id);
        
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: 'lunex-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
