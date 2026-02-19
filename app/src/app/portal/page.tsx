"use client";
import Link from "next/link";
import {
  CheckCircle2, AlertTriangle, AlertCircle, ChevronLeft, FileCheck,
  Search, Bell, Calendar, FileText, Users, BarChart2, MessageCircle,
  X, Clock, Download, ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/Toast";

/* ── data ── */
const categoryCards = [
  { href: "/portal/status",    emoji: "✅", label: "האם אני בסדר?",  desc: "בדוק ציות ועמידה בדרישות" },
  { href: "/portal/calendar",  emoji: "📅", label: "מה בקרוב?",      desc: "לוח שנה ותזכורות" },
  { href: "/portal/documents", emoji: "📁", label: "המסמכים שלי",    desc: "מסמכים, אישורים והורדות" },
  { href: "/portal/board",     emoji: "👥", label: "הועד שלי",       desc: "חברי ועד וישיבות" },
  { href: "/portal/reports",   emoji: "📊", label: "דוחות ותקציב",   desc: "כספים, דוחות וניתוח" },
  { href: "/portal/contact",   emoji: "💬", label: "דבר איתנו",      desc: "פנה למלווה שלך" },
];

const urgentTasks = [
  { title: "לחדש את אישור ניהול תקין", desc: "האישור פג בעוד 14 יום. בלי זה לא ניתן לקבל מענקים.", days: 14, date: "05.03.2026", level: "urgent", action: "טפל עכשיו" },
  { title: "לעדכן את התקנון – סעיף 12", desc: "נדרש עדכון קטן בגלל שינוי בחוק מינואר 2026.", days: 39, date: "31.03.2026", level: "soon", action: "התחל" },
];

const approvals = [
  { title: "אישור פרוטוקול ישיבת ועד #14", date: "12.02.2026" },
  { title: "אישור שינוי תקנון – סעיף 7", date: "10.02.2026" },
];

const calendarEvents = [
  { title: "ישיבת ועד רבעונית", date: "28.02.2026", days: 9, color: "#5c3d9a" },
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
  { label: "ממשל תאגידי", pct: 95, color: "#16a34a" },
  { label: "עמידה בדרישות", pct: 86, color: "#2563eb" },
  { label: "ניהול סיכונים", pct: 78, color: "#d97706" },
  { label: "מול רשות המסים", pct: 90, color: "#5c3d9a" },
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

  const statusBg =
    status === "green" ? "bg-[#f0fdf4] border-[#bbf7d0]"
    : status === "orange" ? "bg-[#fffbeb] border-[#fde68a]"
    : "bg-[#fef2f2] border-[#fecaca]";

  return (
    <div className="min-h-screen" style={{ background: "#f4f6fb" }}>

      {/* ─── NOTIFICATION BAR ─── */}
      {notifVisible && (
        <div className="bg-[#fffbeb] border-b border-[#fde68a] px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={16} className="text-[#d97706]" />
            <span className="text-[13px] text-[#92400e] font-medium">
              שלחנו לך הודעה על חידוש אישור ניהול תקין – יש לטפל עד 05.03.2026
            </span>
          </div>
          <button onClick={() => setNotifVisible(false)} className="text-[#92400e]/60 hover:text-[#92400e]">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ─── GRADIENT HEADER ─── */}
      <div
        className="px-8 pt-8 pb-28 relative"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #4c1d95 100%)",
        }}
      >
        {/* top row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
            <Search size={16} className="text-white/60" />
            <input
              type="text"
              placeholder="חפש מסמך, משימה, דוח..."
              className="bg-transparent text-white placeholder:text-white/50 text-[13px] outline-none w-56"
            />
          </div>
          <div className="text-[13px] text-white/70 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
            יום חמישי, 19.02.2026 · י״ט בשבט תשפ״ו
          </div>
        </div>

        {/* greeting */}
        <h1 className="text-[32px] font-bold text-white mb-2 font-[Frank_Ruhl_Libre,serif]">
          שלום יוסי 👋
        </h1>
        <p className="text-[15px] text-white/80">
          ברוך הבא לפורטל הניהול שלך · הנה מה שחשוב לדעת היום
        </p>
      </div>

      {/* ─── CATEGORY CARDS (overlapping header) ─── */}
      <div className="px-8 -mt-16 relative z-10 mb-8">
        <div className="grid grid-cols-6 gap-4">
          {categoryCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#e8ecf4] hover:shadow-[0_8px_30px_rgba(92,61,154,0.15)] hover:border-[#5c3d9a]/30 transition-all group"
            >
              <div className="text-3xl mb-3">{card.emoji}</div>
              <div className="text-[14px] font-bold text-[#1e293b] mb-1 group-hover:text-[#5c3d9a] transition-colors">
                {card.label}
              </div>
              <div className="text-[11px] text-[#64748b] leading-relaxed">{card.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-8 pb-10 max-w-[1200px]">

        {/* ─── STATUS CARD WITH PROGRESS BARS ─── */}
        <div className={`rounded-2xl p-6 mb-6 border-2 ${statusBg} shadow-sm`}>
          <div className="flex items-start justify-between gap-6 mb-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{status === "green" ? "😌" : status === "orange" ? "🤔" : "⚠️"}</span>
                <h2 className="text-xl font-bold text-[#1e293b]">{statusText}</h2>
              </div>
              <p className="text-[14px] text-[#64748b]">
                {status === "orange"
                  ? "יש 2 דברים שצריך לטפל בהם בחודש הקרוב – תראה למטה."
                  : "אין בעיות דחופות כרגע."}
              </p>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-[42px] font-bold text-[#1e293b]">{score}</div>
              <div className="text-[11px] text-[#64748b]">מתוך 100</div>
            </div>
          </div>
          {/* progress bars */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {progressBars.map((bar) => (
              <div key={bar.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-[#1e293b]">{bar.label}</span>
                  <span className="text-[12px] font-bold" style={{ color: bar.color }}>{bar.pct}%</span>
                </div>
                <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${bar.pct}%`, background: bar.color }} />
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/portal/status"
            className="inline-flex items-center gap-1 mt-4 text-[13px] font-semibold text-[#5c3d9a] hover:underline"
          >
            פרטים מלאים <ChevronLeft size={14} />
          </Link>
        </div>

        {/* ─── APPROVALS WAITING ─── */}
        {approvals.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-6 border border-[#e8ecf4] shadow-sm">
            <h3 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <Clock size={18} className="text-[#5c3d9a]" /> ממתין לאישורך
            </h3>
            <div className="space-y-3">
              {approvals.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#f3effa] border border-[#5c3d9a]/10">
                  <div>
                    <div className="font-semibold text-[14px] text-[#1e293b]">{item.title}</div>
                    <div className="text-[12px] text-[#64748b]">{item.date}</div>
                  </div>
                  <button
                    onClick={() => showSuccess("אישור נשלח!")}
                    className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-colors"
                    style={{ background: "#5c3d9a" }}
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
          <h3 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#d97706]" /> מה צריך לטפל עכשיו
          </h3>
          <div className="space-y-4">
            {urgentTasks.map((task, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-5 border border-[#e8ecf4] shadow-sm flex items-center justify-between gap-6 ${
                  task.level === "urgent" ? "border-r-4 border-r-[#dc2626]" : "border-r-4 border-r-[#d97706]"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    task.level === "urgent" ? "bg-[#fef2f2]" : "bg-[#fffbeb]"
                  }`}>
                    {task.level === "urgent" ? "🛡️" : "📜"}
                  </div>
                  <div>
                    <div className="font-bold text-[#1e293b] text-[15px]">{task.title}</div>
                    <div className="text-[13px] text-[#64748b]">{task.desc}</div>
                  </div>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className={`text-2xl font-bold ${task.level === "urgent" ? "text-[#dc2626]" : "text-[#d97706]"}`}>
                    {task.days}
                  </div>
                  <div className="text-[10px] text-[#64748b]">ימים</div>
                </div>
                <button
                  onClick={() => showSuccess("כל הכבוד, התחלת לטפל בזה!")}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white flex-shrink-0 transition-colors"
                  style={{ background: "#5c3d9a" }}
                >
                  {task.action} →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── TWO-COLUMN: CALENDAR + DOCS ─── */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Calendar */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8ecf4] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
                <Calendar size={18} className="text-[#5c3d9a]" /> מה בקרוב
              </h3>
              <Link href="/portal/calendar" className="text-[12px] font-semibold text-[#5c3d9a] hover:underline flex items-center gap-1">
                הכל <ChevronLeft size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {calendarEvents.map((ev, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9fc]">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 rounded-full" style={{ background: ev.color }} />
                    <div>
                      <div className="text-[13px] font-semibold text-[#1e293b]">{ev.title}</div>
                      <div className="text-[11px] text-[#64748b]">{ev.date}</div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-[#5c3d9a] bg-[#f3effa] px-3 py-1 rounded-lg">
                    {ev.days} ימים
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8ecf4] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
                <FileText size={18} className="text-[#5c3d9a]" /> מסמכים אחרונים
              </h3>
              <Link href="/portal/documents" className="text-[12px] font-semibold text-[#5c3d9a] hover:underline flex items-center gap-1">
                הכל <ChevronLeft size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentDocs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f9fc] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#f3effa] flex items-center justify-center text-[11px] font-bold text-[#5c3d9a]">
                      {doc.type}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#1e293b]">{doc.name}</div>
                      <div className="text-[11px] text-[#64748b]">{doc.date}</div>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-[#f3effa] text-[#5c3d9a]">
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── QUICK ACTIONS ─── */}
        <div className="bg-white rounded-2xl p-5 mb-6 border border-[#e8ecf4] shadow-sm">
          <h3 className="text-base font-bold text-[#1e293b] mb-4">מה אני יכול לעשות?</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: FileText, label: "צור פרוטוקול", bg: "#f3effa", color: "#5c3d9a" },
              { icon: BarChart2, label: "הפק דוח", bg: "#f0fdf4", color: "#16a34a" },
              { icon: FileCheck, label: "העלה מסמך", bg: "#eff6ff", color: "#2563eb" },
              { icon: AlertCircle, label: "דווח על בעיה", bg: "#fef2f2", color: "#dc2626" },
            ].map((qa) => (
              <button
                key={qa.label}
                onClick={() => showSuccess(`${qa.label} – בקרוב!`)}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-[#e8ecf4] hover:shadow-md transition-all"
                style={{ background: qa.bg }}
              >
                <qa.icon size={24} style={{ color: qa.color }} />
                <span className="text-[13px] font-semibold text-[#1e293b]">{qa.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── COMPLETED ─── */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <FileCheck size={18} className="text-[#16a34a]" /> מה הושלם לאחרונה
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {completedTasks.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[#bbf7d0] shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={18} className="text-[#16a34a]" />
                  <span className="font-semibold text-[#1e293b]">{item.title}</span>
                </div>
                <div className="text-[13px] text-[#64748b] mb-2">{item.subtitle}</div>
                <div className="text-[12px] font-medium text-[#16a34a]">{item.feedback}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── HELP BANNER ─── */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-1">צריך עזרה? דבר איתנו</h3>
            <p className="text-[13px] text-white/80">המלווה שלך כאן בשבילך – WhatsApp, אימייל או טופס</p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://wa.me/972501234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#25D366] text-white hover:bg-[#1fb855] transition-colors"
            >
              WhatsApp 💬
            </a>
            <Link
              href="/portal/contact"
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors"
            >
              פנה למלווה
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
