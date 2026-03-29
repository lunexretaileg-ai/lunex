import { AdminLayout } from "./AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Users, Package, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: orders = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      return res.json();
    },
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      return res.json();
    },
  });

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
    },
  });

  // Computed KPIs
  const totalRevenue = orders
    .filter((o: any) => o.status !== "cancelled")
    .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

  const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
  const processingOrders = orders.filter((o: any) => o.status === "processing").length;
  const totalActiveListings = products.reduce((n: number, p: any) => n + (p.variants?.filter((v: any) => v.isAvailable).length || 0), 0);

  const stats = [
    {
      label: "إجمالي الإيرادات",
      value: `${totalRevenue.toLocaleString("ar-EG")} EGP`,
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/orders",
    },
    {
      label: "إجمالي الطلبات",
      value: String(orders.length),
      icon: ShoppingBag,
      color: "bg-purple-50 text-purple-600",
      href: "/admin/orders",
    },
    {
      label: "المستخدمون المسجلون",
      value: String(users.length),
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
      href: "/admin/users",
    },
    {
      label: "منتجات متاحة",
      value: String(totalActiveListings),
      icon: Package,
      color: "bg-amber-50 text-amber-600",
      href: "/admin/products",
    },
  ];

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending:    { label: "انتظار",   color: "bg-yellow-100 text-yellow-700" },
    processing: { label: "معالجة",  color: "bg-blue-100 text-blue-700" },
    shipped:    { label: "شحن",     color: "bg-purple-100 text-purple-700" },
    delivered:  { label: "تسليم",   color: "bg-green-100 text-green-700" },
    cancelled:  { label: "ملغي",    color: "bg-red-100 text-red-700" },
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">مرحباً! إليك نظرة عامة على متجر Lunex.</p>
        </div>

        {/* Alert: pending & processing */}
        {(pendingOrders + processingOrders) > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              يوجد <strong>{pendingOrders}</strong> طلب في الانتظار و
              <strong> {processingOrders}</strong> في المعالجة.{" "}
              <Link href="/admin/orders" className="underline font-medium">راجع الطلبات</Link>
            </span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Link href={stat.href} key={i}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              أحدث الطلبات
            </h2>
            <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline font-medium">
              عرض الكل
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">لا توجد طلبات حتى الآن.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-right font-medium text-gray-500 px-6 py-3">#</th>
                    <th className="text-right font-medium text-gray-500 px-6 py-3">العميل</th>
                    <th className="text-right font-medium text-gray-500 px-6 py-3">المبلغ</th>
                    <th className="text-right font-medium text-gray-500 px-6 py-3">الحالة</th>
                    <th className="text-right font-medium text-gray-500 px-6 py-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order: any) => {
                    const st = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3 font-mono text-gray-400 text-xs">#{order.id}</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{order.customerName}</td>
                        <td className="px-6 py-3 text-gray-700">{order.totalAmount?.toLocaleString("ar-EG")} EGP</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-400 text-xs">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("ar-EG") : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
