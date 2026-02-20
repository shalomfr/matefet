"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import {
  CheckCircle2, AlertTriangle, AlertCircle, FileCheck,
  Calendar, FileText, BarChart2, MessageCircle,
  X, Clock, Download, Shield, Sparkles, ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/Toast";

/* ── data ── */
const urgentTasks = [
  { title: "לחדש את אישור ניהול תקין", desc: "האישור פג בעוד 14 יום. בלי זה לא ניתן לקבל מענקים.", days: 14, date: "05.03.2026", level: "urgent" },
  { title: "לעדכן את התקנון – סעיף 12", desc: "נדרש עדכון קטן בגלל שינוי בחוק מינואר 2026.", days: 39, date: "31.03.2026", level: "soon" },
];

const approvals = [
  { title: "אישור פרוטוקול ישיבת ועד #14", date: "12.02.2026" },
  { title: "אישור שינוי תקנון – סעיף 7", date: "10.02.2026" },
];

const calendarEvents = [
  { title: "ישיבת ועד רבעונית", date: "28.02.2026", days: 9, color: "#2563eb" },
  { title: "הגשת דוח שנתי לרשם", date: "31.03.2026", days: 40, color: "#d97706" },
  { title: "חידוש ביטוח אחריות", date: "15.04.2026", days: 55, color: "#2563eb" },
];

const recentDocs = [
  { name: "פרוטוקול ישיבה #13", date: "01.02.2026", type: "PDF" },
  { name: "אישור ניהול תקין 2025", date: "15.01.2026", type: "PDF" },
  { name: "דוח כספי Q4", date: "10.01.2026", type: "XLSX" },
  { name: "תקנון עדכני", date: "05.01.2026", type: "PDF" },
];

const completedTasks = [
  { title: "דוח כספי רפרוני", subtitle: "הוגש · 15.02.2026", feedback: "כל הכבוד, הגשת בזמן!" },
  { title: "אישור ניהול תקין", subtitle: "תוקף עד מרץ 2026", feedback: "הושלם בזמן" },
];

const progressBars = [
  { label: "ממשל תאגידי", pct: 95, color: "#2563eb" },
  { label: "עמידה בדרישות", pct: 86, color: "#2563eb" },
  { label: "ניהול סיכונים", pct: 78, color: "#d97706" },
  { label: "מול רשות המסים", pct: 90, color: "#059669" },
];

type Status = "green" | "orange" | "red";

