"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { BarChart3, TrendingUp, FileText, Download, Calendar, Filter, PieChart } from "lucide-react";

const months = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"];
const incomeData = [45, 62, 78, 55, 90, 72, 88, 95, 68, 82, 110, 145];
const expenseData = [38, 42, 55, 48, 60, 58, 65, 70, 52, 62, 75, 85];

const savedReports = [
  { name: "דוח כספי שנתי 2025", type: "כספי", created: "15.02.2026", format: "PDF" },
  { name: "דוח תורמים Q4/2025", type: "תורמים", created: "05.01.2026", format: "Excel" },
  { name: "דוח ניהול תקין 2025", type: "ניהול תקין", created: "28.01.2026", format: "PDF" },
  { name: "סיכום פעילות שנתי 2025", type: "מילולי", created: "15.02.2026", format: "PDF" },
  { name: "דוח שעות מתנדבים 2025", type: "מתנדבים", created: "01.01.2026", format: "Excel" },
];

export default function ReportsPage() {
  const maxVal = Math.max(...incomeData);

  return (
    <>
      <Topbar title="דוחות ואנליטיקס" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={BarChart3} label="הכנסות שנתיות" value="₪890K" change="+22%" trend="up" color="#7c5cfc" />
        <StatCard icon={TrendingUp} label="צמיחה שנתית" value="+22%" change="מ-2024" trend="up" color="#34d399" />
        <StatCard icon={FileText} label="דוחות שנוצרו" value="24" color="#60a5fa" />
        <StatCard icon={PieChart} label="דוח מתוזמן הבא" value="01.03" color="#e879f9" />
      </div>

      {/* Chart Area */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-[#1e1b3a]">הכנסות מול הוצאות - 2025</h3>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#7c5cfc]"></span>
              <span className="text-xs text-[#6b6894]">הכנסות</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#e879f9]"></span>
              <span className="text-xs text-[#6b6894]">הוצאות</span>
            </div>
            <button className="btn-secondary flex items-center gap-2 !py-1 !text-xs">
              <Calendar size={12} /> 2025
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end gap-3 h-52">
          {months.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end" style={{ height: "200px" }}>
                <div
                  className="flex-1 rounded-t-md bg-[#7c5cfc] transition-all hover:bg-[#6a4ce8]"
                  style={{ height: `${(incomeData[i] / maxVal) * 100}%` }}
                  title={`הכנסות: ₪${incomeData[i]}K`}
                />
                <div
                  className="flex-1 rounded-t-md bg-[#e879f9] transition-all hover:bg-[#d660e6]"
                  style={{ height: `${(expenseData[i] / maxVal) * 100}%` }}
                  title={`הוצאות: ₪${expenseData[i]}K`}
                />
              </div>
              <span className="text-xs text-[#9b98b8]">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Quick Reports */}
        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-[#1e1b3a] mb-4">הפקת דוח מהיר</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "דוח כספי חודשי", icon: "💰" },
              { label: "דוח תורמים", icon: "❤️" },
              { label: "דוח ניהול תקין", icon: "✅" },
              { label: "דוח מתנדבים", icon: "🤝" },
              { label: "דוח אוטומציות", icon: "⚡" },
              { label: "דוח מותאם אישית", icon: "📊" },
            ].map((report) => (
              <button
                key={report.label}
                className="p-4 rounded-xl bg-white/30 border border-white/50 hover:bg-white/50 hover:shadow-md transition-all text-right"
              >
                <div className="text-2xl mb-2">{report.icon}</div>
                <div className="text-sm font-semibold text-[#1e1b3a]">{report.label}</div>
                <div className="text-xs text-[#9b98b8] mt-1">הפק עכשיו</div>
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-[#1e1b3a] mb-4">מדדים מרכזיים</h3>
          <div className="space-y-4">
            {[
              { label: "יחס הכנסות/הוצאות", value: "1.48", target: "מעל 1.0", status: "good" },
              { label: "עלות גיוס", value: "8.2%", target: "מתחת ל-15%", status: "good" },
              { label: "שימור תורמים", value: "82%", target: "מעל 75%", status: "good" },
              { label: "ניצול תקציב", value: "72%", target: "70%-90%", status: "good" },
              { label: "ימי מזומנים", value: "94", target: "מעל 60 יום", status: "good" },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between p-3 rounded-xl bg-white/20">
                <div>
                  <div className="text-sm font-medium text-[#1e1b3a]">{metric.label}</div>
                  <div className="text-xs text-[#9b98b8]">יעד: {metric.target}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#7c5cfc]">{metric.value}</span>
                  <span className="status-dot active"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Reports */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1e1b3a]">דוחות שמורים</h3>
          <button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs">
            <Filter size={14} /> סינון
          </button>
        </div>
        <div className="space-y-2">
          {savedReports.map((report) => (
            <div key={report.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/40 transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-[#7c5cfc]" />
                <div>
                  <div className="text-sm font-medium text-[#1e1b3a]">{report.name}</div>
                  <div className="text-xs text-[#9b98b8]">{report.created} • {report.format}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-purple">{report.type}</span>
                <button className="p-1.5 rounded-lg hover:bg-white/60 text-[#7c5cfc]">
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
