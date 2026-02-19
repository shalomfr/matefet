"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { Zap, Play, Pause, CheckCircle2, Clock, Plus, Settings, ArrowLeft, ToggleRight, ToggleLeft } from "lucide-react";

const workflows = [
  { name: "קבלה אוטומטית לתרומה", trigger: "תרומה חדשה", actions: "הפקת קבלה → שליחת מייל → עדכון דוח", runs: 142, status: "active", lastRun: "לפני 12 דקות" },
  { name: "תזכורת אישור ניהול תקין", trigger: "30 יום לפני תפוגה", actions: "שליחת מייל → יצירת משימה", runs: 8, status: "active", lastRun: "לפני 2 ימים" },
  { name: "סיכום ישיבת ועד אוטומטי", trigger: "סיום ישיבה", actions: "יצירת פרוטוקול → שליחה לחברי ועד", runs: 18, status: "active", lastRun: "15.02.2026" },
  { name: "דוח חודשי אוטומטי", trigger: "1 בכל חודש", actions: "הפקת דוח → שליחה להנהלה", runs: 12, status: "active", lastRun: "01.02.2026" },
  { name: "תזכורת דוח שנתי", trigger: "60 יום לפני deadline", actions: "שליחת מייל → יצירת משימות", runs: 3, status: "active", lastRun: "01.01.2026" },
  { name: "ברכות חגים לתורמים", trigger: "ערב חג", actions: "שליחת WhatsApp + מייל", runs: 248, status: "active", lastRun: "14.12.2025" },
  { name: "אישור שעות מתנדבים חודשי", trigger: "סוף חודש", actions: "סיכום שעות → שליחת אישור", runs: 48, status: "active", lastRun: "31.01.2026" },
  { name: "התראת חריגה מתקציב", trigger: "חריגה מעל 90%", actions: "שליחת התראה → הודעת WhatsApp", runs: 5, status: "active", lastRun: "12.02.2026" },
  { name: "גיבוי מסמכים אוטומטי", trigger: "כל שבוע", actions: "גיבוי ל-Google Drive", runs: 52, status: "active", lastRun: "17.02.2026" },
  { name: "עדכון סטטוס מרשם העמותות", trigger: "כל חודש", actions: "בדיקת API → עדכון סטטוס", runs: 12, status: "paused", lastRun: "01.02.2026" },
];

const recentExecutions = [
  { workflow: "קבלה אוטומטית לתרומה", trigger: "תרומה ₪5,000 - דוד לוי", time: "לפני 12 דקות", status: "success" },
  { workflow: "קבלה אוטומטית לתרומה", trigger: "תרומה ₪1,200 - שרה כהן", time: "לפני שעה", status: "success" },
  { workflow: "התראת חריגה מתקציב", trigger: "סעיף 'פעילויות' - 92%", time: "לפני 3 שעות", status: "success" },
  { workflow: "דוח חודשי אוטומטי", trigger: "תזמון חודשי", time: "01.02.2026", status: "success" },
  { workflow: "עדכון סטטוס מרשם העמותות", trigger: "תזמון חודשי", time: "01.02.2026", status: "error" },
];

export default function AutomationPage() {
  const activeCount = workflows.filter((w) => w.status === "active").length;
  const totalRuns = workflows.reduce((sum, w) => sum + w.runs, 0);

  return (
    <>
      <Topbar title="אוטומציות" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Zap} label="אוטומציות פעילות" value={String(activeCount)} color="#7c5cfc" />
        <StatCard icon={Play} label="סה״כ הרצות" value={String(totalRuns)} change="+142" trend="up" color="#34d399" />
        <StatCard icon={CheckCircle2} label="אחוז הצלחה" value="99.2%" color="#60a5fa" />
        <StatCard icon={Clock} label="הרצה אחרונה" value="12 דק'" color="#e879f9" />
      </div>

      {/* Create New Banner */}
      <div className="gradient-banner p-5 mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-white text-lg font-bold mb-1">בנה אוטומציה חדשה</h3>
          <p className="text-white/70 text-sm">הגדר טריגר, תנאים ופעולות - והכל רץ לבד</p>
        </div>
        <button className="bg-white text-[#7c5cfc] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all">
          <Plus size={16} /> צור אוטומציה
        </button>
      </div>

      {/* Workflows Grid */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1e1b3a]">אוטומציות ({workflows.length})</h3>
          <div className="flex gap-2">
            {["הכל", "פעילות", "מושהות"].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  i === 0 ? "bg-[#7c5cfc]/10 text-[#7c5cfc]" : "text-[#9b98b8] hover:bg-white/40"
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
              className="p-4 rounded-xl bg-white/30 border border-white/50 hover:bg-white/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    wf.status === "active" ? "bg-[#7c5cfc]/10" : "bg-gray-200/50"
                  }`}>
                    <Zap size={17} className={wf.status === "active" ? "text-[#7c5cfc]" : "text-gray-400"} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1e1b3a]">{wf.name}</div>
                    <div className="text-xs text-[#9b98b8]">טריגר: {wf.trigger}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="badge badge-purple">{wf.runs} הרצות</span>
                  <span className="text-xs text-[#9b98b8]">{wf.lastRun}</span>
                  <button className="text-[#9b98b8] hover:text-[#7c5cfc]">
                    {wf.status === "active" ? <ToggleRight size={22} className="text-[#7c5cfc]" /> : <ToggleLeft size={22} />}
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-white/60 text-[#9b98b8]">
                    <Settings size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mr-12 text-xs text-[#6b6894]">
                <span className="bg-amber-100/50 text-amber-700 px-2 py-0.5 rounded-md">טריגר</span>
                <ArrowLeft size={12} className="text-[#9b98b8]" />
                {wf.actions.split("→").map((action, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="bg-emerald-100/50 text-emerald-700 px-2 py-0.5 rounded-md">
                      {action.trim()}
                    </span>
                    {i < wf.actions.split("→").length - 1 && <ArrowLeft size={12} className="text-[#9b98b8]" />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Executions */}
      <div className="glass-card p-5">
        <h3 className="text-base font-bold text-[#1e1b3a] mb-4">הרצות אחרונות</h3>
        <div className="space-y-2">
          {recentExecutions.map((exec, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/40 transition-colors">
              <div className="flex items-center gap-3">
                {exec.status === "success" ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center text-white text-[8px] font-bold">!</div>
                )}
                <div>
                  <div className="text-sm font-medium text-[#1e1b3a]">{exec.workflow}</div>
                  <div className="text-xs text-[#9b98b8]">{exec.trigger}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${exec.status === "success" ? "badge-success" : "badge-danger"}`}>
                  {exec.status === "success" ? "הצלחה" : "שגיאה"}
                </span>
                <span className="text-xs text-[#9b98b8]">{exec.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
