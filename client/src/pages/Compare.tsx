import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { Search, Plus, X, ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";

// Helper to safely get nested variant data
const getBestVariant = (product: any) => {
  if (!product.variants || product.variants.length === 0) return null;
  return product.variants.reduce((prev: any, current: any) => 
    (prev.lunexPrice < current.lunexPrice) ? prev : current
  );
};

export default function ComparePage() {
  const { data: allProducts, isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  
  // Filter for search dropdown
  const searchResults = allProducts?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedProductIds.includes(p.id)
  ).slice(0, 5) || [];

  const selectedProducts = allProducts?.filter(p => selectedProductIds.includes(p.id)) || [];

  const handleAddProduct = (id: number) => {
    if (selectedProductIds.length < 4) {
      setSelectedProductIds([...selectedProductIds, id]);
      setSearchQuery("");
    }
  };

  const handleRemoveProduct = (id: number) => {
    setSelectedProductIds(selectedProductIds.filter(pid => pid !== id));
  };

  // Specs to compare row by row
  const comparisonRows = [
    { label: "Category", key: "category", format: (v: any) => <span className="capitalize">{v}</span> },
    { label: "Release Year", key: "releaseYear" },
    { label: "Starting Price", render: (p: any) => {
        const variant = getBestVariant(p);
        return variant ? `${variant.lunexPrice.toLocaleString()} EGP` : "N/A";
    }},
    { label: "Market Price", render: (p: any) => {
        const variant = getBestVariant(p);
        return variant ? <span className="line-through text-muted-foreground">{variant.marketPrice.toLocaleString()} EGP</span> : "N/A";
    }},
    { label: "Savings", render: (p: any) => {
        const variant = getBestVariant(p);
        if (!variant) return "N/A";
        const saved = variant.marketPrice - variant.lunexPrice;
        const percent = Math.round((saved / variant.marketPrice) * 100);
        return <span className="text-green-500 font-medium">{saved.toLocaleString()} EGP ({percent}%)</span>;
    }},
    { label: "Top Condition", render: (p: any) => {
        if (!p.variants) return "N/A";
        const maxCondition = Math.max(...p.variants.map((v: any) => v.conditionScore));
        return `${maxCondition}/10`;
    }},
    { label: "Max Battery", render: (p: any) => {
        if (!p.variants) return "N/A";
        // Only show battery for relevant devices
        if (['accessories', 'airpods'].includes(p.category)) return "N/A";
        const maxBatt = Math.max(...p.variants.map((v: any) => v.batteryHealth));
        return `${maxBatt}%`;
    }},
  ];

  return (
    <div className="min-h-screen bg-background pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Compare Devices
          </h1>
          <p className="text-lg text-muted-foreground">
            Select up to 4 devices to see their specs, prices, and conditions side-by-side to make the best choice.
          </p>
        </div>

        {/* Search & Add Bar */}
        {selectedProductIds.length < 4 && (
          <div className="relative max-w-md mx-auto mb-16 z-20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for a device to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-surface border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            
            {/* Search Dropdown */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddProduct(product.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/50 last:border-0"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg p-1 flex-shrink-0">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{product.category}</div>
                    </div>
                    <Plus className="w-5 h-5 text-primary" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comparison Table Grid */}
        {selectedProducts.length > 0 ? (
          <div className="overflow-x-auto pb-8">
            <div className="min-w-[800px]">
              
              {/* Product Headers */}
              <div className="flex mb-8">
                <div className="w-48 flex-shrink-0"></div> {/* Empty corner */}
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex-1 px-4 relative group text-center border-l border-border first:border-l-0">
                    <button 
                      onClick={() => handleRemoveProduct(product.id)}
                      className="absolute top-0 right-4 w-8 h-8 bg-surface rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors z-10 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="h-48 w-full bg-white rounded-2xl p-4 mb-6 relative">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <Link href={`/product/${product.slug}`}>
                      <div className="inline-flex cursor-pointer items-center text-primary text-sm font-medium hover:underline">
                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </Link>
                  </div>
                ))}
                
                {/* Empty slot placeholder */}
                {Array.from({ length: 4 - selectedProducts.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex-1 px-4 border-l border-border flex flex-col items-center justify-center opacity-50">
                    <div className="h-48 w-full border-2 border-dashed border-border rounded-2xl mb-6 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Empty Slot</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specs Rows */}
              <div className="bg-surface rounded-3xl border border-border overflow-hidden">
                {comparisonRows.map((row, i) => (
                  <div key={i} className="flex border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <div className="w-48 flex-shrink-0 p-6 font-semibold text-muted-foreground bg-muted/10 border-r border-border/50">
                      {row.label}
                    </div>
                    {selectedProducts.map((product) => (
                      <div key={`${product.id}-${row.label}`} className="flex-1 p-6 text-center border-r border-border/50 last:border-r-0 flex items-center justify-center">
                        {row.render 
                          ? row.render(product) 
                          : row.format 
                            // @ts-ignore
                            ? row.format(product[row.key]) 
                            // @ts-ignore
                            : product[row.key] || "—"
                        }
                      </div>
                    ))}
                    
                    {/* Empty Slots */}
                    {Array.from({ length: 4 - selectedProducts.length }).map((_, emptyIndex) => (
                      <div key={`empty-cell-${emptyIndex}`} className="flex-1 p-6 border-r border-border/50 last:border-r-0 flex items-center justify-center text-muted-foreground/30">
                        —
                      </div>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Devices Selected</h3>
            <p className="text-muted-foreground">Search for a device above and add it to start comparing.</p>
          </div>
        )}

      </div>
    </div>
  );
}
