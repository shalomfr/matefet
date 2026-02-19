"use client";
import Link from "next/link";
import {
  CheckCircle2, AlertTriangle, AlertCircle, ChevronLeft, FileCheck,
  Search, Bell, Calendar, FileText, Users, BarChart2, MessageCircle,
  X, Clock, Download, Shield, Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/Toast";

/* ── data ── */
const categoryCards = [
  { href: "/portal/status",    emoji: "✅", label: "האם אני בסדר?",  desc: "ציות ועמידה בדרישות",  icon: Shield,        gradient: "from-[#2563eb] to-[#1d4ed8]" },
  { href: "/portal/calendar",  emoji: "📅", label: "מה בקרוב?",      desc: "לוח שנה ותזכורות",      icon: Calendar,      gradient: "from-[#2563eb] to-[#1d4ed8]" },
  { href: "/portal/documents", emoji: "📁", label: "המסמכים שלי",    desc: "מסמכים ואישורים",       icon: FileText,      gradient: "from-[#0891b2] to-[#0e7490]" },
  { href: "/portal/board",     emoji: "👥", label: "הועד שלי",       desc: "חברי ועד וישיבות",      icon: Users,         gradient: "from-[#2563eb] to-[#1e40af]" },
  { href: "/portal/reports",   emoji: "📊", label: "דוחות ותקציב",   desc: "כספים וניתוח",          icon: BarChart2,     gradient: "from-[#059669] to-[#047857]" },
  { href: "/portal/contact",   emoji: "💬", label: "דבר איתנו",      desc: "פנה למלווה שלך",        icon: MessageCircle, gradient: "from-[#0891b2] to-[#0e7490]" },
];

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
  { title: "דוח כספי רפרוני", subtitle: "הוגש ✓ · 15.02.2026", feedback: "כל הכבוד, הגשת בזמן! 🎉" },
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
    <div className="min-h-screen" style={{ background: "#f8f9fc" }}>

      {/* ─── NOTIFICATION BAR ─── */}
      {notifVisible && (
        <div className="anim-fade-down bg-gradient-to-l from-[#fef3c7] to-[#fffbeb] border-b border-[#fde68a] px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="anim-pulse-glow w-2 h-2 rounded-full bg-[#d97706]" />
            <span className="text-[13px] text-[#92400e] font-medium">
              שלחנו לך הודעה על חידוש אישור ניהול תקין – יש לטפל עד 05.03.2026
            </span>
          </div>
          <button onClick={() => setNotifVisible(false)} className="text-[#92400e]/60 hover:text-[#92400e] transition-colors hover:rotate-90 duration-300">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ─── GRADIENT HEADER ─── */}
      <div
        className="px-8 pt-8 pb-32 relative overflow-hidden anim-gradient"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 40%, #1e3a5f 70%, #172554 100%)",
          backgroundSize: "200% 200%",
        }}
      >
        {/* decorative circles */}
        <div className="absolute top-[-60px] left-[-40px] w-[200px] h-[200px] rounded-full bg-white/5 anim-float" />
        <div className="absolute bottom-[-80px] right-[10%] w-[300px] h-[300px] rounded-full bg-white/[0.03] anim-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[20%] right-[30%] w-[100px] h-[100px] rounded-full bg-white/[0.04] anim-float" style={{ animationDelay: "2s" }} />

        {/* top row */}
        <div className="relative z-10 flex items-center justify-between mb-10 anim-fade-down">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 hover-glow">
            <Search size={16} className="text-white/60" />
            <input
              type="text"
              placeholder="חפש מסמך, משימה, דוח..."
              className="bg-transparent text-white placeholder:text-white/40 text-[13px] outline-none w-64"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all">
              <Bell size={18} />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4444] text-[9px] text-white font-bold flex items-center justify-center anim-pulse-glow">
                2
              </div>
            </button>
            <div className="text-[13px] text-white/60 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20">
              יום חמישי, 19.02.2026 · י״ט בשבט תשפ״ו
            </div>
          </div>
        </div>

        {/* greeting */}
        <div className="relative z-10 anim-fade-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-[22px] font-bold text-white border border-white/30 anim-fade-scale delay-2">
              יל
            </div>
            <div>
              <h1 className="text-[30px] font-bold text-white font-[Frank_Ruhl_Libre,serif]">
                שלום יוסי 👋
              </h1>
              <p className="text-[14px] text-white/70">
                ברוך הבא לפורטל הניהול שלך · הנה מה שחשוב לדעת היום
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CATEGORY CARDS (overlapping header) ─── */}
      <div className="px-8 -mt-20 relative z-10 mb-8">
        <div className="grid grid-cols-6 gap-4">
          {categoryCards.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className={`anim-fade-up delay-${i + 1} hover-lift group relative bg-white rounded-2xl p-5 text-center border border-[#e8ecf4] overflow-hidden`}
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
            >
              {/* hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              {/* content */}
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#eff6ff] flex items-center justify-center group-hover:bg-white/20 transition-all duration-500">
                  <card.icon size={22} className="text-[#2563eb] group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="text-[14px] font-bold text-[#1e293b] mb-1 group-hover:text-white transition-colors duration-500">
                  {card.label}
                </div>
                <div className="text-[11px] text-[#64748b] leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                  {card.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-8 pb-10 max-w-[1200px]">

        {/* ─── STATUS CARD WITH PROGRESS BARS ─── */}
        <div className="anim-fade-up delay-7 bg-white rounded-2xl p-6 mb-6 border border-[#e8ecf4] relative overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          {/* accent line */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-[#2563eb] via-[#60a5fa] to-[#93c5fd]" />

          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  status === "green" ? "bg-[#f0fdf4]" : status === "orange" ? "bg-[#fffbeb]" : "bg-[#fef2f2]"
                }`}>
                  {status === "green" ? <CheckCircle2 size={22} className="text-[#16a34a]" /> :
                   status === "orange" ? <AlertTriangle size={22} className="text-[#d97706]" /> :
                   <AlertCircle size={22} className="text-[#dc2626]" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1e293b]">{statusText}</h2>
                  <p className="text-[13px] text-[#64748b]">
                    {status === "orange" ? "2 דברים לטפל בחודש הקרוב" : "אין בעיות דחופות"}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center flex-shrink-0 anim-count delay-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex flex-col items-center justify-center text-white" style={{ boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)" }}>
                <div className="text-[28px] font-bold leading-none">{score}</div>
                <div className="text-[10px] text-white/70 mt-0.5">מתוך 100</div>
              </div>
            </div>
          </div>

          {/* progress bars */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {progressBars.map((bar, i) => (
              <div key={bar.label} className={`anim-fade-up delay-${i + 3}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-medium text-[#1e293b]">{bar.label}</span>
                  <span className="text-[12px] font-bold" style={{ color: bar.color }}>{bar.pct}%</span>
                </div>
                <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full anim-progress"
                    style={{
                      width: `${bar.pct}%`,
                      background: `linear-gradient(90deg, ${bar.color}, ${bar.color}cc)`,
                      animationDelay: `${0.3 + i * 0.15}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link href="/portal/status" className="inline-flex items-center gap-1 mt-5 text-[13px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
            פרטים מלאים <ChevronLeft size={14} />
          </Link>
        </div>

        {/* ─── APPROVALS WAITING ─── */}
        {approvals.length > 0 && (
          <div className="anim-fade-up delay-4 bg-white rounded-2xl p-5 mb-6 border border-[#e8ecf4] anim-border-pulse" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                <Clock size={16} className="text-[#2563eb]" />
              </div>
              ממתין לאישורך
            </h3>
            <div className="space-y-3">
              {approvals.map((item, i) => (
                <div key={i} className={`anim-fade-right delay-${i + 2} flex items-center justify-between p-4 rounded-xl bg-gradient-to-l from-[#eff6ff] to-white border border-[#e8ecf4] hover-glow`}>
                  <div>
                    <div className="font-semibold text-[14px] text-[#1e293b]">{item.title}</div>
                    <div className="text-[12px] text-[#64748b]">{item.date}</div>
                  </div>
                  <button
                    onClick={() => showSuccess("אישור נשלח!")}
                    className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-105"
                  >
                    אשר ✓
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── URGENT TASKS ─── */}
        <div className="mb-6">
          <h3 className="anim-fade-up text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fffbeb] flex items-center justify-center">
              <AlertTriangle size={16} className="text-[#d97706]" />
            </div>
            מה צריך לטפל עכשיו
          </h3>
          <div className="space-y-4">
            {urgentTasks.map((task, i) => (
              <div
                key={i}
                className={`anim-fade-up delay-${i + 2} bg-white rounded-2xl p-5 border border-[#e8ecf4] flex items-center justify-between gap-6 hover-lift relative overflow-hidden ${
                  task.level === "urgent" ? "border-r-4 border-r-[#ef4444]" : "border-r-4 border-r-[#f59e0b]"
                }`}
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                    task.level === "urgent" ? "bg-[#fef2f2]" : "bg-[#fffbeb]"
                  }`}>
                    {task.level === "urgent" ? "🛡️" : "📜"}
                  </div>
                  <div>
                    <div className="font-bold text-[#1e293b] text-[15px]">{task.title}</div>
                    <div className="text-[13px] text-[#64748b]">{task.desc}</div>
                  </div>
                </div>
                <div className="text-center flex-shrink-0 anim-count" style={{ animationDelay: `${0.5 + i * 0.2}s` }}>
                  <div className={`text-2xl font-bold ${task.level === "urgent" ? "text-[#ef4444]" : "text-[#f59e0b]"}`}>
                    {task.days}
                  </div>
                  <div className="text-[10px] text-[#64748b]">ימים</div>
                </div>
                <button
                  onClick={() => showSuccess("כל הכבוד, התחלת לטפל בזה!")}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white flex-shrink-0 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-105"
                >
                  טפל עכשיו →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── TWO-COLUMN: CALENDAR + DOCS ─── */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Calendar */}
          <div className="anim-fade-up delay-3 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                  <Calendar size={16} className="text-[#2563eb]" />
                </div>
                מה בקרוב
              </h3>
              <Link href="/portal/calendar" className="text-[12px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex items-center gap-1">
                הכל <ChevronLeft size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {calendarEvents.map((ev, i) => (
                <div key={i} className={`anim-fade-right delay-${i + 2} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all`}>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 rounded-full" style={{ background: ev.color }} />
                    <div>
                      <div className="text-[13px] font-semibold text-[#1e293b]">{ev.title}</div>
                      <div className="text-[11px] text-[#64748b]">{ev.date}</div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-[#2563eb] bg-[#eff6ff] px-3 py-1.5 rounded-xl">
                    {ev.days} ימים
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Documents */}
          <div className="anim-fade-up delay-4 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                  <FileText size={16} className="text-[#2563eb]" />
                </div>
                מסמכים אחרונים
              </h3>
              <Link href="/portal/documents" className="text-[12px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex items-center gap-1">
                הכל <ChevronLeft size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentDocs.map((doc, i) => (
                <div key={i} className={`anim-fade-right delay-${i + 2} flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all border border-transparent hover:border-[#e8ecf4]`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] flex items-center justify-center text-[10px] font-bold text-[#2563eb]">
                      {doc.type}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#1e293b]">{doc.name}</div>
                      <div className="text-[11px] text-[#64748b]">{doc.date}</div>
                    </div>
                  </div>
                  <button className="p-2.5 rounded-xl hover:bg-[#eff6ff] text-[#2563eb] transition-all hover:scale-110">
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── QUICK ACTIONS ─── */}
        <div className="anim-fade-up delay-5 bg-white rounded-2xl p-5 mb-6 border border-[#e8ecf4]" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Sparkles size={16} className="text-[#2563eb]" />
            </div>
            מה אני יכול לעשות?
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: FileText, label: "צור פרוטוקול", gradient: "from-[#2563eb] to-[#1d4ed8]" },
              { icon: BarChart2, label: "הפק דוח", gradient: "from-[#059669] to-[#047857]" },
              { icon: FileCheck, label: "העלה מסמך", gradient: "from-[#2563eb] to-[#1d4ed8]" },
              { icon: AlertCircle, label: "דווח על בעיה", gradient: "from-[#dc2626] to-[#b91c1c]" },
            ].map((qa, i) => (
              <button
                key={qa.label}
                onClick={() => showSuccess(`${qa.label} – בקרוב!`)}
                className={`anim-fade-scale delay-${i + 2} group relative flex flex-col items-center gap-3 p-6 rounded-2xl border border-[#e8ecf4] bg-white overflow-hidden transition-all duration-300 hover:border-transparent`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${qa.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#eff6ff] flex items-center justify-center group-hover:bg-white/20 transition-all duration-500">
                  <qa.icon size={22} className="text-[#2563eb] group-hover:text-white transition-colors duration-500" />
                </div>
                <span className="relative z-10 text-[13px] font-semibold text-[#1e293b] group-hover:text-white transition-colors duration-500">
                  {qa.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── COMPLETED ─── */}
        <div className="mb-6">
          <h3 className="anim-fade-up text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#16a34a]" />
            </div>
            מה הושלם לאחרונה
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {completedTasks.map((item, i) => (
              <div key={i} className={`anim-fade-up delay-${i + 2} bg-white rounded-2xl p-5 border border-[#bbf7d0] hover-lift`} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={18} className="text-[#16a34a]" />
                  <span className="font-bold text-[14px] text-[#1e293b]">{item.title}</span>
                </div>
                <div className="text-[13px] text-[#64748b] mb-2">{item.subtitle}</div>
                <div className="text-[12px] font-semibold text-[#16a34a] bg-[#f0fdf4] inline-block px-3 py-1 rounded-lg">
                  {item.feedback}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── HELP BANNER ─── */}
        <div
          className="anim-fade-up delay-6 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden anim-gradient"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a5f 100%)",
            backgroundSize: "200% 200%",
          }}
        >
          {/* decorative */}
          <div className="absolute top-[-30px] left-[10%] w-[120px] h-[120px] rounded-full bg-white/5 anim-float" />
          <div className="absolute bottom-[-40px] right-[20%] w-[80px] h-[80px] rounded-full bg-white/[0.07] anim-float" style={{ animationDelay: "1.5s" }} />

          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <MessageCircle size={20} /> צריך עזרה? דבר איתנו
            </h3>
            <p className="text-[13px] text-white/70">המלווה שלך כאן בשבילך – WhatsApp, אימייל או טופס</p>
          </div>
          <div className="relative z-10 flex gap-3">
            <a
              href="https://wa.me/972501234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl text-[13px] font-semibold bg-[#25D366] text-white hover:bg-[#1fb855] hover:scale-105 transition-all duration-300 shadow-lg"
            >
              WhatsApp 💬
            </a>
            <Link
              href="/portal/contact"
              className="px-6 py-3 rounded-xl text-[13px] font-semibold bg-white/15 text-white border border-white/25 hover:bg-white/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              פנה למלווה
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
