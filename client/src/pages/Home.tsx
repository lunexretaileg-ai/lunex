import { Link } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, BadgePercent, Battery, Truck, Star, Cpu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const WHY_ITEMS = [
  { Icon: BadgePercent, colorClass: "bg-transparent border border-white/20 text-white", lightClass: "bg-surface/10 text-foreground border border-border", key: "1" },
  { Icon: ShieldCheck,  colorClass: "bg-transparent border border-white/20 text-white", lightClass: "bg-surface/10 text-foreground border border-border", key: "2" },
  { Icon: Battery,      colorClass: "bg-transparent border border-white/20 text-white", lightClass: "bg-surface/10 text-foreground border border-border", key: "3" },
  { Icon: Star,         colorClass: "bg-transparent border border-white/20 text-white", lightClass: "bg-surface/10 text-foreground border border-border", key: "4" },
  { Icon: Truck,        colorClass: "bg-transparent border border-white/20 text-white", lightClass: "bg-surface/10 text-foreground border border-border", key: "5" },
];

const TRUST_ITEMS = [
  { Icon: Cpu,          color: "bg-transparent border border-border/50 text-foreground",  key: "1" },
  { Icon: BadgePercent, color: "bg-transparent border border-border/50 text-foreground", key: "2" },
  { Icon: ShieldCheck,  color: "bg-transparent border border-border/50 text-foreground", key: "3" },
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const { data: products, isLoading } = useProducts({ minCondition: 9 });

  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-0 min-h-[80vh] flex items-center">
        {/* Immersive Cover Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=2940&auto=format&fit=crop" 
            alt="Hero Cover" 
            className="w-full h-full object-cover opacity-[0.03] dark:opacity-10 pointer-events-none" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/50 pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <div className="text-left rtl:text-right pb-16 lg:pb-0">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold mb-8"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t("home.heroBadge")}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter text-foreground mb-6 leading-tight"
              >
                {t("home.heroTitle")}<br />
                <span className="text-gradient">{t("home.heroSubtitle")}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="text-lg text-muted-foreground mb-10 max-w-lg"
              >
                {t("home.heroDesc")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <Link href="/shop">
                  <button className="px-8 py-4 rounded-full bg-foreground text-background font-semibold text-lg hover:scale-105 transition-transform shadow-xl shadow-foreground/10">
                    {t("home.shopAll")}
                  </button>
                </Link>
                <Link href="/about-us">
                  <button className="px-8 py-4 rounded-full bg-surface text-foreground font-semibold text-lg hover:bg-secondary hover:scale-105 transition-all border border-border/50">
                    {t("home.learnMore")}
                  </button>
                </Link>
              </motion.div>

              {/* Mini trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-12 flex flex-wrap gap-6 text-sm text-muted-foreground"
              >
                {[
                  { Icon: ShieldCheck, text: isAr ? "ضمان 3-6 أشهر" : "3–6 Month Warranty" },
                  { Icon: BadgePercent, text: isAr ? "أسعار أقل بـ 40%" : "40% Below Retail" },
                  { Icon: Truck, text: isAr ? "توصيل لكل مصر" : "Nationwide Delivery" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" strokeWidth={1.8} />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Device mockup cover */}
            <div className="relative flex items-end justify-center lg:justify-end">
              {/* Glow behind device */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />
              </div>

              {/* Floating device image */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-xs sm:max-w-sm lg:max-w-md"
              >
                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute top-8 -left-6 bg-surface/80 backdrop-blur-md shadow-xl rounded-2xl px-4 py-3 flex items-center gap-2.5 z-20 border border-border/50"
                >
                  <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground text-xs font-bold">✓</div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{isAr ? "8/8 اختبار ناجح" : "8/8 Tests Passed"}</p>
                    <p className="text-[10px] text-muted-foreground">{isAr ? "مفحوص احترافياً" : "Professionally Inspected"}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                  className="absolute bottom-16 -right-6 bg-surface/80 backdrop-blur-md shadow-xl rounded-2xl px-4 py-3 flex items-center gap-2.5 z-20 border border-border/50"
                >
                  <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
                    <BadgePercent className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">-40%</p>
                    <p className="text-[10px] text-muted-foreground">{isAr ? "من سعر السوق" : "Below Market Price"}</p>
                  </div>
                </motion.div>

                {/* Main device image */}
                <motion.img
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&fit=crop&auto=format"
                  alt="iPhone 15 Pro"
                  className="w-full object-contain drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.15))" }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Pillars ──────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-surface/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {TRUST_ITEMS.map(({ Icon, color, key }) => (
              <motion.div key={key} {...fadeUp(Number(key) * 0.08)} className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center mb-5 hover:bg-surface/50 transition-colors`}>
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold mb-2">{t(`home.trust${key}Title`)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{t(`home.trust${key}Desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <motion.div {...fadeUp()}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{t("home.featuredTitle")}</h2>
              <p className="text-muted-foreground text-lg">{t("home.featuredDesc")}</p>
            </motion.div>
            <Link href="/shop?minCondition=9">
              <button className="hidden md:flex items-center gap-1.5 text-primary font-semibold hover:opacity-80 transition-opacity">
                {t("home.viewAll")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface animate-pulse h-[400px] rounded-[2rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <motion.div key={product.id} {...fadeUp(i * 0.1)}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/shop">
              <button className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium w-full flex items-center justify-center gap-2">
                {t("home.viewAll")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Lunex ─────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-950 text-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 {...fadeUp()} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("home.whyTitle")}
            </motion.h2>
            <motion.p {...fadeUp(0.08)} className="text-white/60 text-lg max-w-xl mx-auto">
              {t("home.whyDesc")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {WHY_ITEMS.map(({ Icon, colorClass, lightClass, key }, i) => (
              <motion.div
                key={key}
                {...fadeUp(i * 0.07)}
                className="group bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{t(`home.why${key}Title`)}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{t(`home.why${key}Desc`)}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.3)} className="mt-12 text-center">
            <Link href="/about-us">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
                {t("home.whyLearnMore")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <section className="py-24 bg-surface rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp()} className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
            {t("home.shopByCategory")}
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "iPhone", image: "https://images.unsplash.com/photo-1591337676887-a4b1f680c622?w=500&q=80", url: "/shop?category=iphone" },
              { name: "Mac",    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", url: "/shop?category=mac" },
              { name: "iPad",   image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80", url: "/shop?category=ipad" },
              { name: "Watch",  image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80", url: "/shop?category=watch" },
            ].map((cat, i) => (
              <motion.div key={cat.name} {...fadeUp(i * 0.07)}>
                <Link href={cat.url}>
                  <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer">
                    <img
                      src={cat.image}
                      alt={t(`nav.${cat.name.toLowerCase()}`, cat.name)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="text-white text-2xl font-bold">{t(`nav.${cat.name.toLowerCase()}`, cat.name)}</h3>
                      <div className="mt-2 flex items-center text-white/80 text-sm font-medium opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                        {t("home.explore")} <ArrowRight className="w-4 h-4 ltr:ml-1 rtl:mr-1 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
