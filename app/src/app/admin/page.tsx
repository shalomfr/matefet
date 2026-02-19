"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import {
  Building2, Link2, Zap, AlertTriangle, CheckCircle2, Clock,
  Users, BarChart3, ArrowLeft, Bell, Shield, FileWarning, TrendingUp,
} from "lucide-react";

/* ── data ── */
const alerts = [
  { org: "עמותת אור לציון", issue: "אישור ניהול תקין פג בעוד 14 יום", level: "critical", icon: Shield },
  { org: "קרן חסד", issue: "אינטגרציית רשם העמותות מנותקת", level: "warning", icon: Link2 },
  { org: "אגודת הסטודנטים", issue: "דוח שנתי לא הוגש – 3 שבועות לדדליין", level: "warning", icon: FileWarning },
];

const teamTasks = [
  { task: "לטפל בחידוש ניהול תקין – אור לציון", assignee: "שלום פ.", due: "05.03.2026", status: "open" },
  { task: "לבדוק חיבור רשם עמותות – קרן חסד", assignee: "יעל מ.", due: "22.02.2026", status: "open" },
  { task: "להזכיר דוח שנתי – אגודת הסטודנטים", assignee: "שלום פ.", due: "28.02.2026", status: "open" },
  { task: "אישור תקנון מעודכן – עמותת חיים", assignee: "יעל מ.", due: "20.02.2026", status: "done" },
];

const orgHealth = [
  { name: "עמותת אור לציון", score: 94, status: "warning", issues: 1 },
  { name: "קרן חסד", score: 78, status: "warning", issues: 2 },
  { name: "אגודת הסטודנטים", score: 62, status: "critical", issues: 3 },
  { name: "עמותת חיים", score: 100, status: "ok", issues: 0 },
  { name: "בית הלל", score: 98, status: "ok", issues: 0 },
];

const timeline = [
  { date: "20.02.2026", org: "עמותת חיים", event: "אישור תקנון", color: "#2ecc8f" },
  { date: "22.02.2026", org: "קרן חסד", event: "בדיקת אינטגרציה", color: "#f5a623" },
  { date: "28.02.2026", org: "אגודת הסטודנטים", event: "תזכורת דוח שנתי", color: "#e8445a" },
  { date: "05.03.2026", org: "אור לציון", event: "חידוש ניהול תקין", color: "#e8445a" },
  { date: "31.03.2026", org: "הכל", event: "דדליין דוחות שנתיים", color: "#5c3d9a" },
];

const recentSyncs = [
  { integration: "חשבונית ירוקה", time: "לפני 5 דקות", status: "success" },
  { integration: "רשם העמותות", time: "לפני יום", status: "success" },
  { integration: "Tranzila", time: "לפני 12 דקות", status: "success" },
  { integration: "Google Workspace", time: "לפני 3 שעות", status: "success" },
];

