import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Filter, SlidersHorizontal, Search } from "lucide-react";

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
  heroImage: string;
}

export default function CategoryPage({ category, title, description, heroImage }: CategoryPageProps) {
  const [minCondition, setMinCondition] = useState<number>(7);
  const [deviceType, setDeviceType] = useState<string>('');
  
  const { data: products, isLoading, error } = useProducts({
    category,
    minCondition: minCondition,
    deviceType: deviceType || undefined,
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Category Hero */}
      <div className="relative w-full h-[300px] md:h-[400px] mb-12 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {title}
          </h1>
          <p className="text-lg text-white/80">
            {description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <div className="hidden md:block w-64 flex-shrink-0 space-y-10 pr-8 border-r border-border">
            {/* Condition Filter */}
            <div>
              <h3 className="font-bold mb-4 text-sm tracking-wider uppercase text-muted-foreground flex justify-between">
                Min Condition 
                <span className="text-primary">{minCondition}/10</span>
              </h3>
              <input 
                type="range" 
                min="7" 
                max="10" 
                step="1"
                value={minCondition}
                onChange={(e) => setMinCondition(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Good (7)</span>
                <span>Pristine (10)</span>
              </div>
            </div>

            {/* Device Type Filter */}
            <div>
              <h3 className="font-bold mb-4 text-sm tracking-wider uppercase text-muted-foreground">Type</h3>
              <div className="space-y-3">
                {[
                  { id: '', name: 'Any' },
                  { id: 'refurbished', name: 'Refurbished' },
                  { id: 'assembled', name: 'Assembled' },
                ].map((t) => (
                  <label key={t.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="deviceType"
                      checked={deviceType === t.id}
                      onChange={() => setDeviceType(t.id)}
                      className="w-4 h-4 accent-primary border-border"
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {t.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-surface animate-pulse h-[400px] rounded-[2rem]"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-surface rounded-[2rem]">
                <p className="text-destructive font-semibold">Failed to load {title}.</p>
              </div>
            ) : products && products.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-muted-foreground">Showing {products.length} {products.length === 1 ? 'device' : 'devices'}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-32 bg-surface rounded-[2rem] border border-border/50">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No devices found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  We couldn't find any {title} matching your current filters.
                </p>
                <button 
                  onClick={() => { setMinCondition(7); setDeviceType(''); }}
                  className="px-6 py-2 bg-foreground text-background font-medium rounded-full"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
