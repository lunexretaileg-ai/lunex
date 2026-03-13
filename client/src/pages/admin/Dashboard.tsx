import { AdminLayout } from "./AdminLayout";
import { Users, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "EGP 452,000", icon: DollarSign, trend: "+12%" },
    { label: "Total Orders", value: "145", icon: ShoppingBag, trend: "+5%" },
    { label: "Active Users", value: "2,405", icon: Users, trend: "+18%" },
    { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, trend: "+1%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome back to the Lunex admin control panel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 px-2.5 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Temporary Placeholder for charts/tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-3xl border border-border/50 p-6 min-h-[400px] flex items-center justify-center">
             <p className="text-muted-foreground">Revenue Chart Placeholder</p>             
          </div>
          <div className="bg-card rounded-3xl border border-border/50 p-6 min-h-[400px] flex items-center justify-center">
             <p className="text-muted-foreground">Recent Activity Placeholder</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
