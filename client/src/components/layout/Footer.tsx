import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[hsl(var(--surface))] pt-16 pb-8 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop?category=mac" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mac</Link></li>
              <li><Link href="/shop?category=ipad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">iPad</Link></li>
              <li><Link href="/shop?category=iphone" className="text-sm text-muted-foreground hover:text-foreground transition-colors">iPhone</Link></li>
              <li><Link href="/shop?category=watch" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Watch</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4">Lunex</h3>
            <ul className="space-y-3">
              <li><Link href="/how-lunex-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/sustainability" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sustainability</Link></li>
              <li><Link href="/reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/warranty" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Warranty & Returns</Link></li>
              <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping Info</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4">Account</h3>
            <ul className="space-y-3">
              <li><Link href="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Profile</Link></li>
              <li><Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Order Status</Link></li>
              <li><Link href="/wishlist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Wishlist</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Lunex. All rights reserved. Apple, iPhone, Mac, iPad are trademarks of Apple Inc.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
