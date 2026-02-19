"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { BarChart3, TrendingUp, FileText, Download, Calendar, Filter, PieChart } from "lucide-react";

const months = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"];
const incomeData = [45, 62, 78, 55, 90, 72, 88, 95, 68, 82, 110, 145];
const expenseData = [38, 42, 55, 48, 60, 58, 65, 70, 52, 62, 75, 85];

const savedReports = [
  { name: "דוח כספי שנתי 2025", type: "כספי", created: "15.02.2026", format: "PDF" },
  { name: "דוח ניהול תקין 2025", type: "ניהול תקין", created: "28.01.2026", format: "PDF" },
  { name: "סיכום פעילות שנתי 2025", type: "מילולי", created: "15.02.2026", format: "PDF" },
  { name: "דוח רבעוני Q4/2025", type: "כספי", created: "05.01.2026", format: "Excel" },
];

export default function ReportsPage() {
  const maxVal = Math.max(...incomeData);

  return (
    <>
      <Topbar title="דוחות ואנליטיקס" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={BarChart3} label="הכנסות שנתיות" value="₪890K" change="+22%" trend="up" color="#4a7cff" />
        <StatCard icon={TrendingUp} label="צמיחה שנתית" value="+22%" change="מ-2024" trend="up" color="#2ecc8f" />
        <StatCard icon={FileText} label="דוחות שנוצרו" value="24" color="#a78bfa" />
        <StatCard icon={PieChart} label="דוח מתוזמן הבא" value="01.03" color="#f5a623" />
      </div>

      <div className="card-dark p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-[--color-text]">הכנסות מול הוצאות - 2025</h3>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4a7cff]"></span>
              <span className="text-xs text-[--color-muted]">הכנסות</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#a78bfa]"></span>
              <span className="text-xs text-[--color-muted]">הוצאות</span>
            </div>
            <button className="btn-secondary flex items-center gap-2 !py-1 !text-xs">
              <Calendar size={12} /> 2025
            </button>
          </div>
        </div>

        <div className="flex items-end gap-3 h-52">
          {months.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end" style={{ height: "200px" }}>
                <div
                  className="flex-1 rounded-t-md bg-[#4a7cff] transition-all hover:bg-[#3a6cee]"
                  style={{ height: `${(incomeData[i] / maxVal) * 100}%` }}
                />
                <div
                  className="flex-1 rounded-t-md bg-[#a78bfa] transition-all hover:bg-[#9678f0]"
                  style={{ height: `${(expenseData[i] / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[--color-muted]">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card-dark p-5">
          <h3 className="text-base font-bold text-[--color-text] mb-4">הפקת דוח מהיר</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "דוח כספי חודשי", icon: "💰" },
              { label: "דוח ניהול תקין", icon: "✅" },
              { label: "דוח רגולטורי", icon: "📋" },
              { label: "דוח מותאם אישי", icon: "📊" },
            ].map((report) => (
              <button key={report.label} className="action-btn text-right">
                <div className="text-xl mb-1.5">{report.icon}</div>
                <div className="text-[12px] font-medium text-[--color-text]">{report.label}</div>
                <div className="text-[10px] text-[--color-muted] mt-0.5">הפק עכשיו</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card-dark p-5">
          <h3 className="text-base font-bold text-[--color-text] mb-4">מדדים מרכזיים</h3>
          <div className="space-y-3">
            {[
              { label: "יחס הכנסות/הוצאות", value: "1.48", target: "מעל 1.0" },
              { label: "עלות גיוס", value: "8.2%", target: "מתחת ל-15%" },
              { label: "ניצול תקציב", value: "72%", target: "70%-90%" },
              { label: "ימי מזומנים", value: "94", target: "מעל 60 יום" },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between p-3 rounded-lg bg-[--color-surface2]">
                <div>
                  <div className="text-[13px] font-medium text-[--color-text]">{metric.label}</div>
                  <div className="text-[11px] text-[--color-muted]">יעד: {metric.target}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#4a7cff]">{metric.value}</span>
                  <span className="status-dot active"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-dark p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[--color-text]">דוחות שמורים</h3>
          <button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs">
            <Filter size={14} /> סינון
          </button>
        </div>
        <div className="space-y-1">
          {savedReports.map((report) => (
            <div key={report.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-[#4a7cff]" />
                <div>
                  <div className="text-[13px] font-medium text-[--color-text]">{report.name}</div>
                  <div className="text-[11px] text-[--color-muted]">{report.created} • {report.format}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-info">{report.type}</span>
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#4a7cff]">
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
