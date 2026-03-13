import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Menu, X, ArrowRight, User, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/store/use-cart";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Header() {
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleCart, items } = useCart();
  const { t, i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.mac', 'Mac'), href: "/mac" },
    { name: t('nav.ipad', 'iPad'), href: "/ipad" },
    { name: t('nav.iphone', 'iPhone'), href: "/iphone" },
    { name: t('nav.watch', 'Watch'), href: "/watch" },
    { name: t('header.compare', 'Compare'), href: "/compare" },
    { name: t('header.build', 'Build Device'), href: "/build" },
  ];

  return (
    <>
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
          <div className="flex items-center justify-between h-16">
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
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold tracking-tighter text-foreground hover:opacity-80 transition-opacity">
                LUNEX.
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-3 md:space-x-5 rtl:space-x-reverse">
              <form onSubmit={handleSearch} className="hidden md:flex relative items-center">
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder', "Search...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 bg-surface border border-border/60 rounded-full px-4 py-1.5 ltr:pl-10 rtl:pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <Search className="h-4 w-4 absolute ltr:left-3 rtl:right-3 text-muted-foreground" />
              </form>
              
              <button 
                onClick={toggleLanguage}
                className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1 text-sm font-medium"
                aria-label="Switch Language"
              >
                <Globe className="h-5 w-5" />
                <span className="hidden sm:inline">{i18n.language.startsWith('ar') ? 'En' : 'عربي'}</span>
              </button>

              <Link href="/account" className="text-foreground/80 hover:text-foreground transition-colors" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>
              
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
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
