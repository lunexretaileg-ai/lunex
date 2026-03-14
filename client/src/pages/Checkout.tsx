import { useState, useRef, useEffect } from "react";
import { useCart } from "@/store/use-cart";
import { Link, useLocation } from "wouter";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2, CreditCard, Smartphone, MapPin,
  User, Mail, Phone, Home, Building2, FileText,
  Clock, Package, AlertCircle, Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ── Egypt Governorates ─────────────────────────────────────────────────────────
const GOVERNORATES = [
  { value: "Cairo",        label: "القاهرة — Cairo",         zone: 1 },
  { value: "Giza",         label: "الجيزة — Giza",           zone: 1 },
  { value: "Alexandria",   label: "الإسكندرية — Alexandria", zone: 2 },
  { value: "Qalyubia",     label: "القليوبية — Qalyubia",    zone: 2 },
  { value: "Gharbia",      label: "الغربية — Gharbia",       zone: 2 },
  { value: "Dakahlia",     label: "الدقهلية — Dakahlia",     zone: 2 },
  { value: "Sharkia",      label: "الشرقية — Sharkia",       zone: 2 },
  { value: "Monufia",      label: "المنوفية — Monufia",      zone: 2 },
  { value: "Beheira",      label: "البحيرة — Beheira",       zone: 2 },
  { value: "Kafr El Sheikh",label: "كفر الشيخ — Kafr El Sheikh", zone: 3 },
  { value: "Suez",         label: "السويس — Suez",           zone: 2 },
  { value: "Ismailia",     label: "الإسماعيلية — Ismailia",  zone: 2 },
  { value: "Port Said",    label: "بورسعيد — Port Said",     zone: 2 },
  { value: "Luxor",        label: "الأقصر — Luxor",          zone: 3 },
  { value: "Aswan",        label: "أسوان — Aswan",           zone: 3 },
  { value: "Sohag",        label: "سوهاج — Sohag",           zone: 3 },
  { value: "Qena",         label: "قنا — Qena",              zone: 3 },
  { value: "Assiut",       label: "أسيوط — Assiut",          zone: 3 },
  { value: "Beni Suef",    label: "بني سويف — Beni Suef",   zone: 3 },
  { value: "Fayoum",       label: "الفيوم — Fayoum",         zone: 3 },
  { value: "Minya",        label: "المنيا — Minya",          zone: 3 },
  { value: "North Sinai",  label: "شمال سيناء — N. Sinai",  zone: 3 },
  { value: "South Sinai",  label: "جنوب سيناء — S. Sinai",  zone: 3 },
  { value: "New Valley",   label: "الوادي الجديد — New Valley", zone: 3 },
  { value: "Matruh",       label: "مطروح — Matruh",          zone: 3 },
  { value: "Red Sea",      label: "البحر الأحمر — Red Sea",  zone: 3 },
  { value: "Damietta",     label: "دمياط — Damietta",        zone: 2 },
];

// ── Delivery Estimate Algorithm ────────────────────────────────────────────────
// Zone 1: 10-14 days, Zone 2: 14-21 days, Zone 3: 21-30 days
function getDeliveryEstimate(governorate: string): { minDays: number; maxDays: number; fee: number; label: string } {
  const gov = GOVERNORATES.find(g => g.value === governorate);
  const zone = gov?.zone ?? 3;
  if (zone === 1) return { minDays: 10, maxDays: 14, fee: 300, label: "Greater Cairo" };
  if (zone === 2) return { minDays: 14, maxDays: 21, fee: 350, label: "Lower Egypt" };
  return { minDays: 21, maxDays: 30, fee: 400, label: "Upper Egypt / Remote" };
}

function getEstimatedDateRange(minDays: number, maxDays: number): string {
  const from = new Date();
  from.setDate(from.getDate() + minDays);
  const to = new Date();
  to.setDate(to.getDate() + maxDays);
  return `${from.toLocaleDateString("en-EG", { month: "short", day: "numeric" })} – ${to.toLocaleDateString("en-EG", { month: "short", day: "numeric" })}`;
}

