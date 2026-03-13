import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function AccountPage() {
  const { user, loginMutation, registerMutation, logoutMutation, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

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
            <h1 className="text-2xl font-bold text-center mb-6">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending || registerMutation.isPending}
                className="w-full py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition mt-6 disabled:opacity-50"
              >
                {loginMutation.isPending || registerMutation.isPending
                  ? "Loading..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="flex justify-between items-end border-b border-border/60 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              My Account
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user.user_metadata?.full_name || user.email}!
            </p>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="px-6 py-2 rounded-full border border-border bg-background text-sm font-medium hover:bg-muted/50 transition"
          >
            {logoutMutation.isPending ? "Logging out..." : "Log out"}
          </button>
        </header>

        <section className="grid md:grid-cols-2 gap-8">
           <div className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
             <h2 className="text-lg font-semibold border-b border-border/60 pb-2">Profile Details</h2>
             <div className="space-y-3 text-sm">
               <div>
                 <span className="text-muted-foreground block text-xs">Full Name</span>
                 <span className="font-medium">{user.user_metadata?.full_name || "N/A"}</span>
               </div>
               <div>
                 <span className="text-muted-foreground block text-xs">Email Address</span>
                 <span className="font-medium">{user.email}</span>
               </div>
             </div>
           </div>

           <div className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
             <h2 className="text-lg font-semibold border-b border-border/60 pb-2">Recent Orders</h2>
             <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/30"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <p className="text-sm text-muted-foreground">You don't have any orders yet.</p>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
}

