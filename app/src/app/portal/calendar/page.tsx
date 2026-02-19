"use client";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";

const upcomingEvents = [
  { day: 5, month: "מרץ", title: "חידוש ניהול תקין", sub: "הגשה לרשם העמותות", tag: "דחוף", color: "#dc2626" },
  { day: 15, month: "מרץ", title: "ישיבת ועד", sub: "פרוטוקול מוכן ✓", tag: "בקרוב", color: "#d97706" },
  { day: 31, month: "מרץ", title: "עדכון תקנון", sub: "הגשה לאישור הועד", tag: "בקרוב", color: "#d97706" },
  { day: 30, month: "אפריל", title: "דוח שנתי לרשם", sub: "יש זמן, לא דחוף", tag: "בסדר", color: "#16a34a" },
];

export default function PortalCalendarPage() {
  return (
    <div className="max-w-[800px] mx-auto px-8 py-8">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1 text-[13px] text-[#64748b] hover:text-[#2563eb] mb-6"
      >
        <ChevronLeft size={14} /> חזרה לראשי
      </Link>

      <h1 className="text-2xl font-bold text-[#1e293b] mb-2 font-[Frank_Ruhl_Libre,serif]">
        מה מתקרב?
      </h1>
      <p className="text-[14px] text-[#64748b] mb-8">
        לוח שנה רגולטורי – דדליינים ואירועים
      </p>

      <div className="portal-card overflow-hidden rounded-[16px]">
        <div className="p-5 border-b border-[#e2e8f2] flex items-center gap-2">
          <Calendar size={20} className="text-[#2563eb]" />
          <h3 className="text-base font-bold text-[#1e293b]">אירועים קרובים</h3>
        </div>
        <div className="divide-y divide-[#e2e8f2]">
          {upcomingEvents.map((ev, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 hover:bg-[#f4f6fb] transition-colors"
            >
              <div className="text-center flex-shrink-0 w-14">
                <div className="text-2xl font-bold" style={{ color: ev.color }}>
                  {ev.day}
                </div>
                <div className="text-[11px] text-[#64748b]">{ev.month}</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#1e293b]">{ev.title}</div>
                <div className="text-[13px] text-[#64748b]">{ev.sub}</div>
              </div>
              <span
                className="text-[11px] font-semibold px-3 py-1 rounded-full"
                style={{
                  background: ev.tag === "דחוף" ? "#fef2f2" : ev.tag === "בקרוב" ? "#fffbeb" : "#f0fdf4",
                  color: ev.color,
                }}
              >
                {ev.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
