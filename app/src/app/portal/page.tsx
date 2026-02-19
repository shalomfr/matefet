"use client";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, AlertCircle, ChevronLeft, FileCheck } from "lucide-react";
import { useToast } from "@/components/Toast";

const urgentTasks = [
  { title: "לחדש את אישור ניהול תקין", desc: "האישור פג בעוד 14 יום. בלי זה לא ניתן לקבל מענקים.", days: 14, date: "05.03.2026", level: "urgent", action: "טפל עכשיו" },
  { title: "לעדכן את התקנון – סעיף 12", desc: "נדרש עדכון קטן בגלל שינוי בחוק מינואר 2026.", days: 39, date: "31.03.2026", level: "soon", action: "התחל" },
];

const completedTasks = [
  { title: "דוח כספי רפרוני", subtitle: "הוגש ✓", feedback: "כל הכבוד" },
  { title: "אישור ניהול תקין – חודש", subtitle: "תוקף עד מרץ 2026", feedback: "הושלם בזמן" },
];

type Status = "green" | "orange" | "red";

function getStatusText(s: Status) {
  if (s === "green") return "הארגון שלך עומד בדרישות";
  if (s === "orange") return "יש 2 פריטים שדורשים תשומת לב";
  return "נדרש טיפול דחוף";
}

export default function PortalHomePage() {
  const { showSuccess } = useToast();
  const status = "orange" as Status;
  const score = 94;
  const statusText = getStatusText(status);

  const statusBg =
    status === "green" ? "bg-[#f0fdf4] border-[#bbf7d0]"
    : status === "orange" ? "bg-[#fffbeb] border-[#fde68a]"
    : "bg-[#fef2f2] border-[#fecaca]";

  const statusIcon =
    status === "green" ? (
      <CheckCircle2 size={28} className="text-[#16a34a]" />
    ) : status === "orange" ? (
      <AlertTriangle size={28} className="text-[#d97706]" />
    ) : (
      <AlertCircle size={28} className="text-[#dc2626]" />
    );

  return (
    <div className="max-w-[900px] mx-auto px-8 py-8">
      <div className="mb-8">
        <div className="text-[28px] font-bold text-[#1e293b] mb-2 font-[Frank_Ruhl_Libre,serif]">
          שלום יוסי 👋
        </div>
        <div className="text-[14px] text-[#64748b]">הנה מה שחשוב לדעת היום</div>
        <div className="mt-4 text-left text-[13px] text-[#64748b] bg-white border border-[#e2e8f2] rounded-[10px] px-4 py-2 inline-block">
          יום חמישי, 19.02.2026 · י״ט בשבט תשפ״ו
        </div>
      </div>

      {/* 1. האם אני בסדר? */}
      <div
        className={`portal-card p-6 mb-8 border-2 ${statusBg} rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.07)]`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{status === "green" ? "😌" : status === "orange" ? "🤔" : "⚠️"}</span>
              <h2 className="text-xl font-bold text-[#1e293b]">{statusText}</h2>
            </div>
            <p className="text-[14px] text-[#64748b]">
              {status === "green"
                ? "אין בעיות דחופות כרגע."
                : status === "orange"
                  ? "יש 2 דברים שצריך לטפל בהם בחודש הקרוב – תראה למטה."
                  : "יש משימות שפג תוקפן או קרובות לפקיעה."}
            </p>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="text-[42px] font-bold text-[#1e293b]">{score}</div>
            <div className="text-[11px] text-[#64748b]">מתוך 100</div>
          </div>
        </div>
        <Link
          href="/portal/status"
          className="inline-flex items-center gap-1 mt-4 text-[13px] font-semibold text-[#2563eb] hover:underline"
        >
          פרטים מלאים <ChevronLeft size={14} />
        </Link>
      </div>

      {/* 2. מה דחוף? */}
      <div className="mb-6">
        <h3 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-[#d97706]" /> מה צריך לטפל עכשיו
        </h3>
        <div className="space-y-4">
          {urgentTasks.map((task, i) => (
            <div
              key={i}
              className={`portal-card p-5 rounded-[16px] flex items-center justify-between gap-6 ${
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
                <div className="text-[11px] text-[#64748b]">עד {task.date}</div>
              </div>
              <button
                type="button"
                onClick={() => showSuccess("כל הכבוד, התחלת לטפל בזה!")}
                className="btn-primary !py-2 !px-4 !text-[13px] flex-shrink-0"
              >
                {task.action} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. מה הושלם? */}
      <div>
        <h3 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
          <FileCheck size={18} className="text-[#16a34a]" /> מה הושלם לאחרונה
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {completedTasks.map((item, i) => (
            <div
              key={i}
              className="portal-card p-5 rounded-[16px] border border-[#bbf7d0] bg-[#f0fdf4]"
            >
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
    </div>
  );
}
