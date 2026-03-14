import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  Loader2, User, Mail, Package, ShoppingBag, LogOut,
  CheckCircle2, Clock, Truck, MapPin, ChevronDown, ChevronUp,
  CircleDot, Circle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Order Status Timeline ─────────────────────────────────────────────────────
const ORDER_STEPS = [
  { key: "pending",    label: "Order Placed",       icon: ShoppingBag,  desc: "We received your order" },
  { key: "processing", label: "Processing",         icon: Package,       desc: "Preparing your device" },
  { key: "shipped",    label: "Shipped",            icon: Truck,         desc: "On its way to you" },
  { key: "delivered",  label: "Delivered",          icon: CheckCircle2,  desc: "Enjoy your device!" },
];

const STATUS_ORDER = ["pending", "processing", "shipped", "delivered"];

function OrderStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    pending:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    shipped:    "bg-sky-500/10 text-sky-400 border-sky-500/20",
    delivered:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled:  "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize", cfg[status] ?? cfg.pending)}>
      {status}
    </span>
  );
}

function OrderTrackingTimeline({ status }: { status: string }) {
  const currentIdx = STATUS_ORDER.indexOf(status);
  if (status === "cancelled") {
    return <p className="text-xs text-destructive font-medium py-2">❌ This order was cancelled.</p>;
  }
  return (
    <div className="flex items-start gap-0 mt-4">
      {ORDER_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center">
            <div className="relative w-full flex items-center">
              {/* connector line before */}
              {idx > 0 && (
                <div className={cn("absolute left-0 right-1/2 top-3.5 h-0.5 -translate-y-1/2", idx <= currentIdx ? "bg-primary" : "bg-border")} />
              )}
              {/* connector line after */}
              {idx < ORDER_STEPS.length - 1 && (
                <div className={cn("absolute left-1/2 right-0 top-3.5 h-0.5 -translate-y-1/2", idx < currentIdx ? "bg-primary" : "bg-border")} />
              )}
              {/* circle */}
              <div className={cn(
                "relative z-10 mx-auto w-7 h-7 rounded-full flex items-center justify-center transition-all border-2",
                done ? "bg-primary border-primary" : "bg-background border-border"
              )}>
                <Icon className={cn("w-3.5 h-3.5", done ? "text-primary-foreground" : "text-muted-foreground")} />
              </div>
            </div>
            <p className={cn("text-[10px] font-semibold mt-2 text-center leading-tight", done ? "text-foreground" : "text-muted-foreground/50")}>{step.label}</p>
            {active && <p className="text-[9px] text-primary text-center mt-0.5">{step.desc}</p>}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface/50 transition"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Order #{order.id}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-EG", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <span className="font-bold text-sm">EGP {Number(order.totalAmount).toLocaleString()}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
              {/* Tracking timeline */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Delivery Status</p>
                <OrderTrackingTimeline status={order.status} />
              </div>

              {/* Order items */}
              {order.items && order.items.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</p>
                  <div className="space-y-2">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm bg-surface rounded-xl px-4 py-2.5">
                        <span className="text-foreground/80">Item #{item.productVariantId} × {item.quantity}</span>
                        <span className="font-medium">EGP {Number(item.subtotal).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping info */}
              <div className="bg-surface rounded-xl px-4 py-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{order.address}, {order.city}{order.city ? "," : ""} {order.governorate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Shipping: EGP {Number(order.shippingFee).toLocaleString()} · Payment: <span className="capitalize">{order.paymentMethod}</span> {order.cardLastFour && `(ending in **${order.cardLastFour})`}</span>
                </div>
                {order.notes && (
                  <p className="text-xs text-muted-foreground border-t border-border/40 pt-1 mt-1">📝 {order.notes}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { user, loginMutation, registerMutation, logoutMutation, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/my-orders", user?.email],
    enabled: !!user,
    queryFn: async () => {
      const email = (user as any)?.email || "";
      if (!email) return [];
      const res = await fetch(`/api/my-orders?email=${encodeURIComponent(email)}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({ email, passwordHash: password });
    } else {
      registerMutation.mutate({ email, passwordHash: password, fullName });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-24 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="bg-card rounded-3xl border border-border/60 p-8 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <User className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-1">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {isLogin ? "Sign in to view your orders and profile." : "Join Lunex to track your orders."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                    placeholder="Ahmed Mohamed" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                  placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loginMutation.isPending || registerMutation.isPending}
                className="w-full py-3 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition mt-6 disabled:opacity-50">
                {loginMutation.isPending || registerMutation.isPending ? "Loading…" : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm">
              <span className="text-muted-foreground">{isLogin ? "New to Lunex? " : "Already have an account? "}</span>
              <button onClick={() => setIsLogin(l => !l)} className="font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer">
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = (user as any).fullName || (user as any).user_metadata?.full_name || user.email || "User";
  const userEmail = user.email || "";

  return (
    <div className="min-h-screen bg-background pt-14 pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" /> {userEmail}
              </p>
            </div>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted/40 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            {logoutMutation.isPending ? "Logging out…" : "Sign out"}
          </button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Left sidebar — stats */}
          <aside className="space-y-4">
            <div className="bg-card border border-border/60 rounded-2xl p-5">
              <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Account Info</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Full Name</span>
                  <p className="font-medium mt-0.5">{displayName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Email</span>
                  <p className="font-medium mt-0.5 break-all">{userEmail}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-5">
              <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Order Stats</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total orders</span>
                  <span className="font-bold">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">In transit</span>
                  <span className="font-bold text-sky-400">{orders.filter((o: any) => o.status === "shipped").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivered</span>
                  <span className="font-bold text-emerald-400">{orders.filter((o: any) => o.status === "delivered").length}</span>
                </div>
              </div>
            </div>

            <Link href="/shop">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 hover:bg-primary/10 transition cursor-pointer">
                <ShoppingBag className="w-5 h-5 text-primary mb-2" />
                <p className="font-semibold text-sm">Browse Devices</p>
                <p className="text-xs text-muted-foreground mt-0.5">shop our full collection</p>
              </div>
            </Link>
          </aside>

          {/* Right: Order list */}
          <main>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">My Orders</h2>
              {orders.length > 0 && (
                <span className="text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-card border border-border/60 rounded-2xl py-20 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="font-semibold text-lg mb-2">No orders yet</p>
                <p className="text-muted-foreground text-sm mb-6">Your orders will appear here once you make a purchase.</p>
                <Link href="/shop">
                  <button className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition">Browse Devices</button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
