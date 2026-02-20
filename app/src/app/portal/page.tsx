"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import {
  CheckCircle2, AlertTriangle, AlertCircle, FileCheck,
  Calendar, FileText, BarChart2, MessageCircle,
  X, Clock, Download, Shield, Sparkles, ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/Toast";

/* ── types ── */
type ComplianceItem = {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
};

type BoardMeeting = {
  id: string;
  title: string;
  date: string;
  location?: string;
  status: string;
};

type BoardMember = {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
};

type BudgetInfo = {
  id: string;
  year: number;
  name: string;
  totalBudget: number;
  totalSpent: number;
  percentage: number;
};

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type PortalData = {
  compliance: {
    score: number;
    total: number;
    ok: number;
    warning: number;
    expired: number;
    missing: number;
    expiringSoon: number;
    items: ComplianceItem[];
  };
  financial: {
    totalDonationsThisYear: number;
    donationCount: number;
    totalDonors: number;
    budgets: BudgetInfo[];
  };
  board: {
    members: BoardMember[];
    upcomingMeetings: BoardMeeting[];
  };
  volunteers: { activeCount: number };
  documents: { count: number };
  notifications: NotificationItem[];
};

type Status = "green" | "orange" | "red";

export default function PortalHomePage() {
  const { showSuccess } = useToast();
  const [notifVisible, setNotifVisible] = useState(true);
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/portal")
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="הפורטל שלי" subtitle="שלום · טוען נתונים..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const score = data?.compliance?.score ?? 0;
  const warningCount = (data?.compliance?.warning ?? 0) + (data?.compliance?.expired ?? 0) + (data?.compliance?.missing ?? 0);
  const status: Status = warningCount === 0 ? "green" : warningCount <= 3 ? "orange" : "red";

  const statusText =
    status === "green" ? "הארגון שלך עומד בדרישות"
    : status === "orange" ? `יש ${warningCount} פריטים שדורשים תשומת לב`
    : "נדרש טיפול דחוף";

  // Derive urgent tasks from compliance items that are WARNING/EXPIRED/MISSING
  const urgentTasks = (data?.compliance?.items ?? [])
    .filter(item => item.status !== "OK")
    .map(item => {
      const daysUntil = item.dueDate
        ? Math.max(0, Math.ceil((new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null;
      const dateStr = item.dueDate ? new Date(item.dueDate).toLocaleDateString("he-IL") : "";
      return {
        title: item.name,
        desc: item.description ?? "",
        days: daysUntil,
        date: dateStr,
        level: item.status === "EXPIRED" || item.status === "MISSING" ? "urgent" : "soon",
      };
    });

  // Derive calendar events from upcoming meetings
  const calendarEvents = (data?.board?.upcomingMeetings ?? []).map(m => {
    const meetDate = new Date(m.date);
    const daysUntil = Math.max(0, Math.ceil((meetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    return {
      title: m.title,
      date: meetDate.toLocaleDateString("he-IL"),
      days: daysUntil,
      color: "#2563eb",
    };
  });

  // Add compliance items with due dates as calendar events
  const complianceCalendarEvents = (data?.compliance?.items ?? [])
    .filter(item => item.dueDate && item.status !== "OK")
    .map(item => {
      const dueDate = new Date(item.dueDate!);
      const daysUntil = Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      return {
        title: item.name,
        date: dueDate.toLocaleDateString("he-IL"),
        days: daysUntil,
        color: item.status === "EXPIRED" ? "#ef4444" : "#d97706",
      };
    });

  const allCalendarEvents = [...calendarEvents, ...complianceCalendarEvents]
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  // Next meeting days
  const nextMeetingDays = calendarEvents.length > 0 ? `${calendarEvents[0].days} ימים` : "—";

  // Notifications
  const notifications = data?.notifications ?? [];
  const firstUnread = notifications.find(n => !n.isRead);

  // Progress bars from budgets
  const progressBars = (data?.financial?.budgets ?? []).slice(0, 4).map(b => ({
    label: b.name,
    pct: b.percentage,
    color: b.percentage >= 90 ? "#059669" : b.percentage >= 70 ? "#2563eb" : "#d97706",
  }));

  // If no budgets, show compliance-related progress
  const fallbackProgressBars = progressBars.length > 0 ? progressBars : [
    { label: "ציון ציות", pct: score, color: score >= 80 ? "#059669" : score >= 60 ? "#2563eb" : "#d97706" },
  ];

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="הפורטל שלי" subtitle="שלום · לוח הבקרה שלך" />

      {/* ─── NOTIFICATION BAR ─── */}
      {notifVisible && firstUnread && (
        <div className="anim-fade-down mb-6 bg-white rounded-2xl border border-[#fde68a] p-4 flex items-center justify-between" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#fffbeb] flex items-center justify-center">
              <AlertTriangle size={16} className="text-[#d97706]" />
            </div>
            <span className="text-[13px] text-[#1e293b] font-medium">
              {firstUnread.title} – {firstUnread.message}
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
        <div className="anim-fade-scale delay-3"><StatCard icon={Calendar} label="ישיבה הבאה" value={nextMeetingDays} color="#2563eb" /></div>
        <div className="anim-fade-scale delay-4"><StatCard icon={FileText} label="מסמכים" value={String(data?.documents?.count ?? 0)} color="#16a34a" /></div>
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
                {status === "green" ? "אין בעיות דחופות" : `${warningCount} דברים לטפל בקרוב`}
              </p>
            </div>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="text-[28px] font-bold text-[#2563eb]">{score}</div>
            <div className="text-[10px] text-[#64748b]">מתוך 100</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {fallbackProgressBars.map((bar, i) => (
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
        {/* Approvals (from notifications) */}
        <div className="anim-fade-up delay-3 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Clock size={16} className="text-[#2563eb]" />
            </div>
            התראות אחרונות ({notifications.filter(n => !n.isRead).length})
          </h3>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-[13px] text-[#64748b]">אין התראות</div>
            ) : (
              notifications.slice(0, 3).map((item, i) => (
                <div key={item.id} className={`anim-fade-right delay-${i + 2} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all`}>
                  <div>
                    <div className="text-[13px] font-medium text-[#1e293b]">{item.title}</div>
                    <div className="text-[11px] text-[#64748b]">{new Date(item.createdAt).toLocaleDateString("he-IL")}</div>
                  </div>
                  {!item.isRead && (
                    <span className="text-[11px] font-semibold text-[#2563eb] bg-[#eff6ff] px-3 py-1.5 rounded-lg">
                      חדש
                    </span>
                  )}
                </div>
              ))
            )}
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
            {urgentTasks.length === 0 ? (
              <div className="text-center py-6 text-[13px] text-[#64748b]">אין משימות דחופות</div>
            ) : (
              urgentTasks.map((task, i) => (
                <div key={i} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all ${
                  task.level === "urgent" ? "border-r-[3px] border-r-[#ef4444]" : "border-r-[3px] border-r-[#d97706]"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${task.level === "urgent" ? "bg-[#fef2f2]" : "bg-[#fffbeb]"}`}>
                      {task.level === "urgent" ? <Shield size={14} className="text-[#ef4444]" /> : <FileText size={14} className="text-[#d97706]" />}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#1e293b]">{task.title}</div>
                      <div className="text-[11px] text-[#64748b]">{task.days !== null ? `${task.days} ימים` : ""}{task.date ? ` · ${task.date}` : ""}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => showSuccess("כל הכבוד, התחלת לטפל בזה!")}
                    className="text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] px-3 py-1.5 rounded-lg hover:bg-[#eff6ff] transition-all"
                  >
                    טפל →
                  </button>
                </div>
              ))
            )}
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
            {allCalendarEvents.length === 0 ? (
              <div className="text-center py-6 text-[13px] text-[#64748b]">אין אירועים קרובים</div>
            ) : (
              allCalendarEvents.map((ev, i) => (
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
              ))
            )}
          </div>
        </div>

        {/* Recent Documents (count info) */}
        <div className="anim-fade-up delay-6 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                <FileText size={16} className="text-[#2563eb]" />
              </div>
              סיכום כספי
            </h3>
            <Link href="/portal/reports" className="text-[12px] font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
              הכל <ArrowLeft size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            <div className="anim-fade-right delay-2 flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all border border-transparent hover:border-[#e8ecf4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[10px] font-bold text-[#2563eb]">
                  ₪
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#1e293b]">תרומות השנה</div>
                  <div className="text-[11px] text-[#64748b]">{data?.financial?.donationCount ?? 0} תרומות</div>
                </div>
              </div>
              <span className="text-[14px] font-bold text-[#2563eb]">₪{(data?.financial?.totalDonationsThisYear ?? 0).toLocaleString()}</span>
            </div>
            <div className="anim-fade-right delay-3 flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all border border-transparent hover:border-[#e8ecf4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[10px] font-bold text-[#16a34a]">
                  👥
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#1e293b]">תורמים</div>
                  <div className="text-[11px] text-[#64748b]">סה״כ תורמים רשומים</div>
                </div>
              </div>
              <span className="text-[14px] font-bold text-[#16a34a]">{data?.financial?.totalDonors ?? 0}</span>
            </div>
            <div className="anim-fade-right delay-4 flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all border border-transparent hover:border-[#e8ecf4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[10px] font-bold text-[#2563eb]">
                  📄
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#1e293b]">מסמכים</div>
                  <div className="text-[11px] text-[#64748b]">מסמכים שמורים במערכת</div>
                </div>
              </div>
              <span className="text-[14px] font-bold text-[#2563eb]">{data?.documents?.count ?? 0}</span>
            </div>
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

        {/* Completed (ok compliance items) */}
        <div className="anim-fade-up delay-6 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#16a34a]" />
            </div>
            מה הושלם לאחרונה
          </h3>
          <div className="space-y-2">
            {(data?.compliance?.items ?? []).filter(item => item.status === "OK").length === 0 ? (
              <div className="text-center py-6 text-[13px] text-[#64748b]">אין נתונים</div>
            ) : (
              (data?.compliance?.items ?? [])
                .filter(item => item.status === "OK")
                .slice(0, 3)
                .map((item, i) => (
                  <div key={item.id} className={`anim-fade-right delay-${i + 1} p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50`}>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={14} className="text-[#16a34a]" />
                      <span className="text-[13px] font-semibold text-[#1e293b]">{item.name}</span>
                    </div>
                    <div className="text-[11px] text-[#64748b] mb-1.5">{item.description ?? "הושלם"}</div>
                    <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1 rounded-lg border border-[#bbf7d0]">
                      תקין
                    </span>
                  </div>
                ))
            )}
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
