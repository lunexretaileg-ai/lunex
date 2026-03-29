import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Menu, X, ArrowRight, User, Globe, Heart, ChevronDown, Smartphone, Laptop, Tablet, Watch, Headphones } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/store/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useWishlistDrawer } from "@/store/use-wishlist-drawer";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SearchModal } from "@/components/SearchModal";

const SHOP_CATEGORIES = [
  { name: "iPhone",   href: "/shop?category=iphone",  icon: Smartphone, desc: "أجهزة iPhone بجميع الإصدارات" },
  { name: "Mac",      href: "/shop?category=mac",     icon: Laptop,      desc: "MacBook Air & Pro" },
  { name: "iPad",     href: "/shop?category=ipad",    icon: Tablet,      desc: "iPad وiPad Pro" },
  { name: "Watch",    href: "/shop?category=watch",   icon: Watch,       desc: "Apple Watch Series" },
  { name: "AirPods",  href: "/shop?category=airpods", icon: Headphones,  desc: "AirPods وAirPods Pro" },
];

export function Header() {
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toggleCart, items } = useCart();
  const { wishlistItems } = useWishlist();
  const { toggleWishlist } = useWishlistDrawer();
  const { t, i18n } = useTranslation();
  const shopDropRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close shop dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shopDropRef.current && !shopDropRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const mobileNavLinks = [
    { name: "كل المنتجات", href: "/shop" },
    ...SHOP_CATEGORIES.map(c => ({ name: c.name, href: c.href })),
    { name: "قارن الأجهزة", href: "/compare" },
    { name: "ابني جهازك", href: "/build" },
    { name: "عن Lunex", href: "/about-us" },
  ];

  return (
    <>
      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top Banner */}
      <div className="bg-foreground text-background py-2 px-4 text-xs font-medium text-center flex items-center justify-center gap-2">
        <span>{t('home.heroSubtitle', 'Get up to 40% off retail on premium refurbished Apple devices.')}</span>
        <Link href="/shop" className="underline hover:text-primary-foreground transition-colors inline-flex items-center">
          {t('header.shop', 'Shop now')} <ArrowRight className="w-3 h-3 ml-1 rtl:rotate-180" />
        </Link>
      </div>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? "glass-panel" : "bg-background"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground hover:text-primary transition-colors p-2 -ml-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 z-10">
              <Link href="/" className="text-xl font-bold tracking-tighter text-foreground hover:opacity-80 transition-opacity">
                LUNEX.
              </Link>
            </div>

            {/* Desktop Navigation — centered */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7">
              {/* Shop Dropdown */}
              <div ref={shopDropRef} className="relative">
                <button
                  onClick={() => setShopDropdownOpen(v => !v)}
                  className="flex items-center gap-1 text-sm font-medium text-foreground/75 hover:text-foreground transition-colors"
                >
                  Shop
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${shopDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {shopDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {SHOP_CATEGORIES.map(cat => {
                          const Icon = cat.icon;
                          return (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              onClick={() => setShopDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-9 h-9 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors shrink-0">
                                <Icon className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                                <p className="text-xs text-gray-500">{cat.desc}</p>
                              </div>
                            </Link>
                          );
                        })}
                        <div className="mt-1 pt-2 border-t border-gray-100">
                          <Link
                            href="/shop"
                            onClick={() => setShopDropdownOpen(false)}
                            className="flex items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 py-2"
                          >
                            كل المنتجات <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/compare" className="text-sm font-medium text-foreground/75 hover:text-foreground transition-colors">
                Compare
              </Link>
              <Link href="/build" className="text-sm font-medium text-foreground/75 hover:text-foreground transition-colors">
                Build
              </Link>
              <Link href="/about-us" className="text-sm font-medium text-foreground/75 hover:text-foreground transition-colors">
                عن Lunex
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-3 md:space-x-4 rtl:space-x-reverse">
              {/* Live Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-foreground/80 hover:text-foreground transition-colors p-1"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={toggleLanguage}
                className="text-foreground/80 hover:text-foreground transition-colors hidden sm:flex items-center gap-1 text-sm font-medium"
                aria-label="Switch Language"
              >
                <Globe className="h-5 w-5" />
                <span className="hidden sm:inline">{i18n.language.startsWith('ar') ? 'En' : 'عربي'}</span>
              </button>

              <Link href="/account" className="text-foreground/80 hover:text-foreground transition-colors" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>

              {/* Wishlist */}
              <button
                className="text-foreground/80 hover:text-red-500 transition-colors relative"
                onClick={toggleWishlist}
                aria-label="Wishlist"
              >
                <Heart className={`h-5 w-5 transition-colors ${wishlistItems.length > 0 ? 'text-red-500 fill-current' : ''}`} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                className="text-foreground/80 hover:text-foreground transition-colors relative"
                onClick={toggleCart}
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-[104px] z-30 bg-background border-b border-border p-4 shadow-xl"
          >
            <div className="flex flex-col space-y-1">
              {mobileNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-foreground py-3 px-3 rounded-xl hover:bg-gray-50 border-b border-border/30 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
              {/* Mobile search trigger */}
              <button
                onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                className="flex items-center gap-2 text-base font-medium text-blue-600 py-3 px-3 rounded-xl hover:bg-blue-50 mt-1"
              >
                <Search className="w-4 h-4" />
                بحث
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
