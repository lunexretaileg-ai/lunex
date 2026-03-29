import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { Users, ShieldCheck, ShieldOff, MoreVertical } from "lucide-react";
import { useState } from "react";

interface UserItem {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isAdmin: boolean;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  admin:    "bg-red-100 text-red-700",
  staff:    "bg-blue-100 text-blue-700",
  customer: "bg-gray-100 text-gray-600",
};

export default function AdminUsers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery<UserItem[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      return res.json();
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ id, isAdmin, role }: { id: number; isAdmin: boolean; role: string }) => {
      await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin, role }),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/users"] }),
  });

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6" /> المستخدمون
            </h1>
            <p className="text-sm text-gray-500 mt-1">إجمالي {users.length} مستخدم مسجل</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="ابحث بالاسم أو الإيميل..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
        />

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-400 text-sm">جاري التحميل...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">لا يوجد مستخدمون</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-right font-semibold text-gray-500 px-5 py-3">الاسم</th>
                    <th className="text-right font-semibold text-gray-500 px-5 py-3">الإيميل</th>
                    <th className="text-right font-semibold text-gray-500 px-5 py-3">الهاتف</th>
                    <th className="text-right font-semibold text-gray-500 px-5 py-3">الدور</th>
                    <th className="text-right font-semibold text-gray-500 px-5 py-3">تاريخ التسجيل</th>
                    <th className="text-right font-semibold text-gray-500 px-5 py-3">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900">{user.fullName}</td>
                      <td className="px-5 py-4 text-gray-500">{user.email}</td>
                      <td className="px-5 py-4 text-gray-500">{user.phone || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role] || ROLE_COLORS.customer}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-EG") : "—"}
                      </td>
                      <td className="px-5 py-4">
                        {user.role !== "admin" ? (
                          <button
                            onClick={() => toggleAdmin.mutate({ id: user.id, isAdmin: true, role: "admin" })}
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            اجعله أدمن
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleAdmin.mutate({ id: user.id, isAdmin: false, role: "customer" })}
                            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium"
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                            إلغاء الأدمن
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
