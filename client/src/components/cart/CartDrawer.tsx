import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCart();

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-card shadow-2xl z-50 flex flex-col border-l border-border"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold tracking-tight">Your Bag</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground">
                    <ShoppingBagIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Your bag is empty</h3>
                    <p className="text-muted-foreground mt-1">Looks like you haven't added anything yet.</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="mt-4 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-surface rounded-2xl p-2 flex-shrink-0 flex items-center justify-center border border-border/50">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-contain mix-blend-multiply" 
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-foreground line-clamp-2 pr-4">{item.name}</h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {item.storage && <span>{item.storage}</span>}
                            {item.color && (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full border border-border" style={{ backgroundColor: item.color.toLowerCase().replace(' ', '') }}></span>
                                {item.color}
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 rounded border border-border">
                              {item.conditionScore}/10 Cond
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-border rounded-full overflow-hidden bg-background">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-semibold">
                            EGP {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 bg-secondary/50">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">EGP {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-6 text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground text-right">Calculated at checkout</span>
                </div>
                
                <div className="flex justify-between mb-6 text-lg font-bold">
                  <span>Total</span>
                  <span>EGP {subtotal.toLocaleString()}</span>
                </div>

                <Link href="/checkout">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 px-6 bg-foreground text-background font-semibold rounded-full hover:opacity-90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Inline fallback icon
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