export default function PortalHomePage() {
  const { showSuccess } = useToast();
  const [notifVisible, setNotifVisible] = useState(true);
  const status = "orange" as Status;
  const score = 94;

  const statusText =
    status === "green" ? "הארגון שלך עומד בדרישות"
    : status === "orange" ? "יש 2 פריטים שדורשים תשומת לב"
    : "נדרש טיפול דחוף";

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="הפורטל שלי" subtitle="שלום יוסי · עמותת אור לציון" />

      {/* ─── NOTIFICATION BAR ─── */}
      {notifVisible && (
        <div className="anim-fade-down mb-6 bg-white rounded-2xl border border-[#fde68a] p-4 flex items-center justify-between" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#fffbeb] flex items-center justify-center">
              <AlertTriangle size={16} className="text-[#d97706]" />
            </div>
            <span className="text-[13px] text-[#1e293b] font-medium">
              שלחנו לך הודעה על חידוש אישור ניהול תקין – יש לטפל עד 05.03.2026
            </span>
          </div>
          <button onClick={() => setNotifVisible(false)} className="p-1.5 rounded-lg hover:bg-[#fef2f2] text-[#64748b] hover:text-[#ef4444] transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="anim-fade-scale delay-1"><StatCard icon={Shield} label="ציון ניהול תקין" value={String(score)} color="#2563eb" /></div>
        <div className="anim-fade-scale delay-2"><StatCard icon={AlertTriangle} label="משימות פתוחות" value={String(urgentTasks.length)} color="#d97706" /></div>
        <div className="anim-fade-scale delay-3"><StatCard icon={Calendar} label="ישיבה הבאה" value="9 ימים" color="#2563eb" /></div>
        <div className="anim-fade-scale delay-4"><StatCard icon={FileText} label="מסמכים" value={String(recentDocs.length)} color="#16a34a" /></div>
      </div>

      {/* ─── STATUS CARD WITH PROGRESS BARS ─── */}
      <div className="anim-fade-up delay-2 bg-white rounded-2xl p-6 mb-6 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-start justify-between gap-6 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              status === "green" ? "bg-[#f0fdf4]" : status === "orange" ? "bg-[#fffbeb]" : "bg-[#fef2f2]"
            }`}>
              {status === "green" ? <CheckCircle2 size={20} className="text-[#16a34a]" /> :
               status === "orange" ? <AlertTriangle size={20} className="text-[#d97706]" /> :
               <AlertCircle size={20} className="text-[#dc2626]" />}
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1e293b]">{statusText}</h3>
              <p className="text-[12px] text-[#64748b]">
                {status === "orange" ? "2 דברים לטפל בחודש הקרוב" : "אין בעיות דחופות"}
              </p>
            </div>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="text-[28px] font-bold text-[#2563eb]">{score}</div>
            <div className="text-[10px] text-[#64748b]">מתוך 100</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {progressBars.map((bar, i) => (
            <div key={bar.label} className={`anim-fade-up delay-${i + 3}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-[#1e293b]">{bar.label}</span>
                <span className="text-[12px] font-bold" style={{ color: bar.color }}>{bar.pct}%</span>
              </div>
              <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full anim-progress"
                  style={{
                    width: `${bar.pct}%`,
                    background: bar.color,
                    animationDelay: `${0.3 + i * 0.15}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <Link href="/portal/status" className="inline-flex items-center gap-1 mt-4 text-[12px] font-semibold text-[#2563eb] hover:underline">
          פרטים מלאים <ArrowLeft size={12} />
        </Link>
      </div>

      {/* ─── APPROVALS + URGENT TASKS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Approvals */}
        <div className="anim-fade-up delay-3 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Clock size={16} className="text-[#2563eb]" />
            </div>
            ממתין לאישורך ({approvals.length})
          </h3>
          <div className="space-y-2">
            {approvals.map((item, i) => (
              <div key={i} className={`anim-fade-right delay-${i + 2} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all`}>
                <div>
                  <div className="text-[13px] font-medium text-[#1e293b]">{item.title}</div>
                  <div className="text-[11px] text-[#64748b]">{item.date}</div>
                </div>
                <button
                  onClick={() => showSuccess("אישור נשלח!")}
                  className="text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] px-3 py-1.5 rounded-lg hover:bg-[#eff6ff] transition-all"
                >
                  אשר →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="anim-fade-up delay-4 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fffbeb] flex items-center justify-center">
              <AlertTriangle size={16} className="text-[#d97706]" />
            </div>
            משימות דחופות ({urgentTasks.length})
          </h3>
          <div className="space-y-2">
            {urgentTasks.map((task, i) => (
              <div key={i} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all ${
                task.level === "urgent" ? "border-r-[3px] border-r-[#ef4444]" : "border-r-[3px] border-r-[#d97706]"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${task.level === "urgent" ? "bg-[#fef2f2]" : "bg-[#fffbeb]"}`}>
                    {task.level === "urgent" ? <Shield size={14} className="text-[#ef4444]" /> : <FileText size={14} className="text-[#d97706]" />}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#1e293b]">{task.title}</div>
                    <div className="text-[11px] text-[#64748b]">{task.days} ימים · {task.date}</div>
                  </div>
                </div>
                <button
                  onClick={() => showSuccess("כל הכבוד, התחלת לטפל בזה!")}
                  className="text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] px-3 py-1.5 rounded-lg hover:bg-[#eff6ff] transition-all"
                >
                  טפל →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TWO-COLUMN: CALENDAR + DOCS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Calendar */}
        <div className="anim-fade-up delay-5 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                <Calendar size={16} className="text-[#2563eb]" />
              </div>
              מה בקרוב
            </h3>
            <Link href="/portal/calendar" className="text-[12px] font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
              הכל <ArrowLeft size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {calendarEvents.map((ev, i) => (
              <div key={i} className={`anim-fade-right delay-${i + 2} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all`}>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 rounded-full" style={{ background: ev.color }} />
                  <div>
                    <div className="text-[13px] font-medium text-[#1e293b]">{ev.title}</div>
                    <div className="text-[11px] text-[#64748b]">{ev.date}</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2563eb] bg-[#eff6ff] px-3 py-1.5 rounded-lg">
                  {ev.days} ימים
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="anim-fade-up delay-6 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                <FileText size={16} className="text-[#2563eb]" />
              </div>
              מסמכים אחרונים
            </h3>
            <Link href="/portal/documents" className="text-[12px] font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
              הכל <ArrowLeft size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentDocs.map((doc, i) => (
              <div key={i} className={`anim-fade-right delay-${i + 2} flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all border border-transparent hover:border-[#e8ecf4]`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[10px] font-bold text-[#2563eb]">
                    {doc.type}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#1e293b]">{doc.name}</div>
                    <div className="text-[11px] text-[#64748b]">{doc.date}</div>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-[#eff6ff] text-[#2563eb] transition-all">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── QUICK ACTIONS + COMPLETED ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Quick Actions */}
        <div className="anim-fade-up delay-5 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Sparkles size={16} className="text-[#2563eb]" />
            </div>
            פעולות מהירות
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: FileText, label: "צור פרוטוקול", bg: "#eff6ff", color: "#2563eb" },
              { icon: BarChart2, label: "הפק דוח", bg: "#f0fdf4", color: "#16a34a" },
              { icon: FileCheck, label: "העלה מסמך", bg: "#eff6ff", color: "#2563eb" },
              { icon: AlertCircle, label: "דווח על בעיה", bg: "#fef2f2", color: "#ef4444" },
            ].map((qa, i) => (
              <button
                key={qa.label}
                onClick={() => showSuccess(`${qa.label} – בקרוב!`)}
                className={`anim-fade-scale delay-${i + 2} flex items-center gap-3 p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all text-right`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: qa.bg }}>
                  <qa.icon size={14} style={{ color: qa.color }} />
                </div>
                <span className="text-[13px] font-medium text-[#1e293b]">{qa.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Completed */}
        <div className="anim-fade-up delay-6 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#16a34a]" />
            </div>
            מה הושלם לאחרונה
          </h3>
          <div className="space-y-2">
            {completedTasks.map((item, i) => (
              <div key={i} className={`anim-fade-right delay-${i + 1} p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50`}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={14} className="text-[#16a34a]" />
                  <span className="text-[13px] font-semibold text-[#1e293b]">{item.title}</span>
                </div>
                <div className="text-[11px] text-[#64748b] mb-1.5">{item.subtitle}</div>
                <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1 rounded-lg border border-[#bbf7d0]">
                  {item.feedback}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── HELP BANNER ─── */}
      <div className="anim-fade-up delay-7 bg-white rounded-2xl p-5 border border-[#e8ecf4] flex items-center justify-between hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
            <MessageCircle size={16} className="text-[#2563eb]" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#1e293b]">צריך עזרה? דבר איתנו</h3>
            <p className="text-[12px] text-[#64748b]">המלווה שלך כאן בשבילך – WhatsApp, אימייל או טופס</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href="https://wa.me/972501234567"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-[#16a34a] hover:text-[#15803d] px-4 py-2 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] hover:bg-[#dcfce7] transition-all"
          >
            WhatsApp
          </a>
          <Link
            href="/portal/contact"
            className="text-[12px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] px-4 py-2 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] hover:bg-[#dbeafe] transition-all"
          >
            פנה למלווה
          </Link>
        </div>
      </div>
    </div>
  );
}