export default function AdminDashboardPage() {
  const okOrgs = orgHealth.filter((o) => o.status === "ok").length;
  const warnOrgs = orgHealth.filter((o) => o.status === "warning").length;
  const critOrgs = orgHealth.filter((o) => o.status === "critical").length;
  const openTasks = teamTasks.filter((t) => t.status === "open").length;

  return (
    <>
      <Topbar title="דשבורד פנימי" subtitle="מעטפת ניהולית · עדכון אחרון: היום 14:30" />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Building2} label="ארגונים פעילים" value={String(orgHealth.length)} color="#5c3d9a" />
        <StatCard icon={Link2} label="אינטגרציות מחוברות" value="8/10" color="#2ecc8f" />
        <StatCard icon={Zap} label="אוטומציות פעילות" value="10" change="+3" trend="up" color="#a78bfa" />
        <StatCard icon={AlertTriangle} label="התראות פתוחות" value={String(alerts.length)} color="#f5a623" />
      </div>

      {/* ── Org Health Overview ── */}
      <div className="card-dark p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[--color-text] flex items-center gap-2">
            <TrendingUp size={18} className="text-[#a78bfa]" /> סקירת ארגונים
          </h3>
          <Link href="/admin/organizations" className="text-[12px] font-semibold text-[#a78bfa] hover:underline flex items-center gap-1">
            לכל הארגונים <ArrowLeft size={12} />
          </Link>
        </div>
        {/* summary bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2ecc8f]/10 border border-[#2ecc8f]/20">
            <div className="w-3 h-3 rounded-full bg-[#2ecc8f]" />
            <span className="text-[13px] font-semibold text-[#2ecc8f]">{okOrgs} תקינים</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f5a623]/10 border border-[#f5a623]/20">
            <div className="w-3 h-3 rounded-full bg-[#f5a623]" />
            <span className="text-[13px] font-semibold text-[#f5a623]">{warnOrgs} דורשים תשומת לב</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e8445a]/10 border border-[#e8445a]/20">
            <div className="w-3 h-3 rounded-full bg-[#e8445a]" />
            <span className="text-[13px] font-semibold text-[#e8445a]">{critOrgs} קריטי</span>
          </div>
        </div>
        {/* org list */}
        <div className="space-y-2">
          {orgHealth.map((org) => (
            <div key={org.name} className="flex items-center justify-between p-3 rounded-xl bg-[--color-surface2] border border-[--color-border] hover:border-[#5c3d9a]/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-8 rounded-full ${
                  org.status === "ok" ? "bg-[#2ecc8f]" : org.status === "warning" ? "bg-[#f5a623]" : "bg-[#e8445a]"
                }`} />
                <div>
                  <span className="text-[13px] font-medium text-[--color-text]">{org.name}</span>
                  {org.issues > 0 && (
                    <span className="text-[11px] text-[--color-muted] mr-2"> · {org.issues} בעיות</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className={`text-[15px] font-bold ${
                    org.score >= 90 ? "text-[#2ecc8f]" : org.score >= 70 ? "text-[#f5a623]" : "text-[#e8445a]"
                  }`}>{org.score}</span>
                  <span className="text-[10px] text-[--color-muted]"> / 100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* ── Alerts ── */}
        <div className="card-dark p-5">
          <h3 className="text-base font-bold text-[--color-text] mb-4 flex items-center gap-2">
            <Bell size={18} className="text-[#f5a623]" /> התראות ({alerts.length})
          </h3>
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl bg-[--color-surface2] border flex items-center justify-between ${
                  alert.level === "critical"
                    ? "border-[#e8445a]/30 border-r-4 border-r-[#e8445a]"
                    : "border-[#f5a623]/30 border-r-4 border-r-[#f5a623]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <alert.icon size={16} className={alert.level === "critical" ? "text-[#e8445a]" : "text-[#f5a623]"} />
                  <div>
                    <div className="text-[13px] font-medium text-[--color-text]">{alert.org}</div>
                    <div className="text-[11px] text-[--color-muted]">{alert.issue}</div>
                  </div>
                </div>
                <button className="text-[11px] font-semibold text-[#a78bfa] hover:underline">טפל</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team Tasks ── */}
        <div className="card-dark p-5">
          <h3 className="text-base font-bold text-[--color-text] mb-4 flex items-center gap-2">
            <Users size={18} className="text-[#a78bfa]" /> משימות צוות ({openTasks} פתוחות)
          </h3>
          <div className="space-y-2">
            {teamTasks.map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[--color-surface2] border border-[--color-border]">
                <div className="flex items-center gap-3">
                  {task.status === "done" ? (
                    <CheckCircle2 size={16} className="text-[#2ecc8f]" />
                  ) : (
                    <Clock size={16} className="text-[#f5a623]" />
                  )}
                  <div>
                    <div className={`text-[13px] font-medium ${task.status === "done" ? "text-[--color-muted] line-through" : "text-[--color-text]"}`}>
                      {task.task}
                    </div>
                    <div className="text-[11px] text-[--color-muted]">{task.assignee} · עד {task.due}</div>
                  </div>
                </div>
                {task.status === "done" && (
                  <span className="badge badge-success">הושלם</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* ── Timeline ── */}
        <div className="card-dark p-5">
          <h3 className="text-base font-bold text-[--color-text] mb-4 flex items-center gap-2">
            <Clock size={18} className="text-[#4a7cff]" /> לוח זמנים – דדליינים
          </h3>
          <div className="space-y-3">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-1.5 h-10 rounded-full" style={{ background: item.color }} />
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-[--color-text]">{item.event}</div>
                  <div className="text-[11px] text-[--color-muted]">{item.org}</div>
                </div>
                <span className="text-[12px] font-semibold text-[--color-muted] bg-[--color-surface2] px-3 py-1 rounded-lg">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Integration Status ── */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[--color-text] flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#2ecc8f]" /> סטטוס אינטגרציות
            </h3>
            <span className="badge badge-success">8/10 מחוברות</span>
          </div>
          <div className="space-y-2">
            {recentSyncs.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-[#2ecc8f]" />
                  <span className="text-[13px] font-medium text-[--color-text]">{item.integration}</span>
                </div>
                <span className="text-[11px] text-[--color-muted]">{item.time}</span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/integrations"
            className="inline-flex items-center gap-1 mt-3 text-[12px] font-semibold text-[#a78bfa] hover:underline"
          >
            ניהול אינטגרציות <ArrowLeft size={12} />
          </Link>
        </div>
      </div>
    </>
  );
}
