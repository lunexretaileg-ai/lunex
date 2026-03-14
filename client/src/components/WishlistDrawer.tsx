import { useEffect } from "react";
import { Link } from "wouter";
import { X, Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useWishlistDrawer } from "@/store/use-wishlist-drawer";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/store/use-cart";
import { useQuery } from "@tanstack/react-query";
import type { ProductWithVariants } from "@shared/schema";
import { cn } from "@/lib/utils";

export function WishlistDrawer() {
  const { isOpen, closeWishlist } = useWishlistDrawer();
  const { user } = useAuth();
  const { wishlistItems, removeFromWishlist, isLoading } = useWishlist();
  const { addItem } = useCart();

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeWishlist(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeWishlist]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const { data: allProducts = [] } = useQuery<ProductWithVariants[]>({
    queryKey: ["/api/products"],
  });

  // Resolve wishlist items to full product+variant objects
  const wishlistProducts = wishlistItems.map((item) => {
    for (const product of allProducts) {
      const variant = product.variants.find((v) => v.id === item.productVariantId);
      if (variant) return { wishlistId: item.id, product, variant };
    }
    return null;
  }).filter(Boolean) as { wishlistId: number; product: ProductWithVariants; variant: any }[];

  const handleMoveToCart = (entry: { wishlistId: number; product: ProductWithVariants; variant: any }) => {
    addItem({
      id: `${entry.product.id}-${entry.variant.id}`,
      productId: entry.product.id,
      variantId: entry.variant.id,
      name: entry.product.name,
      slug: entry.product.slug,
      imageUrl: entry.product.imageUrl,
      price: Number(entry.variant.lunexPrice),
      quantity: 1,
      storage: entry.variant.storage ?? null,
      color: entry.variant.color ?? null,
      conditionScore: entry.variant.conditionScore,
      batteryHealth: entry.variant.batteryHealth,
    });
    removeFromWishlist.mutate(entry.wishlistId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="wishlist-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            key="wishlist-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <h2 className="text-lg font-bold">Wishlist</h2>
                {wishlistProducts.length > 0 && (
                  <span className="text-xs font-semibold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
                    {wishlistProducts.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeWishlist}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Sign in to see your wishlist</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Save items you love to easily find them later.
                    </p>
                  </div>
                  <Link href="/account" onClick={closeWishlist}>
                    <button className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition">
                      Sign In
                    </button>
                  </Link>
                </div>
              ) : isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : wishlistProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Your wishlist is empty</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Browse our collection and tap the ♡ on any product.
                    </p>
                  </div>
                  <Link href="/shop" onClick={closeWishlist}>
                    <button className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition">
                      Browse Devices
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlistProducts.map((entry) => (
                    <div
                      key={entry.wishlistId}
                      className="flex items-center gap-4 bg-card border border-border/60 rounded-2xl p-3 group"
                    >
                      {/* Product image */}
                      <Link href={`/product/${entry.product.slug}`} onClick={closeWishlist}>
                        <div className="w-16 h-16 rounded-xl bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={entry.product.imageUrl}
                            alt={entry.product.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${entry.product.slug}`} onClick={closeWishlist}>
                          <p className="font-semibold text-sm leading-tight truncate hover:text-primary transition-colors">
                            {entry.product.name}
                          </p>
                        </Link>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {entry.variant.storage && (
                            <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                              {entry.variant.storage}
                            </span>
                          )}
                          {entry.variant.color && (
                            <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                              {entry.variant.color}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold mt-1">
                          EGP {Number(entry.variant.lunexPrice).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => removeFromWishlist.mutate(entry.wishlistId)}
                          className="p-1.5 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveToCart(entry)}
                          className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {user && wishlistProducts.length > 0 && (
              <div className="border-t border-border/60 px-4 py-4 space-y-2">
                <button
                  onClick={() => {
                    wishlistProducts.forEach(handleMoveToCart);
                  }}
                  className="w-full py-3 rounded-2xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Move All to Cart
                </button>
                <Link href="/wishlist" onClick={closeWishlist}>
                  <button className="w-full py-2.5 rounded-2xl border border-border text-sm font-semibold hover:bg-muted/30 transition">
                    View Full Wishlist
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
