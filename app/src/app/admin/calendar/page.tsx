"use client";
import { useState, useEffect, useMemo } from "react";
import Topbar from "@/components/Topbar";
import { useToast } from "@/components/Toast";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Calendar,
  Users,
  Building2,
  Clock,
  Bell,
  ClipboardCheck,
  GraduationCap,
  Heart,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

// ── Types ──

type OrgOption = { id: string; name: string };

type AdminEventRaw = {
  id: string;
  organizationId: string;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  date: string;
  endDate?: string | null;
  time?: string | null;
  endTime?: string | null;
  location?: string | null;
  notes?: string | null;
  organization: { id: string; name: string };
};

type BoardMeetingRaw = {
  id: string;
  title: string;
  date: string;
  location?: string | null;
  status: string;
  organization: { id: string; name: string };
};

type ComplianceItemRaw = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  dueDate?: string | null;
  organization: { id: string; name: string };
};

type UnifiedEvent = {
  id: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
  title: string;
  sub: string;
  typeLabel: string;
  color: string;
  orgName: string;
  orgId: string;
  fullDate: string;
  time?: string;
  location?: string;
  status?: string;
  description?: string;
  source: "admin_event" | "board_meeting" | "compliance";
  rawType?: string;
};

// ── Constants ──

const hebrewMonths: Record<number, string> = {
  0: "ינואר", 1: "פברואר", 2: "מרץ", 3: "אפריל", 4: "מאי", 5: "יוני",
  6: "יולי", 7: "אוגוסט", 8: "ספטמבר", 9: "אוקטובר", 10: "נובמבר", 11: "דצמבר",
};

const hebrewDayNames = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

const eventTypeLabels: Record<string, string> = {
  EVENT: "אירוע",
  MEETING: "פגישה",
  TEAM_MEETING: "ישיבת צוות",
  BOARD_MEETING: "ישיבת ועד",
  DEADLINE: "דדליין",
  REMINDER: "תזכורת",
  AUDIT: "ביקורת",
  TRAINING: "הדרכה",
  FUNDRAISING: "גיוס כספים",
  VOLUNTEER_EVENT: "אירוע התנדבות",
};

const eventTypeColors: Record<string, string> = {
  EVENT: "#2563eb",
  MEETING: "#7c3aed",
  TEAM_MEETING: "#0891b2",
  BOARD_MEETING: "#1e40af",
  DEADLINE: "#ef4444",
  REMINDER: "#d97706",
  AUDIT: "#64748b",
  TRAINING: "#16a34a",
  FUNDRAISING: "#b45309",
  VOLUNTEER_EVENT: "#059669",
  board_meeting: "#1e40af",
  compliance: "#ef4444",
};

const eventTypeOptions = [
  { value: "EVENT", label: "אירוע", Icon: Calendar },
  { value: "MEETING", label: "פגישה", Icon: Users },
  { value: "TEAM_MEETING", label: "ישיבת צוות", Icon: Users },
  { value: "BOARD_MEETING", label: "ישיבת ועד", Icon: Building2 },
  { value: "DEADLINE", label: "דדליין", Icon: Clock },
  { value: "REMINDER", label: "תזכורת", Icon: Bell },
  { value: "AUDIT", label: "ביקורת", Icon: ClipboardCheck },
  { value: "TRAINING", label: "הדרכה", Icon: GraduationCap },
  { value: "FUNDRAISING", label: "גיוס כספים", Icon: Calendar },
  { value: "VOLUNTEER_EVENT", label: "אירוע התנדבות", Icon: Heart },
];

// ── Component ──

