"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { BarChart3, Building2, Zap, TrendingUp } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="דוחות פנימיים" subtitle="סטטיסטיקות ושימוש" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Building2} label="ארגונים פעילים" value="12" color="#2563eb" />
        <StatCard icon={Zap} label="הרצות החודש" value="1,247" change="+18%" trend="up" color="#2ecc8f" />
        <StatCard icon={TrendingUp} label="שימוש ממוצע" value="94%" color="#60a5fa" />
        <StatCard icon={BarChart3} label="דוחות שנוצרו" value="48" color="#f5a623" />
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <h3 className="text-base font-bold text-[#1e293b] mb-4">שימוש לפי ארגון</h3>
        <div className="space-y-3">
          {[
            { org: "עמותת אור לציון", usage: 98, barColor: "#2ecc8f" },
            { org: "קרן חסד", usage: 85, barColor: "#2563eb" },
            { org: "אגודת הסטודנטים", usage: 62, barColor: "#f5a623" },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-medium text-[#1e293b]">{item.org}</span>
                <span className="text-[13px] font-bold text-[#64748b]">{item.usage}%</span>
              </div>
              <div className="h-2 bg-[#f8f9fc] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.usage}%`, background: item.barColor }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
