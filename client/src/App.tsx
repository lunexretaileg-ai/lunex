import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import HowItWorks from "@/pages/HowItWorks";
import CategoryPage from "@/pages/CategoryPage";
import ComparePage from "@/pages/Compare";
import BuildDevicePage from "@/pages/BuildDevice";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import SupportPage from "@/pages/Support";
import AccountPage from "@/pages/Account";
import WishlistPage from "@/pages/Wishlist";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/product/:slug" component={ProductDetails} />
          <Route path="/how-lunex-works" component={HowItWorks} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/support" component={SupportPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/wishlist" component={WishlistPage} />
          
          {/* Admin Routes */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/orders" component={AdminOrders} />

          {/* Tools */}
          <Route path="/compare" component={ComparePage} />
          <Route path="/build" component={BuildDevicePage} />

          {/* Category Pages */}
          <Route path="/iphone">
            {() => <CategoryPage 
              category="iphone" 
              title="Shop iPhone" 
              description="Explore our selection of pristine and fully tested iPhones. Unbeatable value, guaranteed." 
              heroImage="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1920&q=80" 
            />}
          </Route>
          <Route path="/mac">
            {() => <CategoryPage 
              category="mac" 
              title="Shop Mac" 
              description="Power through your workflow. Discover professionally refurbished MacBooks at a fraction of the cost." 
              heroImage="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&q=80" 
            />}
          </Route>
          <Route path="/ipad">
            {() => <CategoryPage 
              category="ipad" 
              title="Shop iPad" 
              description="Your next computer is not a computer. Shop our collection of iPads built for creativity." 
              heroImage="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1920&q=80" 
            />}
          </Route>
          <Route path="/watch">
            {() => <CategoryPage 
              category="watch" 
              title="Shop Apple Watch" 
              description="Advanced health features and connectivity. Ready for your wrist." 
              heroImage="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1920&q=80" 
            />}
          </Route>
          <Route path="/airpods">
            {() => <CategoryPage 
              category="airpods" 
              title="Shop AirPods" 
              description="Magic like you've never heard. Shop professionally processed AirPods." 
              heroImage="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1920&q=80" 
            />}
          </Route>

          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
    </main>
  );
}

import { AuthProvider } from "@/hooks/use-auth";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
