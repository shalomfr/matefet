"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { Users, UserPlus, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/Toast";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string | null;
  organizationName: string;
  organizationNumber: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { showSuccess, showError } = useToast();
  const [tab, setTab] = useState<"pending" | "active" | "all">("pending");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?tab=${tab}`);
      const data = await res.json();
      if (data.success) setUsers(data.data);
      else showError(data.error ?? "שגיאה");
    } catch {
      showError("שגיאה בטעינה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [tab]);

  async function approve(id: string) {
    try {
      const res = await fetch(`/api/users/${id}/approve`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showSuccess("הבקשה אושרה");
        fetchUsers();
      } else {
        showError(data.error ?? "שגיאה");
      }
    } catch {
      showError("שגיאה");
    }
  }

  async function reject(id: string) {
    try {
      const res = await fetch(`/api/users/${id}/reject`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showSuccess("הבקשה נדחתה");
        fetchUsers();
      } else {
        showError(data.error ?? "שגיאה");
      }
    } catch {
      showError("שגיאה");
    }
  }

  const roleLabel = (r: string) => (r === "ADMIN" ? "Admin" : "מנהל עמותה");
  const statusLabel = (s: string | null) => {
    if (!s) return "–";
    const m: Record<string, string> = { PENDING: "ממתין", APPROVED: "אושר", REJECTED: "נדחה" };
    return m[s] ?? s;
  };

  return (
    <>
      <Topbar title="משתמשים והרשאות" subtitle="עובדי החברה + מנהלי עמותות" />

      <div className="card-dark p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#5c3d9a]/10">
            <Users size={22} className="text-[#5c3d9a]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[--color-text]">משתמשי מערכת</div>
            <div className="text-sm text-[--color-muted]">Admin · מנהלי עמותות</div>
          </div>
        </div>
        <a href="/register" className="btn-primary flex items-center gap-2">
          <UserPlus size={16} /> הרשמת עמותה
        </a>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { key: "pending", label: "בקשות ממתינות", icon: Clock },
          { key: "active", label: "משתמשים פעילים", icon: CheckCircle },
          { key: "all", label: "הכל", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as "pending" | "active" | "all")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-[#5c3d9a] text-white"
                : "bg-[--color-surface] border border-[--color-border] text-[--color-text] hover:border-[#5c3d9a]/50"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="card-dark overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[--color-muted]">טוען...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-[--color-muted]">אין משתמשים</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[--color-border]">
                <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">
                  שם
                </th>
                <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">
                  תפקיד
                </th>
                <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">
                  אימייל
                </th>
                <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">
                  ארגון
                </th>
                <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">
                  סטטוס
                </th>
                {tab === "pending" && (
                  <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">
                    פעולות
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[--color-border]/50 hover:bg-[--color-surface]/50"
                >
                  <td className="p-4 text-[13px] font-medium text-[--color-text]">{user.name}</td>
                  <td className="p-4">
                    <span
                      className={`badge ${
                        user.role === "ADMIN" ? "badge-purple" : "badge-info"
                      }`}
                    >
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td className="p-4 text-[13px] text-[--color-muted]">{user.email}</td>
                  <td className="p-4 text-[13px] text-[--color-text]">
                    {user.organizationName}
                    {user.organizationNumber !== "–" && ` (${user.organizationNumber})`}
                  </td>
                  <td className="p-4">
                    <span
                      className={`badge ${
                        user.status === "PENDING"
                          ? "badge-warning"
                          : user.status === "APPROVED"
                            ? "badge-success"
                            : "badge-danger"
                      }`}
                    >
                      {statusLabel(user.status)}
                    </span>
                  </td>
                  {tab === "pending" && (
                    <td className="p-4 flex gap-2 justify-end">
                      <button
                        onClick={() => approve(user.id)}
                        className="p-2 rounded-lg bg-[#2ecc8f]/15 text-[#2ecc8f] hover:bg-[#2ecc8f]/25 transition-colors"
                        title="אישור"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => reject(user.id)}
                        className="p-2 rounded-lg bg-[#e8445a]/15 text-[#e8445a] hover:bg-[#e8445a]/25 transition-colors"
                        title="דחייה"
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
