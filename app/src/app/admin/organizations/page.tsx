"use client";
import Topbar from "@/components/Topbar";
import { Building2, ExternalLink, Plus } from "lucide-react";

const organizations = [
  { name: "עמותת אור לציון", id: "580123456", plan: "חודשי", expiry: "15.03.2026", status: "פעיל" },
  { name: "קרן חסד", id: "580234567", plan: "שנתי", expiry: "01.06.2026", status: "פעיל" },
  { name: "אגודת הסטודנטים", id: "580345678", plan: "חודשי", expiry: "28.02.2026", status: "נדרש חידוש" },
];

export default function AdminOrganizationsPage() {
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
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8ecf4]">
              <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">ארגון</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">מס׳ רישום</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">תוכנית</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">תוקף מנוי</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">סטטוס</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org, i) => (
              <tr key={org.id} className="border-b border-[#e8ecf4]/50 hover:bg-[#f8f9fc]">
                <td className="p-4 text-[13px] font-medium text-[#1e293b]">{org.name}</td>
                <td className="p-4 text-[13px] text-[#64748b]">{org.id}</td>
                <td className="p-4 text-[13px] text-[#1e293b]">{org.plan}</td>
                <td className="p-4 text-[13px] text-[#64748b]">{org.expiry}</td>
                <td className="p-4">
                  <span className={`badge ${org.status === "פעיל" ? "badge-success" : "badge-warning"}`}>
                    {org.status}
                  </span>
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
      </div>
    </div>
  );
}
