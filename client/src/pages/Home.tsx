import { Link } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, Zap, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useProducts({ minCondition: 9 });

  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-6"
            >
              Pro power.<br />
              <span className="text-gradient">Refurbished right.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground mb-10"
            >
              Premium Apple devices professionally tested, guaranteed, and priced up to 40% less than retail in Egypt.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/shop">
                <button className="px-8 py-4 rounded-full bg-foreground text-background font-semibold text-lg hover:scale-105 transition-transform w-full sm:w-auto shadow-xl shadow-foreground/10">
                  Shop All Devices
                </button>
              </Link>
              <Link href="/how-lunex-works">
                <button className="px-8 py-4 rounded-full bg-surface text-foreground font-semibold text-lg hover:bg-secondary hover:scale-105 transition-all w-full sm:w-auto">
                  How Lunex Works
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Hero Background Image / Decor */}
        {/* landing page hero minimalist abstract tech */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1920&q=80" 
             alt="Hero background" 
             className="w-full h-full object-cover"
           />
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="border-y border-border bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Professionally Tested</h3>
              <p className="text-muted-foreground text-sm">Every device undergoes a strict 40-point inspection before it reaches you.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] flex items-center justify-center mb-6">
                <Coins className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unbeatable Value</h3>
              <p className="text-muted-foreground text-sm">Save up to 40% compared to brand new retail prices in Egypt.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] flex items-center justify-center mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Warranty Included</h3>
              <p className="text-muted-foreground text-sm">Buy with confidence with our standard 3-6 month hardware warranty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Pristine Condition.</h2>
              <p className="text-muted-foreground text-lg">Our highest graded devices, ready to ship.</p>
            </div>
            <Link href="/shop?minCondition=9">
              <button className="hidden md:flex items-center text-primary font-semibold hover:opacity-80 transition-opacity">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface animate-pulse h-[400px] rounded-[2rem]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop">
              <button className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium w-full flex items-center justify-center">
                View all pristine devices <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-surface rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { name: 'iPhone', image: 'https://images.unsplash.com/photo-1591337676887-a4b1f680c622?w=500&q=80', url: '/shop?category=iphone' },
              { name: 'Mac', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', url: '/shop?category=mac' },
              { name: 'iPad', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', url: '/shop?category=ipad' },
              { name: 'Watch', image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80', url: '/shop?category=watch' },
            ].map((cat) => (
              <Link key={cat.name} href={cat.url}>
                <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer block">
                  {/* Category Image */}
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dark Wash for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-80"></div>
                  
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-white text-2xl font-bold">{cat.name}</h3>
                    <div className="mt-2 flex items-center text-white/80 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                      Explore {cat.name} <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
