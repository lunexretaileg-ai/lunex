import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";

type WishlistItem = {
  id: number;
  userId: number;
  productVariantId: number;
  createdAt: string | null;
}

export function useWishlist() {
  const { user } = useAuth();
  const { toast } = useToast();

  const getHeaders = () => {
    // Pass the user ID until we setup complete Supabase row-level security
    return { "x-user-id": user?.id || "" };
  };

  const { data: wishlistItems = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["/api/wishlist"],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch("/api/wishlist", { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return await res.json();
    },
    enabled: !!user,
  });

  const addToWishlist = useMutation({
    mutationFn: async (productVariantId: number) => {
      if (!user) throw new Error("Must be logged in");
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          ...getHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productVariantId }),
      });
      if (!res.ok) throw new Error("Failed to add to wishlist");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({ title: "Added to wishlist" });
    },
    onError: () => {
      toast({ title: "Failed to add to wishlist", variant: "destructive" });
    }
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (id: number) => {
      if (!user) throw new Error("Must be logged in");
      const res = await fetch(`/api/wishlist/${id}`, { 
        method: "DELETE",
        headers: getHeaders() 
      });
      if (!res.ok) throw new Error("Failed to remove from wishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({ title: "Removed from wishlist" });
    },
    onError: () => {
      toast({ title: "Failed to remove from wishlist", variant: "destructive" });
    }
  });

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist: (variantId: number) => wishlistItems.some(item => item.productVariantId === variantId),
    getWishlistItemId: (variantId: number) => wishlistItems.find(item => item.productVariantId === variantId)?.id,
  };
}
