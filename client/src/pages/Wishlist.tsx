import { useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { ProductWithVariants } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems, isLoading: isWishlistLoading } = useWishlist();

  // Assuming all products are cached from the shop page or we fetch them
  const { data: allProducts, isLoading: isProductsLoading } = useQuery<ProductWithVariants[]>({
    queryKey: ["/api/products"],
  });

  const isLoading = isWishlistLoading || isProductsLoading;

  // Filter products to only show those that have a variant in the wishlist
  const savedProducts = allProducts?.filter(product => 
    product.variants.some(variant => 
      wishlistItems.some(item => item.productVariantId === variant.id)
    )
  ) || [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground w-full max-w-2xl">
            Save items you love here to easily find them later and keep track of price drops.
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-[2rem] p-6 space-y-4 shadow-sm border border-border/50">
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-full aspect-square rounded-xl" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-1/2 h-4" />
                <div className="flex justify-between items-end pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Skeleton className="w-16 h-3" />
                    <Skeleton className="w-24 h-5" />
                  </div>
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : savedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-border/60 rounded-3xl bg-surface/50">
            <div className="p-4 bg-background rounded-full shadow-sm text-muted-foreground mb-2">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold">Your wishlist is empty</h2>
            <p className="text-muted-foreground max-w-sm">
              Explore our collection of premium refurbished Apple devices and save your favorites here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
