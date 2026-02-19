"use client";
import Topbar from "@/components/Topbar";
import { Users, UserPlus } from "lucide-react";

const users = [
  { name: "שלום כהן", role: "Admin", email: "shalom@matefet.co.il", orgs: "כל הארגונים" },
  { name: "מרים לוי", role: "Support", email: "miri@matefet.co.il", orgs: "אור לציון, קרן חסד" },
  { name: "אברהם יצחקי", role: "Viewer", email: "avi@matefet.co.il", orgs: "קרן חסד" },
];

export default function AdminUsersPage() {
  return (
    <>
      <Topbar title="משתמשים והרשאות" subtitle="עובדי החברה + מנהלי עמותות" />

      <div className="card-dark p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4a7cff]/10 flex items-center justify-center">
            <Users size={22} className="text-[#4a7cff]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[--color-text]">משתמשי מערכת</div>
            <div className="text-sm text-[--color-muted]">Admin · Support · Viewer</div>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus size={16} /> הוסף משתמש
        </button>
      </div>

      <div className="card-dark overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--color-border]">
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">שם</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">תפקיד</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">אימייל</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">ארגונים</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="p-4 text-[13px] font-medium text-[--color-text]">{user.name}</td>
                <td className="p-4">
                  <span className={`badge ${
                    user.role === "Admin" ? "badge-danger" :
                    user.role === "Support" ? "badge-warning" : "badge-info"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-[13px] text-[--color-muted]">{user.email}</td>
                <td className="p-4 text-[13px] text-[--color-text]">{user.orgs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
