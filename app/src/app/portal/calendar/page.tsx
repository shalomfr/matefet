"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { Calendar } from "lucide-react";

type BoardMeeting = {
  id: string;
  title: string;
  date: string;
  location?: string;
  status: string;
};

type ComplianceItem = {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  dueDate?: string;
};

type CalendarEvent = {
  day: number;
  month: string;
  title: string;
  sub: string;
  tag: string;
  color: string;
};

const hebrewMonths: Record<number, string> = {
  0: "ינואר", 1: "פברואר", 2: "מרץ", 3: "אפריל", 4: "מאי", 5: "יוני",
  6: "יולי", 7: "אוגוסט", 8: "ספטמבר", 9: "אוקטובר", 10: "נובמבר", 11: "דצמבר",
};

export default function PortalCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/board/meetings").then(r => r.json()),
      fetch("/api/compliance").then(r => r.json()),
    ])
      .then(([meetingsRes, complianceRes]) => {
        const now = Date.now();
        const allEvents: CalendarEvent[] = [];

        // Add meetings as calendar events
        if (meetingsRes.success) {
          const meetings: BoardMeeting[] = meetingsRes.data;
          meetings
            .filter(m => new Date(m.date).getTime() >= now)
            .forEach(m => {
              const d = new Date(m.date);
              const daysUntil = Math.max(0, Math.ceil((d.getTime() - now) / (1000 * 60 * 60 * 24)));
              let tag = "בסדר";
              let color = "#16a34a";
              if (daysUntil <= 7) { tag = "דחוף"; color = "#ef4444"; }
              else if (daysUntil <= 30) { tag = "בקרוב"; color = "#d97706"; }
              allEvents.push({
                day: d.getDate(),
                month: hebrewMonths[d.getMonth()],
                title: m.title,
                sub: m.location ?? "ישיבה מתוכננת",
                tag,
                color,
              });
            });
        }

        // Add compliance deadlines
        if (complianceRes.success) {
          const items: ComplianceItem[] = complianceRes.data.items ?? [];
          items
            .filter(item => item.dueDate && new Date(item.dueDate).getTime() >= now && item.status !== "OK")
            .forEach(item => {
              const d = new Date(item.dueDate!);
              const daysUntil = Math.max(0, Math.ceil((d.getTime() - now) / (1000 * 60 * 60 * 24)));
              let tag = "בסדר";
              let color = "#16a34a";
              if (daysUntil <= 14) { tag = "דחוף"; color = "#ef4444"; }
              else if (daysUntil <= 30) { tag = "בקרוב"; color = "#d97706"; }
              allEvents.push({
                day: d.getDate(),
                month: hebrewMonths[d.getMonth()],
                title: item.name,
                sub: item.description ?? "דדליין ציות",
                tag,
                color,
              });
            });
        }

        // Sort by date proximity
        allEvents.sort((a, b) => {
          const monthOrder = Object.values(hebrewMonths);
          const aIdx = monthOrder.indexOf(a.month) * 31 + a.day;
          const bIdx = monthOrder.indexOf(b.month) * 31 + b.day;
          return aIdx - bIdx;
        });

        setEvents(allEvents);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="מה מתקרב?" subtitle="לוח שנה רגולטורי – דדליינים ואירועים" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

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
            {events.length === 0 ? (
              <div className="text-center py-8 text-[13px] text-[#64748b]">אין אירועים קרובים</div>
            ) : (
              events.map((ev, i) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
