import { AdminLayout } from "./AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { type orders } from "@shared/schema";
import { Loader2, Eye, MoreVertical, Package, Truck, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const { data: adminOrders, isLoading } = useQuery<any[]>({
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
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{order.customerName}</span>
                          <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                          ${order.status === 'pending' ? 'bg-warning/20 text-warning' : 
                            order.status === 'completed' ? 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]' : 
                            order.status === 'processing' ? 'bg-primary/20 text-primary' :
                            'bg-destructive/20 text-destructive'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        EGP {Number(order.totalAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className="flex items-center gap-1.5">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                           order.paymentMethod === 'card' ? 'Credit Card' : 
                           order.paymentMethod === 'wallet' ? `${order.paymentWallet || 'Wallet'} Cash` : 
                           order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Order Details #{selectedOrder?.id?.toString().padStart(5, '0')}</DialogTitle>
                              </DialogHeader>
                              
                              {selectedOrder && (
                                <div className="space-y-6 mt-4">
                                  {/* Top Row: Status & Dates */}
                                  <div className="flex items-center justify-between border-b pb-4">
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Placed on</p>
                                      <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                      <p className="text-sm text-muted-foreground">Status</p>
                                      <span className="capitalize font-medium text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">
                                        {selectedOrder.status}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Middle Grid: Customer info */}
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <h3 className="font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Customer Details</h3>
                                      <div className="bg-surface p-4 rounded-xl text-sm space-y-2">
                                        <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customerName}</p>
                                        <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customerEmail}</p>
                                        <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customerPhone || 'N/A'}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <h3 className="font-semibold flex items-center gap-2"><Truck className="w-4 h-4" /> Shipping Address</h3>
                                      <div className="bg-surface p-4 rounded-xl text-sm space-y-2">
                                        <p><span className="text-muted-foreground">Governorate:</span> {selectedOrder.governorate}</p>
                                        <p><span className="text-muted-foreground">City:</span> {selectedOrder.city}</p>
                                        <p className="text-muted-foreground mt-2">{selectedOrder.address}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Payment Info */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment Details</h3>
                                    <div className="bg-surface p-4 rounded-xl text-sm flex justify-between items-center">
                                       <span className="capitalize font-medium">
                                          {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                           selectedOrder.paymentMethod === 'card' ? 'Credit Card' : 
                                           selectedOrder.paymentMethod === 'wallet' ? `${selectedOrder.paymentWallet || 'Wallet'} Cash` : 
                                           selectedOrder.paymentMethod}
                                       </span>
                                    </div>
                                  </div>

                                  {/* Items List */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2"><Package className="w-4 h-4" /> Purchased Items ({selectedOrder.items?.length || 0})</h3>
                                    <div className="border rounded-xl divide-y">
                                      {selectedOrder.items?.map((item: any) => (
                                        <div key={item.id} className="p-4 flex gap-4 items-center">
                                          <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden shrink-0">
                                            <img 
                                              src={item.productVariant?.product?.imageUrl} 
                                              alt={item.productVariant?.product?.name} 
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate">{item.productVariant?.product?.name || `Variant ${item.productVariantId}`}</h4>
                                            <p className="text-xs text-muted-foreground">
                                              {item.productVariant?.storage && `${item.productVariant.storage} • `}
                                              {item.productVariant?.color && `${item.productVariant.color}`}
                                            </p>
                                            <p className="text-xs font-medium mt-1">Qty: {item.quantity} × EGP {Number(item.unitPrice).toLocaleString()}</p>
                                          </div>
                                          <div className="font-medium text-sm">
                                            EGP {Number(item.subtotal).toLocaleString()}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Financial Summary */}
                                  <div className="bg-surface p-4 rounded-xl space-y-2 text-sm text-right">
                                     <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>EGP {Number(selectedOrder.subtotal).toLocaleString()}</span>
                                     </div>
                                     {Number(selectedOrder.discount) > 0 && (
                                       <div className="flex justify-between text-[hsl(var(--success))]">
                                          <span>Discount (Wholesale)</span>
                                          <span>- EGP {Number(selectedOrder.discount).toLocaleString()}</span>
                                       </div>
                                     )}
                                     <div className="flex justify-between text-muted-foreground">
                                        <span>Shipping</span>
                                        <span>EGP {Number(selectedOrder.shippingFee).toLocaleString()}</span>
                                     </div>
                                     <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t">
                                        <span>Total</span>
                                        <span>EGP {Number(selectedOrder.totalAmount).toLocaleString()}</span>
                                     </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <MoreVertical className="w-4 h-4" />
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
