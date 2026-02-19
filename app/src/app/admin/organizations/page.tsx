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
    <>
      <Topbar title="ניהול ארגונים" subtitle="כל העמותות שמעטפת משרתת" />

      <div className="card-dark p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4a7cff]/10 flex items-center justify-center">
            <Building2 size={22} className="text-[#4a7cff]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[--color-text]">{organizations.length} ארגונים</div>
            <div className="text-sm text-[--color-muted]">ניהול עמותות ומנויים</div>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} /> הוסף ארגון
        </button>
      </div>

      <div className="card-dark overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--color-border]">
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">ארגון</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">מס׳ רישום</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">תוכנית</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">תוקף מנוי</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">סטטוס</th>
              <th className="text-right p-4 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org, i) => (
              <tr key={org.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="p-4 text-[13px] font-medium text-[--color-text]">{org.name}</td>
                <td className="p-4 text-[13px] text-[--color-muted]">{org.id}</td>
                <td className="p-4 text-[13px] text-[--color-text]">{org.plan}</td>
                <td className="p-4 text-[13px] text-[--color-muted]">{org.expiry}</td>
                <td className="p-4">
                  <span className={`badge ${org.status === "פעיל" ? "badge-success" : "badge-warning"}`}>
                    {org.status}
                  </span>
                </td>
                <td className="p-4">
                  <a
                    href={`/portal?org=${org.id}`}
                    className="inline-flex items-center gap-1.5 text-[12px] text-[#4a7cff] font-semibold hover:underline"
                  >
                    <ExternalLink size={12} /> פתח בפורטל
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
