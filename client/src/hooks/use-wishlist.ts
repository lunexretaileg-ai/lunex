import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useToast } from "./use-toast";

export type WishlistItem = {
  id: string; // generated client-side for local storage
  productId: number;
  productVariantId: number;
  createdAt: string;
};

interface WishlistStore {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id' | 'createdAt'>) => void;
  removeFromWishlist: (variantId: number) => void;
  isInWishlist: (variantId: number) => boolean;
  getWishlistItemId: (variantId: number) => string | undefined;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistItems: [],

      addToWishlist: (item) => {
        set((state) => {
          // Check if already in wishlist
          if (state.wishlistItems.some(i => i.productVariantId === item.productVariantId)) {
            return state;
          }
          const newItem: WishlistItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };
          return { wishlistItems: [...state.wishlistItems, newItem] };
        });
      },

      removeFromWishlist: (variantId) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((i) => i.productVariantId !== variantId),
        }));
      },

      isInWishlist: (variantId) => {
        return get().wishlistItems.some((i) => i.productVariantId === variantId);
      },

      getWishlistItemId: (variantId) => {
        return get().wishlistItems.find((i) => i.productVariantId === variantId)?.id;
      },
    }),
    {
      name: "lunex-wishlist",
    }
  )
);

// Wrapper hook to keep same API structure as before and supply toast notifications
export function useWishlist() {
  const store = useWishlistStore();
  const { toast } = useToast();

  const handleAdd = (productVariantId: number, productId: number) => {
    store.addToWishlist({ productVariantId, productId });
    toast({ title: "Added to wishlist" });
  };

  const handleRemove = (variantId: number) => {
    store.removeFromWishlist(variantId);
    toast({ title: "Removed from wishlist" });
  };

  return {
    wishlistItems: store.wishlistItems,
    isLoading: false,
    addToWishlist: {
      mutate: (productVariantId: number, options?: { onSuccess?: () => void }) => {
        handleAdd(productVariantId, productVariantId); // We pass variantId as productId if productId isn't explicitly known from caller context, but ideally caller passes both
        options?.onSuccess?.();
      }
    },
    removeFromWishlist: {
      mutate: (variantId: number, options?: { onSuccess?: () => void }) => {
        handleRemove(variantId);
        options?.onSuccess?.();
      }
    },
    isInWishlist: store.isInWishlist,
    getWishlistItemId: store.getWishlistItemId,
  };
}
