"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { Zap, Play, CheckCircle2, Clock, Plus, Settings, ArrowLeft, ToggleRight, ToggleLeft } from "lucide-react";

const workflows = [
  { name: "קבלה אוטומטית לתרומה", trigger: "תרומה חדשה", actions: "הפקת קבלה → שליחת מייל → עדכון דוח", runs: 142, status: "active", lastRun: "לפני 12 דקות" },
  { name: "תזכורת אישור ניהול תקין", trigger: "30 יום לפני תפוגה", actions: "שליחת מייל → יצירת משימה", runs: 8, status: "active", lastRun: "לפני 2 ימים" },
  { name: "סיכום ישיבת ועד אוטומטי", trigger: "סיום ישיבה", actions: "יצירת פרוטוקול → שליחה לחברי ועד", runs: 18, status: "active", lastRun: "15.02.2026" },
  { name: "דוח חודשי אוטומטי", trigger: "1 בכל חודש", actions: "הפקת דוח → שליחה להנהלה", runs: 12, status: "active", lastRun: "01.02.2026" },
  { name: "תזכורת דוח שנתי", trigger: "60 יום לפני deadline", actions: "שליחת מייל → יצירת משימות", runs: 3, status: "active", lastRun: "01.01.2026" },
  { name: "עדכון סטטוס מרשם העמותות", trigger: "כל חודש", actions: "בדיקת API → עדכון סטטוס", runs: 12, status: "paused", lastRun: "01.02.2026" },
];

const recentExecutions = [
  { workflow: "קבלה אוטומטית לתרומה", trigger: "תרומה ₪5,000 - דוד לוי", time: "לפני 12 דקות", status: "success" },
  { workflow: "קבלה אוטומטית לתרומה", trigger: "תרומה ₪1,200 - שרה כהן", time: "לפני שעה", status: "success" },
  { workflow: "התראת חריגה מתקציב", trigger: "סעיף 'פעילויות' - 92%", time: "לפני 3 שעות", status: "success" },
  { workflow: "עדכון סטטוס מרשם העמותות", trigger: "תזמון חודשי", time: "01.02.2026", status: "error" },
];

export default function AdminAutomationPage() {
  const activeCount = workflows.filter((w) => w.status === "active").length;
  const totalRuns = workflows.reduce((sum, w) => sum + w.runs, 0);

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="אוטומציות" subtitle="ניהול workflows ותזמונים" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Zap} label="אוטומציות פעילות" value={String(activeCount)} color="#2563eb" />
        <StatCard icon={Play} label="סה״כ הרצות" value={String(totalRuns)} change="+142" trend="up" color="#2ecc8f" />
        <StatCard icon={CheckCircle2} label="אחוז הצלחה" value="99.2%" color="#60a5fa" />
        <StatCard icon={Clock} label="הרצה אחרונה" value="12 דק'" color="#f5a623" />
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-5 mb-6 border-r-4 border-r-[#2563eb] flex items-center justify-between" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div>
          <h3 className="text-lg font-bold text-[#1e293b] mb-1">בנה אוטומציה חדשה</h3>
          <p className="text-sm text-[#64748b]">הגדר טריגר, תנאים ופעולות - והכל רץ לבד</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} /> צור אוטומציה
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-5 mb-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1e293b]">אוטומציות ({workflows.length})</h3>
          <div className="flex gap-2">
            {["הכל", "פעילות", "מושהות"].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  i === 0 ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#64748b] hover:bg-[#f8f9fc]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {workflows.map((wf) => (
            <div
              key={wf.name}
              className="p-4 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4] hover:border-[#2563eb]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    wf.status === "active" ? "bg-[#eff6ff]" : "bg-[#e8ecf4]/30"
                  }`}>
                    <Zap size={17} className={wf.status === "active" ? "text-[#2563eb]" : "text-[#64748b]"} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1e293b]">{wf.name}</div>
                    <div className="text-xs text-[#64748b]">טריגר: {wf.trigger}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="badge badge-purple">{wf.runs} הרצות</span>
                  <span className="text-xs text-[#64748b]">{wf.lastRun}</span>
                  <button className="text-[#64748b] hover:text-[#2563eb]">
                    {wf.status === "active" ? <ToggleRight size={22} className="text-[#2563eb]" /> : <ToggleLeft size={22} />}
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b]">
                    <Settings size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mr-12 text-xs text-[#64748b]">
                <span className="badge badge-warning">טריגר</span>
                <ArrowLeft size={12} className="text-[#64748b]" />
                {wf.actions.split("→").map((action, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="badge badge-success">{action.trim()}</span>
                    {i < wf.actions.split("→").length - 1 && <ArrowLeft size={12} className="text-[#64748b]" />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-5" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <h3 className="text-base font-bold text-[#1e293b] mb-4">הרצות אחרונות</h3>
        <div className="space-y-2">
          {recentExecutions.map((exec, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f9fc] transition-colors">
              <div className="flex items-center gap-3">
                {exec.status === "success" ? (
                  <CheckCircle2 size={16} className="text-[#2ecc8f]" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-[#e8445a] flex items-center justify-center text-white text-[8px] font-bold">!</div>
                )}
                <div>
                  <div className="text-sm font-medium text-[#1e293b]">{exec.workflow}</div>
                  <div className="text-xs text-[#64748b]">{exec.trigger}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${exec.status === "success" ? "badge-success" : "badge-danger"}`}>
                  {exec.status === "success" ? "הצלחה" : "שגיאה"}
                </span>
                <span className="text-xs text-[#64748b]">{exec.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
