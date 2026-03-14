import { useState, useMemo } from "react";
import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/store/use-cart";
import { Check, ShieldCheck, Battery, Truck, ChevronRight, Star, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getDeviceTypeBadge } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

// ── Real Photos gallery data per category ─────────────────────────────────────
const REAL_PHOTOS: Record<string, string[]> = {
  iphone: [
    "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574755393849-623942496936?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop",
  ],
  mac: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&auto=format&fit=crop",
  ],
  ipad: [
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589739900266-43073e7bc3b0?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&auto=format&fit=crop",
  ],
  watch: [
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590736969955-71cc94d9dbe1?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop",
  ],
  airpods: [
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629367494173-c78a56567877?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=600&auto=format&fit=crop",
  ],
};

function RealPhotosSection({ product }: { product: any }) {
  const photos = REAL_PHOTOS[product.category] ?? REAL_PHOTOS["iphone"];
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="border-t border-border pt-16 mb-20">
      <div className="flex items-center gap-3 mb-8">
        <ImageIcon className="w-6 h-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Real Device Photos</h2>
        <span className="text-xs text-muted-foreground bg-surface border border-border rounded-full px-3 py-1">
          Representative samples
        </span>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {photos.map((url, i) => (
          <motion.button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative overflow-hidden rounded-2xl aspect-square border-2 transition-all duration-200",
              selected === i ? "border-primary shadow-xl shadow-primary/10" : "border-border/40 hover:border-border"
            )}
          >
            <img
              src={url}
              alt={`${product.name} photo ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            {selected === i && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Lightbox expanded view */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-4 rounded-3xl overflow-hidden border border-primary/20 bg-surface"
          >
            <img
              src={photos[selected]}
              alt={`${product.name} photo expanded`}
              className="w-full max-h-[480px] object-cover"
            />
            <p className="text-xs text-muted-foreground text-center py-3">
              Photo {selected + 1} of {photos.length} — Photos are representative of device condition and category.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-xs text-muted-foreground/70 leading-relaxed bg-surface/60 border border-border/40 rounded-2xl px-5 py-3">
        📸 <strong>Note:</strong> These photos are representative samples from our actual inventory of {product.category.charAt(0).toUpperCase() + product.category.slice(1)} devices.
        Each device is individually inspected and photographed before shipping. Actual device photos will be provided upon request.
      </p>
    </div>
  );
}


// Fetch reviews function
const fetchReviews = async (productId: number) => {
  const res = await fetch(`/api/products/${productId}/reviews`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

// Condition label helper
function getConditionLabel(score: number) {
  if (score >= 10) return { label: "Pristine / Like New", color: "text-emerald-500" };
  if (score >= 9)  return { label: "Excellent", color: "text-emerald-400" };
  if (score >= 8)  return { label: "Very Good", color: "text-sky-400" };
  if (score >= 7)  return { label: "Good", color: "text-amber-400" };
  return { label: "Fair", color: "text-zinc-400" };
}

export default function ProductDetails() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";
  
  const { data: product, isLoading: productLoading } = useProduct(slug);
  const { addItem } = useCart();

  // Fetch reviews when product is available
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => fetchReviews(product!.id),
    enabled: !!product?.id
  });

  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Initialize selections once data loads
  useMemo(() => {
    if (product && product.variants.length > 0 && !selectedStorage && !selectedColor) {
      setSelectedStorage(product.variants[0].storage);
      setSelectedColor(product.variants[0].color);
    }
  }, [product]);

  if (productLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!product) {
    return <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">{t('product.notFound', 'Product Not Found')}</h1>
    </div>;
  }

  // Derive unique options
  const storageOptions = Array.from(new Set(product.variants.map(v => v.storage).filter(Boolean))) as string[];
  const colorOptions = Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))) as string[];

  // Find the exact variant based on selections
  const currentVariant = product.variants.find(
    v => v.storage === selectedStorage && v.color === selectedColor
  ) || product.variants[0];

  const lunexPrice = Number(currentVariant.lunexPrice);
  const marketPrice = Number(currentVariant.marketPrice);
  const discountPercent = Math.round(((marketPrice - lunexPrice) / marketPrice) * 100);

  const { label: typeLabel, className: typeClass } = getDeviceTypeBadge(product.deviceType);
  const conditionInfo = getConditionLabel(currentVariant.conditionScore);

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${currentVariant.id}`,
      productId: product.id,
      variantId: currentVariant.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: lunexPrice,
      quantity: 1,
      storage: currentVariant.storage,
      color: currentVariant.color,
      conditionScore: currentVariant.conditionScore,
      batteryHealth: currentVariant.batteryHealth,
    });
  };

  // Combine shared specs (variantId = null) and variant-specific specs (variantId = currentVariant.id)
  const allSpecs = (product as any).specs ?? [];
  const specsMap = new Map<string, any>();
  
  // 1. Add shared specs first
  allSpecs.filter((s: any) => s.variantId === null).forEach((s: any) => {
    specsMap.set(s.specKey, s);
  });
  
  // 2. Override/add variant-specific specs
  allSpecs.filter((s: any) => s.variantId === currentVariant.id).forEach((s: any) => {
    specsMap.set(s.specKey, s);
  });

  // Convert map back to array and sort by sortOrder
  const specs = Array.from(specsMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="bg-background min-h-screen pt-8 pb-32">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center text-sm text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer">{t('product.shop', 'Shop')}</span>
        <ChevronRight className="w-4 h-4 mx-1 rtl:rotate-180" />
        <span className="hover:text-foreground cursor-pointer capitalize">{t(`nav.${product.category}`, product.category)}</span>
        <ChevronRight className="w-4 h-4 mx-1 rtl:rotate-180" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24 cursor-default">
          
          {/* Left Column: Image Gallery */}
          <div className="sticky top-24 self-start">
            <div className="bg-surface rounded-[2rem] p-12 aspect-square flex items-center justify-center border border-border/50 mb-4 cursor-default">
              <motion.img 
                key={selectedColor}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl select-none"
              />
            </div>
            {/* Thumbnails placeholder */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              <div className="w-20 h-20 rounded-xl bg-surface border-2 border-primary p-2 flex-shrink-0 cursor-pointer">
                <img src={product.imageUrl} className="w-full h-full object-contain mix-blend-multiply select-none" />
              </div>
            </div>
          </div>

          {/* Right Column: Configurator */}
          <div className="flex flex-col">
            <div className="mb-8">
              {/* Device Type Badge */}
              <div className={cn(
                "inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full mb-4",
                typeClass
              )}>
                {typeLabel}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground cursor-text">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed cursor-text">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="mb-10 bg-surface/80 p-6 rounded-3xl border border-border">
              <div className="flex items-center gap-4 mb-2 cursor-text">
                <span className="text-4xl font-extrabold text-foreground tracking-tight">EGP {lunexPrice.toLocaleString()}</span>
                {discountPercent > 0 && (
                  <span className="px-3 py-1 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] text-sm font-bold rounded-full border border-[hsl(var(--success))]/20">
                    {t('product.save', 'Save {{discount}}%', { discount: discountPercent })}
                  </span>
                )}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 cursor-text">
                <span className="line-through">{t('product.marketPrice', 'Market Price')}: EGP {marketPrice.toLocaleString()}</span>
                <span>•</span>
                <span className="text-sm font-medium text-foreground">{t('product.freeShipping', 'Free Shipping')}</span>
              </div>
            </div>

            {/* Storage Selection */}
            {storageOptions.length > 0 && (
              <div className="mb-8 cursor-default">
                <h3 className="text-lg font-bold mb-4">{t('product.storage', 'Storage.')} <span className="text-muted-foreground font-normal">{t('product.howMuchSpace', 'How much space do you need?')}</span></h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {storageOptions.map((storage) => {
                    const isSelected = selectedStorage === storage;
                    // Find the variant for this storage (use current color or first available)
                    const storageVariant = product.variants.find(v => v.storage === storage && v.color === selectedColor)
                      || product.variants.find(v => v.storage === storage);
                    const storagePrice = storageVariant ? Number(storageVariant.lunexPrice) : null;
                    return (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`py-4 px-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                          isSelected 
                            ? 'border-primary bg-primary/5 text-foreground shadow-sm' 
                            : 'border-border/60 hover:border-foreground/30 bg-card hover:bg-surface'
                        }`}
                      >
                        <span className="block text-lg font-semibold">{storage}</span>
                        {storagePrice && (
                          <span className="block text-xs text-muted-foreground mt-1">EGP {storagePrice.toLocaleString()}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colorOptions.length > 0 && (
              <div className="mb-10 cursor-default">
                <h3 className="text-lg font-bold mb-4">{t('product.color', 'Color.')} <span className="text-muted-foreground font-normal">{t('product.pickFavorite', 'Pick your favorite.')}</span></h3>
                <div className="flex flex-wrap gap-4">
                  {colorOptions.map((color) => {
                    const isSelected = selectedColor === color;
                    const cssColor = color.toLowerCase().replace(' ', '');
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 ${
                          isSelected ? 'bg-surface scale-105' : 'hover:bg-surface/50 hover:scale-105'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full border-2 p-0.5 ${isSelected ? 'border-primary' : 'border-transparent'}`}>
                          <div 
                            className="w-full h-full rounded-full shadow-inner border border-border/20" 
                            style={{ backgroundColor: ['space black', 'midnight', 'graphite'].includes(cssColor) ? '#2C2C2E' : cssColor }} 
                          />
                        </div>
                        <span className={`text-xs ${isSelected ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Condition & Battery Status */}
            <div className="grid grid-cols-2 gap-4 mb-6 cursor-default">
              <div className="bg-surface p-4 rounded-2xl flex items-start gap-4 border border-border/50">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm border border-border/50">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{t('product.condition', 'Condition Score')}</div>
                  <div className="font-bold text-xl">{currentVariant.conditionScore}<span className="text-sm font-normal text-muted-foreground">/10</span></div>
                  <div className={cn("text-xs font-medium mt-1 cursor-text", conditionInfo.color)}>{conditionInfo.label}</div>
                </div>
              </div>
              <div className="bg-surface p-4 rounded-2xl flex items-start gap-4 border border-border/50">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm border border-border/50">
                  <Battery className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{t('product.batteryHealth', 'Battery Health')}</div>
                  <div className="font-bold text-xl">{currentVariant.batteryHealth}%</div>
                  <div className={cn("text-xs font-medium mt-1 cursor-text", 
                    currentVariant.batteryHealth >= 90 ? "text-emerald-500" : 
                    currentVariant.batteryHealth >= 80 ? "text-amber-400" : "text-zinc-400"
                  )}>
                    {currentVariant.batteryHealth >= 90 ? "Original Superior Battery" : 
                     currentVariant.batteryHealth >= 80 ? "Good Battery Life" : "Acceptable"}
                  </div>
                </div>
              </div>
            </div>

            {/* Cosmetic Condition */}
            {(currentVariant as any).cosmeticCondition && (
              <div className="mb-6 bg-surface/60 border border-border/50 rounded-2xl p-4 text-sm text-muted-foreground cursor-text">
                <span className="font-semibold text-foreground mr-2">Cosmetic:</span>
                {(currentVariant as any).cosmeticCondition}
              </div>
            )}

            {/* Add to Cart CTA */}
            <div className="pt-8 border-t border-border mt-auto cursor-default">
              <button 
                onClick={handleAddToCart}
                disabled={!currentVariant.isAvailable}
                className={`w-full py-5 rounded-full text-xl font-bold shadow-xl transition-all duration-300 flex items-center justify-center ${
                  currentVariant.isAvailable 
                    ? 'bg-primary text-primary-foreground shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {currentVariant.isAvailable ? t('product.addToCart', 'Add to Cart') : t('product.outOfStock', 'Out of Stock')}
              </button>
              
              <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground cursor-text">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-foreground flex-shrink-0" /> 
                  <span>{t('product.shippingDesc', 'Fast shipping to all governorates within 24-48 hours.')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-foreground flex-shrink-0" /> 
                  <span>{t('product.warrantyDesc', 'Certified with 30-day free replacement and 6-month warranty.')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================= */}
        {/* Specs & Variants Table Section                           */}
        {/* ======================================================= */}
        <div className="border-t border-border pt-16 mt-4 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Technical Specs */}
            {specs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('product.specs', 'Technical Specs')}</h2>
                <div className="bg-surface rounded-3xl border border-border/50 overflow-hidden">
                  {specs.map((spec: any, i: number) => (
                    <div
                      key={spec.id}
                      className={cn(
                        "flex items-start gap-4 px-6 py-4",
                        i !== specs.length - 1 && "border-b border-border/40"
                      )}
                    >
                      <span className="text-sm text-muted-foreground w-32 flex-shrink-0 pt-0.5">{spec.specKey}</span>
                      <span className="text-sm font-medium text-foreground">{spec.specValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Variants Table */}
            {product.variants.length > 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('product.allVariants', 'Available Variants')}</h2>
                <div className="bg-surface rounded-3xl border border-border/50 overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-4 px-6 py-3 bg-background/50 border-b border-border/40">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Storage</span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Color</span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cond</span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Price</span>
                  </div>
                  {product.variants.map((variant, i) => {
                    const isCurrentVariant = variant.id === currentVariant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => {
                          if (variant.storage) setSelectedStorage(variant.storage);
                          if (variant.color) setSelectedColor(variant.color);
                        }}
                        className={cn(
                          "w-full grid grid-cols-4 px-6 py-4 text-left transition-colors",
                          i !== product.variants.length - 1 && "border-b border-border/30",
                          isCurrentVariant
                            ? "bg-primary/5 border-l-2 border-l-primary"
                            : "hover:bg-background/60"
                        )}
                      >
                        <span className={cn("text-sm font-medium", isCurrentVariant ? "text-primary" : "text-foreground")}>
                          {variant.storage ?? "—"}
                        </span>
                        <span className="text-sm text-muted-foreground">{variant.color ?? "—"}</span>
                        <span className="text-sm text-muted-foreground">{variant.conditionScore}/10</span>
                        <span className={cn("text-sm font-bold text-right", isCurrentVariant ? "text-primary" : "text-foreground")}>
                          EGP {Number(variant.lunexPrice).toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================= */}
        {/* Real Device Photos Section                               */}
        {/* ======================================================= */}
        <RealPhotosSection product={product} />

        {/* Reviews Section */}
        <div className="border-t border-border pt-16 cursor-default">
          <h2 className="text-3xl font-bold mb-10 text-foreground cursor-text">{t('product.reviews', 'Customer Reviews')}</h2>
          
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review: any) => (
                <div key={review.id} className="bg-surface border border-border/50 p-6 rounded-3xl flex flex-col hover:border-border transition-colors">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-[hsl(var(--success))] text-[hsl(var(--success))]' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground cursor-text">{review.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed cursor-text">{review.body}</p>
                  
                  <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
                    <div className="font-medium text-sm text-foreground cursor-text">{review.reviewerName}</div>
                    {review.isVerifiedPurchase && (
                      <div className="flex items-center gap-1 text-xs text-[hsl(var(--success))] font-medium cursor-text">
                        <Check className="w-3 h-3" /> {t('product.verifiedBuyer', 'Verified Buyer')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface/50 rounded-3xl border border-border border-dashed">
              <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground cursor-text">{t('product.noReviews', 'No reviews for this product yet. Be the first to review!')}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
