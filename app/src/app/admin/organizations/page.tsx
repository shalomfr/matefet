"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { Building2, ExternalLink, Plus } from "lucide-react";

interface OrgData {
  id: string;
  name: string;
  number: string;
  users: number;
  workflows: number;
  donations: number;
  createdAt: string;
}

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrgData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/admin")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setOrganizations(res.data.organizations ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="ניהול ארגונים" subtitle="כל העמותות שמעטפת משרתת" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="ניהול ארגונים" subtitle="כל העמותות שמעטפת משרתת" />

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-5 mb-6 flex items-center justify-between" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center">
            <Building2 size={22} className="text-[#2563eb]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#1e293b]">{organizations.length} ארגונים</div>
            <div className="text-sm text-[#64748b]">ניהול עמותות ומנויים</div>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} /> הוסף ארגון
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ecf4] overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        {organizations.length === 0 ? (
          <div className="p-8 text-center text-[#64748b]">אין נתונים</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8ecf4]">
                <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">ארגון</th>
                <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">מס׳ רישום</th>
                <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">משתמשים</th>
                <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">אוטומציות</th>
                <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">תרומות</th>
                <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">תאריך הצטרפות</th>
                <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="border-b border-[#e8ecf4]/50 hover:bg-[#f8f9fc]">
                  <td className="p-4 text-[13px] font-medium text-[#1e293b]">{org.name}</td>
                  <td className="p-4 text-[13px] text-[#64748b]">{org.number ?? "—"}</td>
                  <td className="p-4 text-[13px] text-[#1e293b]">{org.users}</td>
                  <td className="p-4 text-[13px] text-[#1e293b]">{org.workflows}</td>
                  <td className="p-4 text-[13px] text-[#1e293b]">{org.donations}</td>
                  <td className="p-4 text-[13px] text-[#64748b]">
                    {org.createdAt ? new Date(org.createdAt).toLocaleDateString("he-IL") : "—"}
                  </td>
                  <td className="p-4">
                    <a
                      href={`/portal?org=${org.id}`}
                      className="inline-flex items-center gap-1.5 text-[12px] text-[#2563eb] font-semibold hover:underline"
                    >
                      <ExternalLink size={12} /> פתח בפורטל
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
