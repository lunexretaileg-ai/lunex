import { useState, useMemo } from "react";
import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/store/use-cart";
import { Check, ShieldCheck, Battery, Truck, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

// Fetch reviews function
const fetchReviews = async (productId: number) => {
  const res = await fetch(`/api/products/${productId}/reviews`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

export default function ProductDetails() {
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
      <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
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

  return (
    <div className="bg-background min-h-screen pt-8 pb-32">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center text-sm text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer">Shop</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="hover:text-foreground cursor-pointer capitalize">{product.category}</span>
        <ChevronRight className="w-4 h-4 mx-1" />
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
              <div className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] mb-4 border border-[hsl(var(--success))]/20">
                {product.deviceType === 'refurbished' ? 'أصلي استيراد خارج' : 'تجميع مصنع صيني'}
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
                    وفر {discountPercent}%
                  </span>
                )}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 cursor-text">
                <span className="line-through">سعر السوق: EGP {marketPrice.toLocaleString()}</span>
                <span>•</span>
                <span className="text-sm font-medium text-foreground">شحن مجاني</span>
              </div>
            </div>

            {/* Storage Selection */}
            {storageOptions.length > 0 && (
              <div className="mb-8 cursor-default">
                <h3 className="text-lg font-bold mb-4">Storage. <span className="text-muted-foreground font-normal">How much space do you need?</span></h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {storageOptions.map((storage) => {
                    const isSelected = selectedStorage === storage;
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
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colorOptions.length > 0 && (
              <div className="mb-10 cursor-default">
                <h3 className="text-lg font-bold mb-4">Color. <span className="text-muted-foreground font-normal">Pick your favorite.</span></h3>
                <div className="flex flex-wrap gap-4">
                  {colorOptions.map((color) => {
                    const isSelected = selectedColor === color;
                    // Simple color mapping for UI dots
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
                    )
                  })}
                </div>
              </div>
            )}

            {/* Status Indicators (Read-only) */}
            <div className="grid grid-cols-2 gap-4 mb-10 cursor-default">
              <div className="bg-surface p-4 rounded-2xl flex items-start gap-4 border border-border/50">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm border border-border/50">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">حالة الجهاز من الخارج</div>
                  <div className="font-bold text-xl">{currentVariant.conditionScore}<span className="text-sm font-normal text-muted-foreground">/10</span></div>
                  <div className="text-xs text-[hsl(var(--success))] font-medium mt-1 cursor-text">ممتاز جداً - كسر زيرو</div>
                </div>
              </div>
              <div className="bg-surface p-4 rounded-2xl flex items-start gap-4 border border-border/50">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm border border-border/50">
                  <Battery className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">صحة البطارية</div>
                  <div className="font-bold text-xl">{currentVariant.batteryHealth}%</div>
                  <div className="text-xs text-[hsl(var(--success))] font-medium mt-1 cursor-text">بطارية أصلية ممتازة</div>
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-8 border-t border-border mt-auto cursor-default">
              <button 
                onClick={handleAddToCart}
                disabled={!currentVariant.isAvailable}
                className={`w-full py-5 rounded-full text-xl font-bold shadow-xl transition-all duration-300 ${
                  currentVariant.isAvailable 
                    ? 'bg-primary text-primary-foreground shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {currentVariant.isAvailable ? 'ضيف للسلة' : 'نفذت الكمية'}
              </button>
              
              <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground cursor-text">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-foreground flex-shrink-0" /> 
                  <span>شحن سريع لجميع المحافظات خلال 24 لـ 48 ساعة.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-foreground flex-shrink-0" /> 
                  <span>معتمد مع ضمان استبدال مجاني لمدة 30 يوم وفترة ضمان 6 شهور.</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-border pt-16 mt-16 cursor-default" dir="rtl">
          <h2 className="text-3xl font-bold mb-10 text-foreground cursor-text">تقييمات وآراء العملاء</h2>
          
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
                        <Check className="w-3 h-3" /> مشتري موثق
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface/50 rounded-3xl border border-border border-dashed">
              <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground cursor-text">لا توجد تقييمات لهذا المنتج حتى الآن. كن أول من يضيف تقييماً!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
