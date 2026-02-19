"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { BarChart3, Building2, Zap, TrendingUp } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <>
      <Topbar title="דוחות פנימיים" subtitle="סטטיסטיקות ושימוש" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Building2} label="ארגונים פעילים" value="12" color="#4a7cff" />
        <StatCard icon={Zap} label="הרצות החודש" value="1,247" change="+18%" trend="up" color="#2ecc8f" />
        <StatCard icon={TrendingUp} label="שימוש ממוצע" value="94%" color="#a78bfa" />
        <StatCard icon={BarChart3} label="דוחות שנוצרו" value="48" color="#f5a623" />
      </div>

      <div className="card-dark p-6">
        <h3 className="text-base font-bold text-[--color-text] mb-4">שימוש לפי ארגון</h3>
        <div className="space-y-3">
          {[
            { org: "עמותת אור לציון", usage: 98, barColor: "#2ecc8f" },
            { org: "קרן חסד", usage: 85, barColor: "#4a7cff" },
            { org: "אגודת הסטודנטים", usage: 62, barColor: "#f5a623" },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-medium text-[--color-text]">{item.org}</span>
                <span className="text-[13px] font-bold text-[--color-muted]">{item.usage}%</span>
              </div>
              <div className="h-2 bg-[--color-surface2] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.usage}%`, background: item.barColor }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
