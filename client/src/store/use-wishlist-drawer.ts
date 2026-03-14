import { create } from 'zustand';

interface WishlistDrawerStore {
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
}

export const useWishlistDrawer = create<WishlistDrawerStore>((set) => ({
  isOpen: false,
  openWishlist: () => set({ isOpen: true }),
  closeWishlist: () => set({ isOpen: false }),
  toggleWishlist: () => set((s) => ({ isOpen: !s.isOpen })),
}));
