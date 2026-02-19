"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { Building2, Link2, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <>
      <Topbar
        title="דשבורד פנימי"
        subtitle="מעטפת ניהולית · עדכון אחרון: היום"
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Building2} label="ארגונים פעילים" value="12" color="#5c3d9a" />
        <StatCard icon={Link2} label="אינטגרציות מחוברות" value="8/10" color="#2ecc8f" />
        <StatCard icon={Zap} label="אוטומציות פעילות" value="10" color="#a78bfa" />
        <StatCard icon={AlertTriangle} label="התראות" value="3" color="#f5a623" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card-dark p-5">
          <h3 className="text-base font-bold text-[--color-text] mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#f5a623]" />
            ארגונים שדורשים תשומת לב
          </h3>
          <div className="space-y-2">
            {[
              { org: "עמותת אור לציון", issue: "אישור ניהול תקין פג בעוד 14 יום" },
              { org: "קרן חסד", issue: "אינטגרציית רשם העמותות מנותקת" },
              { org: "אגודת הסטודנטים", issue: "דוח שנתי לא הוגש" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[--color-surface2] border border-[--color-border] flex items-center justify-between"
              >
                <div>
                  <div className="text-[13px] font-medium text-[--color-text]">{item.org}</div>
                  <div className="text-[11px] text-[--color-muted]">{item.issue}</div>
                </div>
                <button className="text-[11px] text-[#5c3d9a] font-semibold hover:underline">טפל</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark p-5">
          <h3 className="text-base font-bold text-[--color-text] mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#2ecc8f]" />
            סנכרונים אחרונים
          </h3>
          <div className="space-y-2">
            {[
              { integration: "חשבונית ירוקה", time: "לפני 5 דקות", status: "success" },
              { integration: "רשם העמותות", time: "לפני יום", status: "success" },
              { integration: "Tranzila", time: "לפני 12 דקות", status: "success" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03]"
              >
                <span className="text-[13px] font-medium text-[--color-text]">{item.integration}</span>
                <span className="text-[11px] text-[--color-muted]">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
