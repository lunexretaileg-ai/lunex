import { useCart } from "@/store/use-cart";
import { Link } from "wouter";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Your Bag
            </h1>
            <p className="text-muted-foreground">
              Review the devices in your bag before completing your order.
            </p>
          </div>
          {hasItems && (
            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-destructive underline-offset-4 hover:underline"
            >
              Clear bag
            </button>
          )}
        </header>

        {!hasItems ? (
          <div className="bg-surface rounded-[2rem] border border-border/60 py-20 px-6 text-center">
            <p className="text-lg font-medium mb-2">Your bag is empty.</p>
            <p className="text-muted-foreground mb-6">
              Add a device from the shop to see it here.
            </p>
            <Link href="/shop">
              <button className="px-8 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition">
                Browse devices
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10 items-start">
            <section className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-card rounded-3xl border border-border/60 p-4 sm:p-6"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-surface rounded-2xl p-2 flex-shrink-0 flex items-center justify-center border border-border/40">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-base sm:text-lg leading-snug">
                          {item.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {item.storage && <span>{item.storage} · </span>}
                          {item.color && <span>{item.color} · </span>}
                          <span>Condition {item.conditionScore}/10</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-border rounded-full overflow-hidden bg-background">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          EGP {item.price.toLocaleString()} each
                        </div>
                        <div className="text-base sm:text-lg font-semibold">
                          EGP {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <aside className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  EGP {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">
                  Calculated at checkout
                </span>
              </div>
              <div className="border-t border-border/60 pt-4 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>EGP {subtotal.toLocaleString()}</span>
              </div>

              <Link href="/checkout">
                <button className="mt-4 w-full py-3 rounded-full bg-foreground text-background font-semibold flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.01] transition">
                  Proceed to checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                Cash on delivery and local Egyptian payment options available at
                checkout.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

