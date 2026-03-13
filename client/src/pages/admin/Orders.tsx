import { AdminLayout } from "./AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { type orders } from "@shared/schema";
import { Loader2, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOrders() {
  const { data: adminOrders, isLoading } = useQuery<(typeof orders.$inferSelect)[]>({
    queryKey: ["/api/admin/orders"],
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-2">View and manage customer orders.</p>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-surface/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Method</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : adminOrders?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No orders found yet.
                    </td>
                  </tr>
                ) : (
                  adminOrders?.map((order) => (
                    <tr key={order.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        #{order.id.toString().padStart(5, '0')}
                      </td>
                      <td className="px-6 py-4">
                        User {order.userId}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                          ${order.status === 'pending' ? 'bg-warning/20 text-warning' : 
                            order.status === 'completed' ? 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]' : 
                            'bg-destructive/20 text-destructive'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        EGP {Number(order.totalAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 capitalize">{order.paymentMethod}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