// ── Form input component ───────────────────────────────────────────────────────
function FormInput({
  label, name, type = "text", value, onChange, placeholder,
  required, icon: Icon, error, pattern, maxLength, hint
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string; required?: boolean; icon?: React.ElementType;
  error?: string; pattern?: string; maxLength?: number; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          pattern={pattern}
          maxLength={maxLength}
          className={cn(
            "w-full rounded-2xl border bg-background px-4 py-3 text-sm transition-all outline-none",
            "focus:ring-2 focus:ring-primary/30 focus:border-primary",
            Icon ? "pl-10" : "",
            error ? "border-destructive ring-1 ring-destructive/30" : "border-border"
          )}
        />
      </div>
      {error && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground/70 mt-1">{hint}</p>}
    </div>
  );
}

// ── Main Checkout Page ─────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card");
  const [selectedWallet, setSelectedWallet] = useState<"Vodafone" | "Orange" | "Etisalat" | "WE">("Vodafone");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    governorate: "Cairo",
    city: "",
    address: "",
    notes: "",
  });

  const [cardData, setCardData] = useState({
    number: "", name: "", expiry: "", cvc: "", focus: "" as any,
  });

  const delivery = getDeliveryEstimate(formData.governorate);

  // ── Validation ────────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim() || formData.customerName.trim().length < 3)
      newErrors.customerName = "Full name must be at least 3 characters";
    if (!formData.customerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.customerEmail = "Please enter a valid email address";
    if (!formData.customerPhone.match(/^(\+20|0)?1[0-9]{9}$/))
      newErrors.customerPhone = "Enter a valid Egyptian phone number (e.g. 0100 000 0000)";
    if (!formData.city.trim())
      newErrors.city = "City / Area is required";
    if (!formData.address.trim() || formData.address.trim().length < 10)
      newErrors.address = "Please provide your full address (at least 10 characters)";

    if (paymentMethod === "card") {
      if (!cardData.number.replace(/\s/g, "").match(/^\d{16}$/))
        newErrors.cardNumber = "Enter a valid 16-digit card number";
      if (!cardData.name.trim())
        newErrors.cardName = "Card holder name is required";
      if (!cardData.expiry.match(/^\d{2}\/\d{2}$/))
        newErrors.cardExpiry = "Format: MM/YY";
      if (!cardData.cvc.match(/^\d{3,4}$/))
        newErrors.cardCvc = "Enter 3 or 4 digit CVC";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const totalQuantity = items.reduce((t, i) => t + i.quantity, 0);
  const isWholesale = totalQuantity >= 10;
  const wholesaleDiscount = isWholesale ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal - wholesaleDiscount + delivery.fee;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = {...prev}; delete n[name]; return n; });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "number") formatted = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (name === "expiry") formatted = value.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/").replace(/\/(.{0})$/, "");
    setCardData(prev => ({ ...prev, [name]: formatted }));
    if (errors[`card${name.charAt(0).toUpperCase() + name.slice(1)}`])
      setErrors(prev => { const n = {...prev}; delete n[`card${name.charAt(0).toUpperCase() + name.slice(1)}`]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({ variant: "destructive", title: "Please fix the errors above", description: "Check all required fields." });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mapLat: mapCoords?.lat ?? null,
          mapLng: mapCoords?.lng ?? null,
          subtotal, shippingFee: delivery.fee,
          discount: wholesaleDiscount, totalAmount: total,
          paymentMethod,
          paymentWallet: paymentMethod === "wallet" ? selectedWallet : null,
          cardLastFour: paymentMethod === "card" ? cardData.number.replace(/\s/g, "").slice(-4) : null,
          items: items.map(item => ({
            productVariantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          }))
        })
      });
      if (!res.ok) throw new Error("Failed to place order");
      const data = await res.json();
      setOrderNumber(data.orderId ?? null);
      setOrderComplete(true);
      clearCart();
    } catch {
      toast({ variant: "destructive", title: "Order Failed", description: "There was an error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map pin selection via iframe click approximation — we use OpenStreetMap iFrame
  const mapRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="min-h-screen bg-background pt-12 pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Checkout</h1>
          <p className="text-muted-foreground text-sm">Complete your order details below. All fields marked with * are required.</p>
        </header>

        {items.length === 0 ? (
          <div className="bg-surface rounded-3xl border border-border/60 py-20 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="font-semibold text-lg mb-2">Your bag is empty</p>
            <p className="text-muted-foreground mb-6 text-sm">Add a device from the shop to continue.</p>
            <Link href="/shop"><button className="px-8 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition">Browse devices</button></Link>
          </div>
        ) : orderComplete ? (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface rounded-3xl border border-border/60 py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed! 🎉</h2>
            {orderNumber && <p className="text-muted-foreground text-sm mb-1">Order #{orderNumber}</p>}
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto text-sm">
              Thank you for choosing Lunex. Your order is being processed.
            </p>
            {/* Delivery estimate */}
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-2xl px-5 py-3 mb-8">
              <Truck className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Estimated delivery: <strong>{getEstimatedDateRange(delivery.minDays, delivery.maxDays)}</strong>
                <span className="text-muted-foreground ml-1">({delivery.minDays}–{delivery.maxDays} days)</span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/account">
                <button className="px-6 py-2.5 rounded-full border border-border font-semibold text-sm hover:bg-surface transition">View Orders</button>
              </Link>
              <Link href="/shop">
                <button className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition">Continue Shopping</button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <form className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 items-start" onSubmit={handleSubmit} noValidate>
            {/* Left column */}
            <div className="space-y-6">

              {/* 1 — Customer Info */}
              <section className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
                  <h2 className="font-semibold text-base">Customer Information</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput label="Full Name" name="customerName" value={formData.customerName} onChange={handleFormChange} placeholder="Ahmed Mohamed" required icon={User} error={errors.customerName} />
                  <FormInput label="Email" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleFormChange} placeholder="you@gmail.com" required icon={Mail} error={errors.customerEmail} />
                  <FormInput label="Phone (Egypt)" name="customerPhone" type="tel" value={formData.customerPhone} onChange={handleFormChange} placeholder="01000000000" required icon={Phone} error={errors.customerPhone} hint="Must be a valid Egyptian number starting with 010, 011, 012, or 015" />
                </div>
              </section>

              {/* 2 — Shipping Address */}
              <section className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
                  <h2 className="font-semibold text-base">Shipping Address</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Governorate <span className="text-destructive">*</span></label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <select
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleFormChange}
                        className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
                      >
                        {GOVERNORATES.map(g => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* Live delivery estimate */}
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Est. delivery: <strong className="text-foreground">{delivery.minDays}–{delivery.maxDays} days</strong> · <strong className="text-foreground">EGP {delivery.fee}</strong> shipping</span>
                    </div>
                  </div>
                  <FormInput label="City / Area" name="city" value={formData.city} onChange={handleFormChange} placeholder="Nasr City, Maadi, Dokki..." required icon={Home} error={errors.city} />
                  <div className="sm:col-span-2">
                    <FormInput label="Full Street Address" name="address" value={formData.address} onChange={handleFormChange} placeholder="Street name, building number, floor, apartment" required icon={MapPin} error={errors.address} hint="Include building number and apartment for accurate delivery" />
                  </div>
                </div>

                {/* Map location picker */}
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Optional: Pin Your Location on Map</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-border h-56 relative bg-surface">
                    {!mapLoaded && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <MapPin className="w-8 h-8 text-muted-foreground opacity-30" />
                        <button
                          type="button"
                          onClick={() => setMapLoaded(true)}
                          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full hover:opacity-90 transition"
                        >
                          Load Map
                        </button>
                        <p className="text-xs text-muted-foreground">Click to load map and pin your location</p>
                      </div>
                    )}
                    {mapLoaded && (
                      <iframe
                        ref={mapRef}
                        className="w-full h-full"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=24%2C22%2C37%2C32&layer=mapnik&marker=30%2C31`}
                        style={{ border: 0 }}
                        title="Location Map"
                      />
                    )}
                  </div>
                  {mapLoaded && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      📍 Use the map above to see delivery zones. Exact GPS coordinates are optional — your address text is sufficient.
                    </p>
                  )}
                </div>

                {/* Notes field */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Order Notes <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      placeholder="E.g. call before delivery, leave at reception, specific time preference..."
                      rows={3}
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* 3 — Payment */}
              <section className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
                  <h2 className="font-semibold text-base">Payment Method</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setPaymentMethod("card")}
                    className={cn("p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all text-sm font-semibold",
                      paymentMethod === "card" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted/30"
                    )}>
                    <CreditCard className="w-5 h-5" />
                    Credit / Debit Card
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("wallet")}
                    className={cn("p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all text-sm font-semibold",
                      paymentMethod === "wallet" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted/30"
                    )}>
                    <Smartphone className="w-5 h-5" />
                    Mobile Wallet
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === "card" && (
                    <motion.div key="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-4">
                      <div className="flex justify-center scale-90 origin-center">
                        <Cards number={cardData.number} expiry={cardData.expiry} cvc={cardData.cvc} name={cardData.name} focused={cardData.focus} />
                      </div>
                      <div className="grid gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Card Number <span className="text-destructive">*</span></label>
                          <input name="number" value={cardData.number} onChange={handleCardChange} onFocus={e => setCardData(p => ({...p, focus: e.target.name}))}
                            placeholder="0000 0000 0000 0000" maxLength={19}
                            className={cn("w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition", errors.cardNumber ? "border-destructive" : "border-border")} />
                          {errors.cardNumber && <p className="text-xs text-destructive mt-1">{errors.cardNumber}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Card Holder Name <span className="text-destructive">*</span></label>
                          <input name="name" value={cardData.name} onChange={handleCardChange} onFocus={e => setCardData(p => ({...p, focus: e.target.name}))}
                            placeholder="Ahmed Mohamed"
                            className={cn("w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition", errors.cardName ? "border-destructive" : "border-border")} />
                          {errors.cardName && <p className="text-xs text-destructive mt-1">{errors.cardName}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Expiry (MM/YY) <span className="text-destructive">*</span></label>
                            <input name="expiry" value={cardData.expiry} onChange={handleCardChange} onFocus={e => setCardData(p => ({...p, focus: e.target.name}))}
                              placeholder="MM/YY" maxLength={5}
                              className={cn("w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition", errors.cardExpiry ? "border-destructive" : "border-border")} />
                            {errors.cardExpiry && <p className="text-xs text-destructive mt-1">{errors.cardExpiry}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">CVC <span className="text-destructive">*</span></label>
                            <input name="cvc" value={cardData.cvc} onChange={handleCardChange} onFocus={e => setCardData(p => ({...p, focus: e.target.name}))}
                              placeholder="123" maxLength={4}
                              className={cn("w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition", errors.cardCvc ? "border-destructive" : "border-border")} />
                            {errors.cardCvc && <p className="text-xs text-destructive mt-1">{errors.cardCvc}</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "wallet" && (
                    <motion.div key="wallet" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-4">
                      <div className="flex gap-2 p-1 bg-muted rounded-full">
                        {(["Vodafone", "Orange", "Etisalat", "WE"] as const).map(w => (
                          <button key={w} type="button" onClick={() => setSelectedWallet(w)}
                            className={cn("flex-1 text-xs py-2 px-3 font-semibold rounded-full transition-all",
                              selectedWallet === w ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}>{w}</button>
                        ))}
                      </div>
                      <div className="bg-surface border border-border/50 rounded-2xl p-4 text-sm text-muted-foreground">
                        <p>Generate a <strong className="text-foreground">Virtual Card Number (VCN)</strong> from your <strong className="text-foreground">{selectedWallet} Cash</strong> app, then enter it below.</p>
                      </div>
                      <div className="flex justify-center scale-90 origin-center">
                        <Cards number={cardData.number || "5078000000000000"} expiry={cardData.expiry || "12/26"} cvc={cardData.cvc || "---"} name={`${selectedWallet} Cash`} focused={cardData.focus} preview={true} />
                      </div>
                      <div className="grid gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Virtual Card Number <span className="text-destructive">*</span></label>
                          <input name="number" value={cardData.number} onChange={handleCardChange} placeholder="0000 0000 0000 0000" maxLength={19}
                            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Expiry</label>
                            <input name="expiry" value={cardData.expiry} onChange={handleCardChange} placeholder="MM/YY" maxLength={5}
                              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">CVC</label>
                            <input name="cvc" value={cardData.cvc} onChange={handleCardChange} placeholder="123" maxLength={4}
                              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </div>

            {/* Right: Order Summary */}
            <aside className="bg-card rounded-3xl border border-border/60 p-6 space-y-4 sticky top-24">
              <h2 className="font-semibold text-base">Order Summary</h2>
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.storage && <span>{item.storage} · </span>}
                        {item.color && <span>{item.color} · </span>}
                        <span>Qty {item.quantity}</span>
                      </p>
                    </div>
                    <span className="font-semibold text-right shrink-0">EGP {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/60 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>EGP {subtotal.toLocaleString()}</span>
                </div>
                {isWholesale && (
                  <div className="flex justify-between text-emerald-500 font-medium">
                    <span>Wholesale Discount (15%)</span>
                    <span>- EGP {wholesaleDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <div>
                    <span className="text-muted-foreground">Shipping</span>
                    <p className="text-[10px] text-muted-foreground opacity-70 flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {delivery.minDays}–{delivery.maxDays} days · {getEstimatedDateRange(delivery.minDays, delivery.maxDays)}
                    </p>
                  </div>
                  <span>EGP {delivery.fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border/40">
                  <span>Total</span>
                  <span>EGP {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 hover:scale-[1.01] transition disabled:opacity-60 disabled:pointer-events-none mt-2"
              >
                {isSubmitting ? "Processing…" : "Confirm Order →"}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                🔒 Your order and payment are processed securely through Lunex.
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
