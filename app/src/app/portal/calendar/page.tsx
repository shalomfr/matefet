"use client";
import Topbar from "@/components/Topbar";
import { Calendar } from "lucide-react";

const upcomingEvents = [
  { day: 5, month: "מרץ", title: "חידוש ניהול תקין", sub: "הגשה לרשם העמותות", tag: "דחוף", color: "#ef4444" },
  { day: 15, month: "מרץ", title: "ישיבת ועד", sub: "פרוטוקול מוכן", tag: "בקרוב", color: "#d97706" },
  { day: 31, month: "מרץ", title: "עדכון תקנון", sub: "הגשה לאישור הועד", tag: "בקרוב", color: "#d97706" },
  { day: 30, month: "אפריל", title: "דוח שנתי לרשם", sub: "יש זמן, לא דחוף", tag: "בסדר", color: "#16a34a" },
];

export default function PortalCalendarPage() {
  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="מה מתקרב?" subtitle="לוח שנה רגולטורי – דדליינים ואירועים" />

      <div className="max-w-[800px]">
        <div className="anim-fade-up delay-2 bg-white rounded-2xl border border-[#e8ecf4] overflow-hidden hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="p-5 border-b border-[#e8ecf4] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Calendar size={16} className="text-[#2563eb]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#1e293b]">אירועים קרובים</h3>
          </div>
          <div className="divide-y divide-[#e8ecf4]">
            {upcomingEvents.map((ev, i) => (
              <div
                key={i}
                className={`anim-fade-right delay-${i + 1} flex items-center gap-4 p-5 hover:bg-[#f8f9fc] transition-colors`}
              >
                <div className="text-center flex-shrink-0 w-14">
                  <div className="text-2xl font-bold" style={{ color: ev.color }}>
                    {ev.day}
                  </div>
                  <div className="text-[11px] text-[#64748b]">{ev.month}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#1e293b]">{ev.title}</div>
                  <div className="text-[12px] text-[#64748b]">{ev.sub}</div>
                </div>
                <span
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                  style={{
                    background: ev.tag === "דחוף" ? "#fef2f2" : ev.tag === "בקרוב" ? "#fffbeb" : "#f0fdf4",
                    color: ev.color,
                    border: `1px solid ${ev.tag === "דחוף" ? "#fecaca" : ev.tag === "בקרוב" ? "#fde68a" : "#bbf7d0"}`,
                  }}
                >
                  {ev.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
