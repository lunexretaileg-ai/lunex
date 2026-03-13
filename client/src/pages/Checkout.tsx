import { useState } from "react";
import { useCart } from "@/store/use-cart";
import { Link, useLocation } from "wouter";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, CreditCard, Smartphone, Banknote } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "cod">("cod");
  const [selectedWallet, setSelectedWallet] = useState<"Vodafone" | "Orange" | "Etisalat" | "WE">("Vodafone");
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    governorate: "Cairo",
    city: "",
    address: "",
  });

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "" as any,
  });

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setCardData((prev) => ({ ...prev, focus: e.target.name }));
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  // Dynamic Shipping Logic
  let delivery = 400; // Default (was 80, changed to 300-400 per user request)
  let deliveryTime = "1-2 days";
  
  if (formData.governorate === "Cairo" || formData.governorate === "Giza") {
    delivery = 300;
    deliveryTime = "1-2 days";
  } else if (formData.governorate === "Alexandria") {
    delivery = 350;
    deliveryTime = "2-3 days";
  } else {
    delivery = 400;
    deliveryTime = "3-5 days";
  }

  // Wholesale Logic
  const isWholesale = totalQuantity >= 10;
  const wholesaleDiscount = isWholesale ? Math.round(subtotal * 0.15) : 0; // 15% discount
  
  const total = subtotal - wholesaleDiscount + delivery;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // POST to our new backend route
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, // name, email, phone, gov, city, address
          subtotal,
          shippingFee: delivery,
          discount: wholesaleDiscount,
          totalAmount: total,
          paymentMethod,
          paymentWallet: paymentMethod === "wallet" ? selectedWallet : null,
          items: items.map(item => ({
            productVariantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          }))
        })
      });

      if (!res.ok) throw new Error("Failed to place order");

      setOrderComplete(true);
      clearCart();
      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase. Your order is being processed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "There was an error processing your checkout. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Enter your details and confirm your order. Payment methods are
            tailored for Egypt (cash on delivery, cards, and wallets).
          </p>
        </header>

        {items.length === 0 ? (
          <div className="bg-surface rounded-[2rem] border border-border/60 py-20 px-6 text-center">
            <p className="text-lg font-medium mb-2">
              Your bag is empty right now.
            </p>
            <p className="text-muted-foreground mb-6">
              Add a device from the shop first to continue.
            </p>
            <Link href="/shop">
              <button className="px-8 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition">
                Browse devices
              </button>
            </Link>
          </div>
        ) : orderComplete ? (
          <div className="bg-surface rounded-[2rem] border border-border/60 py-20 px-6 text-center animate-in fade-in duration-500">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2">Order Confirmed!</p>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Thank you for choosing Lunex. We have received your order and will begin processing it right away.
            </p>
            <Link href="/shop">
              <button className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <form className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-10 items-start" onSubmit={handleSubmit}>
            {/* Left: Form steps (simplified multi-step in one screen) */}
            <section className="space-y-8">
              {/* Customer info */}
              <div className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
                <h2 className="text-lg font-semibold">Customer information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Full name
                    </label>
                    <input
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Phone (Egypt)
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      placeholder="0100 000 0000"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
                <h2 className="text-lg font-semibold">Shipping address</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Governorate
                    </label>
                    <select 
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="Cairo">Cairo</option>
                      <option value="Giza">Giza</option>
                      <option value="Alexandria">Alexandria</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      City / Area
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      placeholder="Nasr City, Maadi, etc."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Full address
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      placeholder="Street, building, floor, apartment"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
                <h2 className="text-lg font-semibold">Payment method</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Banknote className="w-6 h-6" />
                    <span className="font-medium">Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-medium">Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                        setPaymentMethod("wallet");
                        if (!selectedWallet) setSelectedWallet("Vodafone");
                    }}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition md:col-span-2 sm:col-span-1 ${
                      paymentMethod === "wallet"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="font-medium">Mobile Wallet</span>
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="mb-6 flex justify-center scale-90 sm:scale-100 origin-center relative">
                      <Cards
                        number={cardData.number}
                        expiry={cardData.expiry}
                        cvc={cardData.cvc}
                        name={cardData.name}
                        focused={cardData.focus}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Card Number
                        </label>
                        <input
                          type="tel"
                          name="number"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={cardData.number}
                          onChange={handleCardInputChange}
                          onFocus={handleInputFocus}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Card Holder Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                          placeholder="Your Name"
                          value={cardData.name}
                          onChange={handleCardInputChange}
                          onFocus={handleInputFocus}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardData.expiry}
                            onChange={handleCardInputChange}
                            onFocus={handleInputFocus}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            CVC
                          </label>
                          <input
                            type="tel"
                            name="cvc"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                            placeholder="123"
                            maxLength={4}
                            value={cardData.cvc}
                            onChange={handleCardInputChange}
                            onFocus={handleInputFocus}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "wallet" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex gap-2 mb-6 p-1 bg-muted rounded-full">
                       {(['Vodafone', 'Orange', 'Etisalat', 'WE'] as const).map((wallet) => (
                           <button
                             key={wallet}
                             onClick={() => setSelectedWallet(wallet)}
                             className={`flex-1 text-xs py-2 px-3 font-medium rounded-full transition-all ${
                               selectedWallet === wallet
                                 ? "bg-background shadow-sm text-foreground"
                                 : "text-muted-foreground hover:text-foreground"
                             }`}
                           >
                             {wallet}
                           </button>
                       ))}
                    </div>

                    <div className="mb-6 flex justify-center scale-90 sm:scale-100 origin-center relative wallet-card-wrapper" data-wallet={selectedWallet?.toLowerCase()}>
                      {/* We overlay a custom gradient specific to the provider via CSS using the data attribute */}
                      <Cards
                        number={cardData.number || "5078000000000000"}
                        expiry={cardData.expiry || "12/25"}
                        cvc={cardData.cvc || "123"}
                        name={selectedWallet + " Cash Virtual Card"}
                        focused={cardData.focus}
                        preview={true}
                      />
                    </div>

                     <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Enter the details of the temporary virtual credit card (VCN) generated from your {selectedWallet} Cash app.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Virtual Card Number
                        </label>
                        <input
                          type="tel"
                          name="number"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={cardData.number}
                          onChange={handleCardInputChange}
                          onFocus={handleInputFocus}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardData.expiry}
                            onChange={handleCardInputChange}
                            onFocus={handleInputFocus}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            CVC
                          </label>
                          <input
                            type="tel"
                            name="cvc"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                            placeholder="123"
                            maxLength={4}
                            value={cardData.cvc}
                            onChange={handleCardInputChange}
                            onFocus={handleInputFocus}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Right: Summary */}
            <aside className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
              <h2 className="text-lg font-semibold">Order summary</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium line-clamp-2">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.storage && <span>{item.storage} · </span>}
                        {item.color && <span>{item.color} · </span>}
                        <span>Qty {item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right font-medium">
                      EGP {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/60 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>EGP {subtotal.toLocaleString()}</span>
                </div>
                
                {isWholesale && (
                  <div className="flex justify-between text-[hsl(var(--success))] font-medium">
                    <span>Wholesale Discount (15%)</span>
                    <span>- EGP {wholesaleDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Shipping ({formData.governorate})</span>
                    <span className="text-[10px] text-muted-foreground opacity-70">Estimated: {deliveryTime}</span>
                  </div>
                  <span>
                    EGP {delivery.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-base font-semibold pt-2">
                  <span>Total</span>
                  <span>EGP {total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-4 w-full py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 hover:scale-[1.01] transition disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? "Processing..." : "Confirm Order"}
              </button>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                This is a demo checkout. In production, your order and payment
                would be processed securely through Lunex servers and payment gateway.
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}

