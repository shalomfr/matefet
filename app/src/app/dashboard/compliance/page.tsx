"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  Eye,
  Calendar,
  FileText,
} from "lucide-react";

const complianceItems = [
  { name: "תעודת רישום עמותה", status: "valid", expiry: "ללא תפוגה", lastUpdate: "12.01.2020" },
  { name: "אישור ניהול תקין", status: "warning", expiry: "19.03.2026", lastUpdate: "20.03.2025" },
  { name: "אישור סעיף 46", status: "valid", expiry: "31.12.2026", lastUpdate: "01.01.2026" },
  { name: "תקנון העמותה (מעודכן)", status: "valid", expiry: "ללא תפוגה", lastUpdate: "15.06.2024" },
  { name: "דוח כספי שנתי 2025", status: "valid", expiry: "—", lastUpdate: "15.02.2026" },
  { name: "דוח מילולי שנתי 2025", status: "valid", expiry: "—", lastUpdate: "15.02.2026" },
  { name: "פרוטוקול אסיפה כללית", status: "valid", expiry: "—", lastUpdate: "01.12.2025" },
  { name: "רשימת חברי ועד מנהל", status: "valid", expiry: "—", lastUpdate: "01.12.2025" },
  { name: "דוח כספי רבעוני Q1/2026", status: "pending", expiry: "31.03.2026", lastUpdate: "—" },
  { name: "דיווח שנתי לרשם העמותות", status: "valid", expiry: "—", lastUpdate: "28.01.2026" },
];

const annualReports = [
  { year: "2025", financial: "הוגש", verbal: "הוגש", registrar: "הוגש", tax: "הוגש" },
  { year: "2024", financial: "הוגש", verbal: "הוגש", registrar: "הוגש", tax: "הוגש" },
  { year: "2023", financial: "הוגש", verbal: "הוגש", registrar: "הוגש", tax: "הוגש" },
];

const upcomingDeadlines = [
  { task: "חידוש אישור ניהול תקין", date: "19.03.2026", daysLeft: 28, priority: "high" },
  { task: "הגשת דוח רבעוני Q1 למס הכנסה", date: "31.03.2026", daysLeft: 40, priority: "medium" },
  { task: "אסיפה כללית שנתית", date: "30.04.2026", daysLeft: 70, priority: "low" },
  { task: "חידוש אישור סעיף 46", date: "31.12.2026", daysLeft: 315, priority: "low" },
];

export default function CompliancePage() {
  const validCount = complianceItems.filter((i) => i.status === "valid").length;
  const warningCount = complianceItems.filter((i) => i.status === "warning").length;
  const pendingCount = complianceItems.filter((i) => i.status === "pending").length;

  return (
    <>
      <Topbar title="ניהול תקין" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={ShieldCheck} label="ציון ניהול תקין" value="96%" change="+3%" trend="up" color="#34d399" />
        <StatCard icon={FileCheck} label="מסמכים תקינים" value={`${validCount}/${complianceItems.length}`} color="#7c5cfc" />
        <StatCard icon={AlertTriangle} label="דורשים טיפול" value={String(warningCount + pendingCount)} color="#fbbf24" />
        <StatCard icon={Clock} label="דדליין קרוב" value="28 יום" color="#f87171" />
      </div>

      {/* Compliance Score Banner */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1e1b3a]">סטטוס ניהול תקין מלא</h3>
            <p className="text-sm text-[#9b98b8]">עדכון אחרון: היום</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-[#6b6894]">תקין ({validCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="text-xs text-[#6b6894]">דורש טיפול ({warningCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-400"></span>
              <span className="text-xs text-[#6b6894]">ממתין ({pendingCount})</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {complianceItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.status === "valid" ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : item.status === "warning" ? (
                  <AlertTriangle size={18} className="text-amber-400" />
                ) : (
                  <Clock size={18} className="text-blue-400" />
                )}
                <span className="text-sm font-medium text-[#1e1b3a]">{item.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-[#9b98b8]">תפוגה: {item.expiry}</span>
                <span className="text-xs text-[#9b98b8]">עדכון: {item.lastUpdate}</span>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-white/60 text-[#9b98b8]">
                    <Eye size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-white/60 text-[#9b98b8]">
                    <Download size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-white/60 text-[#9b98b8]">
                    <Upload size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-[#1e1b3a] mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-[#7c5cfc]" />
            דדליינים קרובים
          </h3>
          <div className="space-y-3">
            {upcomingDeadlines.map((item) => (
              <div key={item.task} className="p-3 rounded-xl bg-white/30 border border-white/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#1e1b3a]">{item.task}</span>
                  <span
                    className={`badge ${
                      item.priority === "high" ? "badge-danger" : item.priority === "medium" ? "badge-warning" : "badge-info"
                    }`}
                  >
                    {item.daysLeft} ימים
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9b98b8]">{item.date}</span>
                  <button className="text-xs text-[#7c5cfc] font-semibold">טפל עכשיו</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Annual Reports */}
        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-[#1e1b3a] mb-4 flex items-center gap-2">
            <FileText size={18} className="text-[#7c5cfc]" />
            דוחות שנתיים
          </h3>
          <table className="glass-table">
            <thead>
              <tr>
                <th>שנה</th>
                <th>דוח כספי</th>
                <th>דוח מילולי</th>
                <th>רשם העמותות</th>
                <th>מס הכנסה</th>
              </tr>
            </thead>
            <tbody>
              {annualReports.map((r) => (
                <tr key={r.year}>
                  <td className="font-bold">{r.year}</td>
                  <td><span className="badge badge-success">{r.financial}</span></td>
                  <td><span className="badge badge-success">{r.verbal}</span></td>
                  <td><span className="badge badge-success">{r.registrar}</span></td>
                  <td><span className="badge badge-success">{r.tax}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
            <FileText size={16} />
            צור דוח שנתי 2026 אוטומטית
          </button>
        </div>
      </div>
    </>
  );
}
