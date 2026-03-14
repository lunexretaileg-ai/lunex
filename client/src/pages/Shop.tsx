import { useState, useEffect, useMemo } from "react";
import { useSearch } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import {
  SlidersHorizontal, Search, X, ChevronDown, ChevronUp,
  Sparkles, PackageOpen, Wrench, Cpu, Clock,
  Smartphone, Laptop, Tablet, Watch, Headphones, LayoutGrid,
  ArrowUpDown, ArrowDown, ArrowUp, Star, Battery
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ── Filter Config ─────────────────────────────────────────────────────────────
const DEVICE_TYPES = [
  {
    id: "", label: "All Types",
    icon: LayoutGrid,
    color: "text-foreground",
    bg: "bg-surface",
    desc: "Show all device conditions",
  },
  {
    id: "new", label: "New",
    icon: Sparkles,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    desc: "Factory sealed, never used",
  },
  {
    id: "open_box", label: "Open Box",
    icon: PackageOpen,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    desc: "Opened but barely used",
  },
  {
    id: "refurbished", label: "Refurbished",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    desc: "Professionally restored",
  },
  {
    id: "assembled", label: "Assembled",
    icon: Cpu,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    desc: "Rebuilt with original parts",
  },
  {
    id: "used", label: "Used",
    icon: Clock,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    desc: "Pre-owned device",
  },
];

const CATEGORIES = [
  { id: "",        name: "All Devices", icon: LayoutGrid },
  { id: "iphone",  name: "iPhone",      icon: Smartphone },
  { id: "mac",     name: "Mac",         icon: Laptop },
  { id: "ipad",    name: "iPad",        icon: Tablet },
  { id: "watch",   name: "Watch",       icon: Watch },
  { id: "airpods", name: "AirPods",     icon: Headphones },
];

const SORT_OPTIONS = [
  { id: "newest",     label: "Newest First",        icon: ArrowUpDown },
  { id: "price_asc",  label: "Price: Low → High",   icon: ArrowUp },
  { id: "price_desc", label: "Price: High → Low",   icon: ArrowDown },
  { id: "condition",  label: "Best Condition",       icon: Star },
];


// ── FilterSection accordion sub-component ────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 pb-5 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1 mb-3 group"
      >
        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Shop Component ───────────────────────────────────────────────────────
export default function Shop() {
  const { t } = useTranslation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  // --- Filter state ---
  const [category, setCategory]       = useState(searchParams.get("category") || "");
  const [deviceType, setDeviceType]   = useState(searchParams.get("type") || "");
  const [minCondition, setMinCondition] = useState(7);
  const [minBattery, setMinBattery]   = useState(0);
  const [sortBy, setSortBy]           = useState("newest");
  const [search, setSearch]           = useState("");
  const [mobileOpen, setMobileOpen]   = useState(false);

  // Sync category from URL
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setDeviceType(searchParams.get("type") || "");
  }, [searchString]);

  // Fetch ALL products (no server-side filter for device type — we do it client-side for reliability)
  const { data: allProducts = [], isLoading, error } = useProducts({
    category: category || undefined,
    minCondition,
  });

  // ── Client-side filtering + sorting ─────────────────────────────────────────
  const products = useMemo(() => {
    let result = [...allProducts];

    // Filter by device type (client-side to ensure it always works)
    if (deviceType) {
      result = result.filter(p => p.deviceType === deviceType);
    }

    // Filter by battery health
    if (minBattery > 0) {
      result = result.filter(p =>
        p.variants.some(v => v.batteryHealth >= minBattery)
      );
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      const aVariant = a.variants[0];
      const bVariant = b.variants[0];
      if (sortBy === "price_asc")  return Number(aVariant?.lunexPrice) - Number(bVariant?.lunexPrice);
      if (sortBy === "price_desc") return Number(bVariant?.lunexPrice) - Number(aVariant?.lunexPrice);
      if (sortBy === "condition")  return (bVariant?.conditionScore ?? 0) - (aVariant?.conditionScore ?? 0);
      return 0; // newest — keep server order
    });

    return result;
  }, [allProducts, deviceType, minBattery, search, sortBy]);

  const activeFilterCount = [
    category !== "",
    deviceType !== "",
    minCondition > 7,
    minBattery > 0,
    search.trim() !== "",
  ].filter(Boolean).length;

  const clearAll = () => {
    setCategory(""); setDeviceType(""); setMinCondition(7);
    setMinBattery(0); setSearch(""); setSortBy("newest");
  };

  // ── Sidebar component ─────────────────────────────────────────────────────
  const Sidebar = () => (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1">
          {CATEGORIES.map(c => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  category === c.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-surface text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Device Type */}
      <FilterSection title="Device Condition">
        <div className="space-y-2">
          {DEVICE_TYPES.map(type => {
            const Icon = type.icon;
            const isActive = deviceType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setDeviceType(type.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all border",
                  isActive
                    ? `border-current/20 ${type.bg}`
                    : "border-transparent hover:bg-surface"
                )}
              >
                {/* Icon pill */}
                <span className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                  isActive ? type.bg : "bg-surface",
                  type.color
                )}>
                  <Icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-semibold truncate", isActive ? type.color : "text-foreground")}>
                    {type.label}
                  </div>
                  {type.desc && (
                    <div className="text-xs text-muted-foreground truncate">{type.desc}</div>
                  )}
                </div>
                {isActive && (
                  <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0",
                    type.id === "new" ? "bg-emerald-400" :
                    type.id === "open_box" ? "bg-sky-400" :
                    type.id === "refurbished" ? "bg-amber-400" :
                    type.id === "assembled" ? "bg-violet-400" :
                    type.id === "used" ? "bg-zinc-400" : "bg-primary"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Condition Score */}
      <FilterSection title="Min. Condition Score">
        <div className="px-1">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Score</span>
            <span className="font-bold text-primary tabular-nums">{minCondition} / 10</span>
          </div>
          <input
            type="range" min="7" max="10" step="1"
            value={minCondition}
            onChange={e => setMinCondition(parseInt(e.target.value))}
            className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Good (7)</span>
            <span>Pristine (10)</span>
          </div>
        </div>
      </FilterSection>

      {/* Battery Health */}
      <FilterSection title="Min. Battery Health" defaultOpen={false}>
        <div className="px-1">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Battery</span>
            <span className="font-bold text-primary tabular-nums">{minBattery > 0 ? `${minBattery}%+` : "Any"}</span>
          </div>
          <input
            type="range" min="0" max="100" step="5"
            value={minBattery}
            onChange={e => setMinBattery(parseInt(e.target.value))}
            className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Any</span>
            <span>100%</span>
          </div>
        </div>
      </FilterSection>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="w-full py-2.5 rounded-full text-sm font-semibold border border-border hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive transition-all flex items-center justify-center gap-2"
        >
          <X className="w-3.5 h-3.5" />
          Clear All Filters
          <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">{activeFilterCount}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-8 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-end gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {category
                ? CATEGORIES.find(c => c.id === category)?.name ?? "Shop"
                : "Shop"}
            </h1>
            {deviceType && (
              <span className={cn(
                "mb-1 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full",
                deviceType === "new"         && "bg-emerald-500/10 text-emerald-400",
                deviceType === "open_box"    && "bg-sky-500/10 text-sky-400",
                deviceType === "refurbished" && "bg-amber-500/10 text-amber-400",
                deviceType === "assembled"   && "bg-violet-500/10 text-violet-400",
                deviceType === "used"        && "bg-zinc-500/10 text-zinc-400",
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full",
                  deviceType === "new"         && "bg-emerald-500",
                  deviceType === "open_box"    && "bg-sky-500",
                  deviceType === "refurbished" && "bg-amber-500",
                  deviceType === "assembled"   && "bg-violet-500",
                  deviceType === "used"        && "bg-zinc-400",
                )} />
                {DEVICE_TYPES.find(d => d.id === deviceType)?.label}
              </span>
            )}
          </div>
          <p className="text-base text-muted-foreground max-w-2xl">
            Explore our curated selection of fully tested, certified Apple devices. Use the filters to find the perfect match.
          </p>
        </div>

        {/* ── Mobile Filter Bar ── */}
        <div className="md:hidden flex items-center gap-3 mb-6">
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-surface border border-border rounded-full"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
          {/* Category Quick Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            {CATEGORIES.slice(0, 5).map(c => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5",
                    category === c.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface border border-border text-muted-foreground"
                  )}
                >
                  <Icon className="w-3 h-3" /> {c.name}
                </button>
              );
            })}
          </div>

        </div>

        {/* ── Mobile Sidebar Drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mb-6 overflow-hidden bg-surface border border-border rounded-3xl p-5"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-10">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden md:block w-60 flex-shrink-0 sticky top-24 self-start">
            <Sidebar />
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">

            {/* Sort + count bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading…" : `Showing ${products.length} result${products.length !== 1 ? "s" : ""}`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm font-medium bg-surface border border-border rounded-full px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {CATEGORIES.find(c => c.id === category)?.emoji} {CATEGORIES.find(c => c.id === category)?.name}
                    <button onClick={() => setCategory("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {deviceType && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {DEVICE_TYPES.find(d => d.id === deviceType)?.label}
                    <button onClick={() => setDeviceType("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {minCondition > 7 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Condition ≥ {minCondition}
                    <button onClick={() => setMinCondition(7)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {minBattery > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Battery ≥ {minBattery}%
                    <button onClick={() => setMinBattery(0)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    "{search}"
                    <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-surface animate-pulse h-[400px] rounded-[2rem]" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-surface rounded-3xl border border-border">
                <p className="text-destructive font-semibold">Failed to load products.</p>
              </div>
            ) : products.length > 0 ? (
              <motion.div
                key={`${category}-${deviceType}-${minCondition}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-32 bg-surface rounded-3xl border border-dashed border-border">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={clearAll}
                  className="px-6 py-2.5 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition"
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