export default function AdminCalendarPage() {
  const { showSuccess, showError } = useToast();
  const today = new Date();

  // State
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [organizations, setOrganizations] = useState<OrgOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null);
  const [orgFilter, setOrgFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const emptyForm = {
    organizationId: "",
    title: "",
    description: "",
    type: "EVENT",
    date: "",
    time: "",
    endTime: "",
    location: "",
    notes: "",
  };
  const [form, setForm] = useState(emptyForm);

  // Fetch organizations once
  useEffect(() => {
    fetch("/api/stats/admin")
      .then((r) => r.json())
      .then((json) => {
        const orgs = (json.data?.organizations ?? []).map((o: { id: string; name: string }) => ({
          id: o.id,
          name: o.name,
        }));
        setOrganizations(orgs);
      })
      .catch(() => {});
  }, []);

  // Fetch calendar data when month/year changes
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ month: String(calMonth), year: String(calYear) });
    fetch(`/api/admin/calendar?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) return;
        const unified: UnifiedEvent[] = [];
        const now = Date.now();

        // Admin events
        for (const ev of (json.data.adminEvents ?? []) as AdminEventRaw[]) {
          const d = new Date(ev.date);
          unified.push({
            id: ev.id,
            day: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            timestamp: d.getTime(),
            title: ev.title,
            sub: ev.description ?? "",
            typeLabel: eventTypeLabels[ev.type] ?? ev.type,
            color: eventTypeColors[ev.type] ?? "#2563eb",
            orgName: ev.organization.name,
            orgId: ev.organization.id,
            fullDate: d.toLocaleDateString("he-IL"),
            time: ev.time ?? undefined,
            location: ev.location ?? undefined,
            status: ev.status,
            description: ev.description ?? undefined,
            source: "admin_event",
            rawType: ev.type,
          });
        }

        // Board meetings
        for (const m of (json.data.boardMeetings ?? []) as BoardMeetingRaw[]) {
          const d = new Date(m.date);
          unified.push({
            id: m.id,
            day: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            timestamp: d.getTime(),
            title: m.title,
            sub: m.location ?? "ישיבה מתוכננת",
            typeLabel: "ישיבת ועד",
            color: eventTypeColors.board_meeting,
            orgName: m.organization.name,
            orgId: m.organization.id,
            fullDate: d.toLocaleDateString("he-IL"),
            time: d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
            location: m.location ?? undefined,
            status: m.status,
            source: "board_meeting",
          });
        }

        // Compliance items
        for (const item of (json.data.complianceItems ?? []) as ComplianceItemRaw[]) {
          if (!item.dueDate) continue;
          const d = new Date(item.dueDate);
          const daysUntil = Math.max(0, Math.ceil((d.getTime() - now) / (1000 * 60 * 60 * 24)));
          unified.push({
            id: item.id,
            day: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            timestamp: d.getTime(),
            title: item.name,
            sub: item.description ?? "דדליין ציות",
            typeLabel: "דדליין ציות",
            color: daysUntil <= 14 ? "#ef4444" : daysUntil <= 30 ? "#d97706" : "#16a34a",
            orgName: item.organization.name,
            orgId: item.organization.id,
            fullDate: d.toLocaleDateString("he-IL"),
            status: item.status,
            source: "compliance",
          });
        }

        unified.sort((a, b) => a.timestamp - b.timestamp);
        setEvents(unified);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [calMonth, calYear]);

  // Calendar grid
  const miniCalData = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1);
    const lastDay = new Date(calYear, calMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDow = firstDay.getDay();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return { cells, daysInMonth };
  }, [calMonth, calYear]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (orgFilter && ev.orgId !== orgFilter) return false;
      if (typeFilter && ev.source === "admin_event" && ev.rawType !== typeFilter) return false;
      if (typeFilter && ev.source === "board_meeting" && typeFilter !== "BOARD_MEETING") return false;
      if (typeFilter && ev.source === "compliance" && typeFilter !== "DEADLINE") return false;
      return true;
    });
  }, [events, orgFilter, typeFilter]);

  // Events per day
  const eventsByDay = useMemo(() => {
    const map: Record<number, UnifiedEvent[]> = {};
    for (const ev of filteredEvents) {
      if (ev.month === calMonth && ev.year === calYear) {
        if (!map[ev.day]) map[ev.day] = [];
        map[ev.day].push(ev);
      }
    }
    return map;
  }, [filteredEvents, calMonth, calYear]);

  // Navigation
  const goToPrevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const goToNextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
    setSelectedDay(null);
  };
  const isToday = (day: number) =>
    day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

  // Selected day events
  const selectedDayEvents = selectedDay ? (eventsByDay[selectedDay] ?? []) : [];

  // Upcoming events (for when no day selected)
  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return filteredEvents.filter((ev) => ev.timestamp >= now).slice(0, 10);
  }, [filteredEvents]);

  // Create event
  const handleCreate = async () => {
    if (!form.organizationId || !form.title || !form.date) {
      showError("יש למלא ארגון, כותרת ותאריך");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showSuccess("האירוע נוצר בהצלחה");
        setShowCreateModal(false);
        setForm(emptyForm);
        // Refresh
        setCalMonth((m) => m);
        // Trigger re-fetch by changing a dependency
        setLoading(true);
        const params = new URLSearchParams({ month: String(calMonth), year: String(calYear) });
        const r = await fetch(`/api/admin/calendar?${params}`);
        const json = await r.json();
        if (json.success) {
          // Re-process events
          const unified: UnifiedEvent[] = [];
          const now = Date.now();
          for (const ev of (json.data.adminEvents ?? []) as AdminEventRaw[]) {
            const d = new Date(ev.date);
            unified.push({
              id: ev.id, day: d.getDate(), month: d.getMonth(), year: d.getFullYear(),
              timestamp: d.getTime(), title: ev.title, sub: ev.description ?? "",
              typeLabel: eventTypeLabels[ev.type] ?? ev.type, color: eventTypeColors[ev.type] ?? "#2563eb",
              orgName: ev.organization.name, orgId: ev.organization.id,
              fullDate: d.toLocaleDateString("he-IL"), time: ev.time ?? undefined,
              location: ev.location ?? undefined, status: ev.status, description: ev.description ?? undefined,
              source: "admin_event", rawType: ev.type,
            });
          }
          for (const m of (json.data.boardMeetings ?? []) as BoardMeetingRaw[]) {
            const d = new Date(m.date);
            unified.push({
              id: m.id, day: d.getDate(), month: d.getMonth(), year: d.getFullYear(),
              timestamp: d.getTime(), title: m.title, sub: m.location ?? "ישיבה מתוכננת",
              typeLabel: "ישיבת ועד", color: eventTypeColors.board_meeting,
              orgName: m.organization.name, orgId: m.organization.id,
              fullDate: d.toLocaleDateString("he-IL"),
              time: d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
              location: m.location ?? undefined, status: m.status, source: "board_meeting",
            });
          }
          for (const item of (json.data.complianceItems ?? []) as ComplianceItemRaw[]) {
            if (!item.dueDate) continue;
            const d = new Date(item.dueDate);
            const daysUntil = Math.max(0, Math.ceil((d.getTime() - now) / (1000 * 60 * 60 * 24)));
            unified.push({
              id: item.id, day: d.getDate(), month: d.getMonth(), year: d.getFullYear(),
              timestamp: d.getTime(), title: item.name, sub: item.description ?? "דדליין ציות",
              typeLabel: "דדליין ציות",
              color: daysUntil <= 14 ? "#ef4444" : daysUntil <= 30 ? "#d97706" : "#16a34a",
              orgName: item.organization.name, orgId: item.organization.id,
              fullDate: d.toLocaleDateString("he-IL"), status: item.status, source: "compliance",
            });
          }
          unified.sort((a, b) => a.timestamp - b.timestamp);
          setEvents(unified);
        }
        setLoading(false);
      } else {
        const json = await res.json();
        showError(json.error ?? "שגיאה ביצירת אירוע");
      }
    } catch {
      showError("שגיאה ביצירת אירוע");
    } finally {
      setCreating(false);
    }
  };

  // Edit event
  const handleEdit = async () => {
    if (!selectedEvent || !form.title || !form.date) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/admin/calendar/events/${selectedEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          type: form.type,
          date: form.date,
          time: form.time,
          endTime: form.endTime,
          location: form.location,
          notes: form.notes,
        }),
      });
      if (res.ok) {
        showSuccess("האירוע עודכן בהצלחה");
        setShowEditModal(false);
        setSelectedEvent(null);
        // Trigger re-fetch
        setCalYear((y) => y);
      } else {
        showError("שגיאה בעדכון");
      }
    } catch {
      showError("שגיאה בעדכון");
    } finally {
      setCreating(false);
    }
  };

  // Delete event
  const handleDelete = async (ev: UnifiedEvent) => {
    if (!confirm("למחוק את האירוע?")) return;
    try {
      const res = await fetch(`/api/admin/calendar/events/${ev.id}`, { method: "DELETE" });
      if (res.ok) {
        showSuccess("האירוע נמחק");
        setSelectedEvent(null);
        setEvents((prev) => prev.filter((e) => e.id !== ev.id));
      } else {
        showError("שגיאה במחיקה");
      }
    } catch {
      showError("שגיאה במחיקה");
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="לוח שנה" subtitle="ניהול אירועים ומשימות לכל הארגונים" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="לוח שנה" subtitle="ניהול אירועים ומשימות לכל הארגונים" />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
          className="bg-white border border-[#e8ecf4] rounded-xl px-3 py-2 text-[13px] text-[#1e293b] min-w-[160px]"
        >
          <option value="">כל הארגונים</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white border border-[#e8ecf4] rounded-xl px-3 py-2 text-[13px] text-[#1e293b] min-w-[140px]"
        >
          <option value="">כל הסוגים</option>
          {eventTypeOptions.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <div className="flex-1" />

        <button
          onClick={() => {
            setForm(emptyForm);
            setShowCreateModal(true);
          }}
          className="btn-primary flex items-center gap-1.5 !text-[13px]"
        >
          <Plus size={15} /> הוסף אירוע
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div
            className="bg-white rounded-2xl border border-[#e8ecf4] p-5"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToNextMonth}
                className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b] hover:text-[#1e293b] transition-colors"
              >
                <ChevronRight size={18} />
              </button>
              <h3 className="text-[15px] font-bold text-[#1e293b]">
                {hebrewMonths[calMonth]} {calYear}
              </h3>
              <button
                onClick={goToPrevMonth}
                className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b] hover:text-[#1e293b] transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {hebrewDayNames.map((name) => (
                <div key={name} className="text-center text-[11px] font-semibold text-[#64748b] py-1">
                  {name}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {miniCalData.cells.map((day, i) => {
                if (day === null) {
                  return <div key={`blank-${i}`} className="min-h-[72px]" />;
                }
                const dayEvs = eventsByDay[day] ?? [];
                const dotColors = [...new Set(dayEvs.map((ev) => ev.color))].slice(0, 3);
                const isTodayCell = isToday(day);
                const isSelected = selectedDay === day;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                    className={`min-h-[72px] p-1.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "border-[#2563eb] bg-[#eff6ff]"
                        : isTodayCell
                        ? "border-[#2563eb]/30 bg-[#2563eb]/5"
                        : "border-transparent hover:bg-[#f8f9fc]"
                    }`}
                  >
                    <div
                      className={`text-[12px] font-semibold mb-1 ${
                        isTodayCell ? "text-[#2563eb]" : "text-[#1e293b]"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="flex items-center gap-0.5 flex-wrap">
                      {dotColors.map((c, ci) => (
                        <div
                          key={ci}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: c }}
                        />
                      ))}
                      {dayEvs.length > 3 && (
                        <span className="text-[9px] text-[#64748b]">+{dayEvs.length - 3}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Event Sidebar */}
        <div className="space-y-6">
          {/* Events list */}
          <div
            className="bg-white rounded-2xl border border-[#e8ecf4] p-5"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-4">
              {selectedDay
                ? `${selectedDay} ${hebrewMonths[calMonth]} — ${selectedDayEvents.length} אירועים`
                : `אירועים קרובים (${upcomingEvents.length})`}
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {(selectedDay ? selectedDayEvents : upcomingEvents).length === 0 ? (
                <div className="text-center py-6 text-[13px] text-[#64748b]">
                  {selectedDay ? "אין אירועים ביום זה" : "אין אירועים קרובים"}
                </div>
              ) : (
                (selectedDay ? selectedDayEvents : upcomingEvents).map((ev) => (
                  <button
                    key={`${ev.source}-${ev.id}`}
                    onClick={() => setSelectedEvent(ev)}
                    className="w-full text-right p-3 rounded-xl hover:bg-[#f8f9fc] transition-colors border border-transparent hover:border-[#e8ecf4]"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-1 h-full min-h-[36px] rounded-full flex-shrink-0 mt-0.5"
                        style={{ background: ev.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[#1e293b] truncate">
                          {ev.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                            style={{
                              background: `${ev.color}15`,
                              color: ev.color,
                            }}
                          >
                            {ev.typeLabel}
                          </span>
                          <span className="text-[11px] text-[#64748b] truncate">
                            {ev.orgName}
                          </span>
                        </div>
                        {ev.time && (
                          <div className="text-[11px] text-[#94a3b8] mt-0.5">{ev.time}</div>
                        )}
                        {!selectedDay && (
                          <div className="text-[11px] text-[#94a3b8] mt-0.5">{ev.fullDate}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div
            className="bg-white rounded-2xl border border-[#e8ecf4] p-5"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-3">
              סיכום {hebrewMonths[calMonth]}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748b]">סה״כ אירועים</span>
                <span className="font-bold text-[#1e293b]">{filteredEvents.length}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748b]">אירועי מערכת</span>
                <span className="font-bold text-[#2563eb]">
                  {filteredEvents.filter((e) => e.source === "admin_event").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748b]">ישיבות ועד</span>
                <span className="font-bold text-[#1e40af]">
                  {filteredEvents.filter((e) => e.source === "board_meeting").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748b]">דדליינים</span>
                <span className="font-bold text-[#ef4444]">
                  {filteredEvents.filter((e) => e.source === "compliance").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Create Event Modal ── */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 border border-[#e8ecf4] max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-[#1e293b]">הוספת אירוע חדש</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Organization */}
              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">ארגון *</label>
                <select
                  value={form.organizationId}
                  onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
                  className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b] bg-white"
                >
                  <option value="">בחר ארגון</option>
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">כותרת *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                  placeholder="שם האירוע"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">סוג אירוע</label>
                <div className="grid grid-cols-2 gap-2">
                  {eventTypeOptions.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium border transition-all ${
                        form.type === t.value
                          ? "border-[#2563eb] bg-[#eff6ff] text-[#1e40af]"
                          : "border-[#e8ecf4] text-[#64748b] hover:bg-[#f8f9fc]"
                      }`}
                    >
                      <t.Icon size={14} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748b] mb-1">תאריך *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748b] mb-1">שעה</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748b] mb-1">עד שעה</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">מיקום</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                  placeholder="מיקום האירוע"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">תיאור</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b] resize-none"
                  rows={3}
                  placeholder="תיאור האירוע"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">הערות</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b] resize-none"
                  rows={2}
                  placeholder="הערות נוספות"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="btn-primary flex-1 flex items-center justify-center gap-1.5"
              >
                {creating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus size={15} /> צור אירוע
                  </>
                )}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#e8ecf4] text-[13px] font-medium text-[#64748b] hover:bg-[#f8f9fc] transition-colors"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Event Modal ── */}
      {showEditModal && selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 border border-[#e8ecf4] max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-[#1e293b]">עריכת אירוע</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">כותרת *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">סוג אירוע</label>
                <div className="grid grid-cols-2 gap-2">
                  {eventTypeOptions.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium border transition-all ${
                        form.type === t.value
                          ? "border-[#2563eb] bg-[#eff6ff] text-[#1e40af]"
                          : "border-[#e8ecf4] text-[#64748b] hover:bg-[#f8f9fc]"
                      }`}
                    >
                      <t.Icon size={14} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748b] mb-1">תאריך *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748b] mb-1">שעה</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748b] mb-1">עד שעה</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">מיקום</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">תיאור</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b] resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">הערות</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-[#e8ecf4] rounded-xl px-3 py-2.5 text-[13px] text-[#1e293b] resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleEdit}
                disabled={creating}
                className="btn-primary flex-1 flex items-center justify-center gap-1.5"
              >
                {creating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "שמור שינויים"
                )}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#e8ecf4] text-[13px] font-medium text-[#64748b] hover:bg-[#f8f9fc] transition-colors"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Event Detail Modal ── */}
      {selectedEvent && !showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 border border-[#e8ecf4]"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#1e293b]">פרטי אירוע</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[11px] text-[#64748b] mb-1">כותרת</div>
                <div className="text-[14px] font-semibold text-[#1e293b]">{selectedEvent.title}</div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-medium px-2 py-1 rounded-lg"
                  style={{ background: `${selectedEvent.color}15`, color: selectedEvent.color }}
                >
                  {selectedEvent.typeLabel}
                </span>
                <span className="text-[12px] text-[#64748b]">{selectedEvent.orgName}</span>
              </div>

              <div>
                <div className="text-[11px] text-[#64748b] mb-1">תאריך</div>
                <div className="text-[14px] font-semibold text-[#2563eb]">{selectedEvent.fullDate}</div>
              </div>

              {selectedEvent.time && (
                <div>
                  <div className="text-[11px] text-[#64748b] mb-1">שעה</div>
                  <div className="text-[14px] font-semibold text-[#1e293b]">{selectedEvent.time}</div>
                </div>
              )}

              {selectedEvent.location && (
                <div className="flex items-start gap-1.5">
                  <MapPin size={14} className="text-[#64748b] mt-0.5 flex-shrink-0" />
                  <div className="text-[13px] text-[#1e293b]">{selectedEvent.location}</div>
                </div>
              )}

              {selectedEvent.description && (
                <div>
                  <div className="text-[11px] text-[#64748b] mb-1">תיאור</div>
                  <div className="text-[13px] text-[#1e293b]">{selectedEvent.description}</div>
                </div>
              )}

              {selectedEvent.sub && selectedEvent.sub !== selectedEvent.description && (
                <div>
                  <div className="text-[11px] text-[#64748b] mb-1">פרטים</div>
                  <div className="text-[13px] text-[#1e293b]">{selectedEvent.sub}</div>
                </div>
              )}

              {/* Actions for admin events only */}
              {selectedEvent.source === "admin_event" && (
                <div className="flex items-center gap-2 pt-3 border-t border-[#e8ecf4]">
                  <button
                    onClick={() => {
                      const d = new Date(selectedEvent.timestamp);
                      setForm({
                        organizationId: selectedEvent.orgId,
                        title: selectedEvent.title,
                        description: selectedEvent.description ?? "",
                        type: selectedEvent.rawType ?? "EVENT",
                        date: d.toISOString().split("T")[0],
                        time: selectedEvent.time ?? "",
                        endTime: "",
                        location: selectedEvent.location ?? "",
                        notes: "",
                      });
                      setShowEditModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] transition-colors"
                  >
                    <Pencil size={13} /> עריכה
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEvent)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] transition-colors"
                  >
                    <Trash2 size={13} /> מחיקה
                  </button>
                </div>
              )}

              {selectedEvent.source !== "admin_event" && (
                <div className="pt-3 border-t border-[#e8ecf4]">
                  <div className="text-[11px] text-[#94a3b8]">
                    {selectedEvent.source === "board_meeting"
                      ? "אירוע זה מיובא מישיבות ועד — ניתן לערוך דרך עמוד הארגון"
                      : "דדליין ציות — ניתן לעדכן דרך מודול הציות"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
