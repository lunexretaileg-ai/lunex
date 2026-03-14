import { Link } from "wouter";
import type { ProductWithVariants } from "@shared/schema";
import { Battery, ArrowRight, Heart, Sparkles, PackageOpen, Wrench, Cpu, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/hooks/use-wishlist";
import { useWishlistDrawer } from "@/store/use-wishlist-drawer";
import { cn } from "@/lib/utils";

// Using Omit and intersection to handle the serialized Date and decimals from the API
import type { ProductVariant } from "@shared/schema";

export interface SerializedProductVariant extends Omit<ProductVariant, 'lunexPrice' | 'marketPrice'> {
  lunexPrice: string | number;
  marketPrice: string | number;
}

export interface SerializedProductWithVariants extends Omit<ProductWithVariants, 'createdAt' | 'variants'> {
  createdAt: string | Date | null;
  variants: SerializedProductVariant[];
}

interface ProductCardProps {
  product: SerializedProductWithVariants;
}

// Styled badge config per device type — with icons
const DEVICE_TYPE_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  new:          { label: "New",         icon: Sparkles,    className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" },
  open_box:     { label: "Open Box",    icon: PackageOpen, className: "bg-sky-500/15 text-sky-400 border border-sky-500/25" },
  refurbished:  { label: "Refurbished", icon: Wrench,      className: "bg-amber-500/15 text-amber-400 border border-amber-500/25" },
  assembled:    { label: "Assembled",   icon: Cpu,         className: "bg-violet-500/15 text-violet-400 border border-violet-500/25" },
  used:         { label: "Used",        icon: Clock,       className: "bg-zinc-400/15 text-zinc-400 border border-zinc-400/25" },
};

export function getDeviceTypeBadge(deviceType: string) {
  return DEVICE_TYPE_CONFIG[deviceType] ?? { label: deviceType, icon: Cpu, className: "bg-secondary text-secondary-foreground" };
}


export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId } = useWishlist();
  const { openWishlist } = useWishlistDrawer();

  // Use the best variant for display (cheapest or default)
  const displayVariant = product.variants.length > 0 
    ? [...product.variants].sort((a, b) => Number(a.lunexPrice) - Number(b.lunexPrice))[0]
    : null;

  if (!displayVariant) return null;

  const lunexPrice = Number(displayVariant.lunexPrice);
  const marketPrice = Number(displayVariant.marketPrice);
  const discountPercent = Math.round(((marketPrice - lunexPrice) / marketPrice) * 100);

  const isSaved = isInWishlist(displayVariant.id);
  const { label: typeLabel, className: typeClass } = getDeviceTypeBadge(product.deviceType);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      // Open the wishlist drawer for non-logged-in users (shows login prompt)
      openWishlist();
      return;
    }
    if (isSaved) {
      const id = getWishlistItemId(displayVariant.id);
      if (id) removeFromWishlist.mutate(id);
    } else {
      addToWishlist.mutate(displayVariant.id);
    }
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group bg-card rounded-[2rem] p-6 hover-scale cursor-pointer border border-border/50 hover:border-border hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col h-full relative overflow-hidden">
        
        {/* Actions Bar */}
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {/* Device Type Badge */}
            {(() => {
              const TypeIcon = getDeviceTypeBadge(product.deviceType).icon;
              return (
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full",
                  typeClass
                )}>
                  <TypeIcon className="w-3 h-3" />
                  {typeLabel}
                </span>
              );
            })()}
            {discountPercent > 0 && (
              <span className="inline-flex px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-[hsl(var(--success))] text-white shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Always show heart button — for logged-out users it opens the login prompt drawer */}
          <button 
            onClick={handleWishlistToggle}
            disabled={addToWishlist.isPending || removeFromWishlist.isPending}
            className={cn(
              "p-2.5 rounded-full bg-background/80 backdrop-blur border border-border/50 hover:bg-background transition-colors text-muted-foreground hover:text-red-500",
              isSaved && "text-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4 transition-colors", isSaved && "fill-current")} />
          </button>
        </div>

        {/* Image */}
        <div className="aspect-square flex items-center justify-center mb-8 mt-12 bg-surface rounded-2xl p-6 group-hover:bg-secondary/80 transition-colors">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-md group-hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-6 text-xs">
            {displayVariant.storage && (
              <span className="px-2 py-1 bg-surface rounded text-muted-foreground font-medium">
                {displayVariant.storage}
              </span>
            )}
            <span className="px-2 py-1 bg-surface rounded text-muted-foreground font-medium flex items-center gap-1">
              <span className="w-4 h-4 text-warning"><Battery className="w-full h-full" /></span>
              {displayVariant.batteryHealth}%
            </span>
            <span className="px-2 py-1 bg-surface rounded text-muted-foreground font-medium">
              Cond {displayVariant.conditionScore}/10
            </span>
            {(displayVariant as any).cosmeticCondition && (
              <span className="px-2 py-1 bg-surface rounded text-muted-foreground font-medium truncate max-w-[140px]" title={(displayVariant as any).cosmeticCondition}>
                {(displayVariant as any).cosmeticCondition}
              </span>
            )}
          </div>
          
          <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
            <div>
              <div className="text-xs text-muted-foreground line-through mb-1">
                EGP {marketPrice.toLocaleString()}
              </div>
              <div className="text-lg font-bold text-foreground">
                EGP {lunexPrice.toLocaleString()}
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
