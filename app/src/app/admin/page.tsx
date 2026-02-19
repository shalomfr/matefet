"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import {
  Building2, Link2, Zap, AlertTriangle, CheckCircle2, Clock,
  Users, ArrowLeft, Bell, Shield, FileWarning, TrendingUp,
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
  { date: "20.02", org: "עמותת חיים", event: "אישור תקנון", color: "#2ecc8f" },
  { date: "22.02", org: "קרן חסד", event: "בדיקת אינטגרציה", color: "#f5a623" },
  { date: "28.02", org: "אגודת הסטודנטים", event: "תזכורת דוח שנתי", color: "#e8445a" },
  { date: "05.03", org: "אור לציון", event: "חידוש ניהול תקין", color: "#e8445a" },
  { date: "31.03", org: "הכל", event: "דדליין דוחות שנתיים", color: "#a78bfa" },
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
        <div className="admin-anim-scale admin-delay-1"><StatCard icon={Building2} label="ארגונים פעילים" value={String(orgHealth.length)} color="#a78bfa" /></div>
        <div className="admin-anim-scale admin-delay-2"><StatCard icon={Link2} label="אינטגרציות מחוברות" value="8/10" color="#2ecc8f" /></div>
        <div className="admin-anim-scale admin-delay-3"><StatCard icon={Zap} label="אוטומציות פעילות" value="10" change="+3" trend="up" color="#a78bfa" /></div>
        <div className="admin-anim-scale admin-delay-4"><StatCard icon={AlertTriangle} label="התראות פתוחות" value={String(alerts.length)} color="#f5a623" /></div>
      </div>

      {/* ── Org Health Overview ── */}
      <div className="card-dark p-5 mb-6 admin-anim-up admin-delay-2 admin-hover-lift">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[--color-text] flex items-center gap-2">
            <TrendingUp size={18} className="text-[#a78bfa]" /> סקירת ארגונים
          </h3>
          <Link href="/admin/organizations" className="text-[12px] font-semibold text-[#a78bfa] hover:text-[#c4b5fd] transition-colors flex items-center gap-1">
            לכל הארגונים <ArrowLeft size={12} />
          </Link>
        </div>

        {/* summary chips */}
        <div className="flex items-center gap-3 mb-5">
          {[
            { count: okOrgs, label: "תקינים", color: "#2ecc8f", bg: "rgba(46,204,143,0.1)", border: "rgba(46,204,143,0.2)" },
            { count: warnOrgs, label: "דורשים תשומת לב", color: "#f5a623", bg: "rgba(245,166,35,0.1)", border: "rgba(245,166,35,0.2)" },
            { count: critOrgs, label: "קריטי", color: "#e8445a", bg: "rgba(232,68,90,0.1)", border: "rgba(232,68,90,0.2)" },
          ].map((chip, i) => (
            <div
              key={chip.label}
              className={`admin-anim-scale admin-delay-${i + 2} flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105`}
              style={{ background: chip.bg, border: `1px solid ${chip.border}` }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: chip.color, boxShadow: `0 0 8px ${chip.color}50` }} />
              <span className="text-[13px] font-semibold" style={{ color: chip.color }}>{chip.count} {chip.label}</span>
            </div>
          ))}
        </div>

        {/* org list */}
        <div className="space-y-2">
          {orgHealth.map((org, i) => (
            <div
              key={org.name}
              className={`admin-anim-slide admin-delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[--color-surface2] border border-[--color-border] hover:border-[#a78bfa]/40 transition-all admin-hover-glow`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-9 rounded-full transition-all"
                  style={{
                    background: org.status === "ok" ? "#2ecc8f" : org.status === "warning" ? "#f5a623" : "#e8445a",
                    boxShadow: `0 0 8px ${org.status === "ok" ? "#2ecc8f" : org.status === "warning" ? "#f5a623" : "#e8445a"}40`,
                  }}
                />
                <div>
                  <span className="text-[13px] font-medium text-[--color-text]">{org.name}</span>
                  {org.issues > 0 && (
                    <span className="text-[11px] text-[--color-muted] mr-2"> · {org.issues} בעיות</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* mini progress */}
                <div className="w-24 h-1.5 bg-[--color-surface] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full admin-anim-bar"
                    style={{
                      width: `${org.score}%`,
                      background: org.score >= 90 ? "#2ecc8f" : org.score >= 70 ? "#f5a623" : "#e8445a",
                      animationDelay: `${0.3 + i * 0.1}s`,
                    }}
                  />
                </div>
                <span className={`text-[15px] font-bold min-w-[36px] text-left ${
                  org.score >= 90 ? "text-[#2ecc8f]" : org.score >= 70 ? "text-[#f5a623]" : "text-[#e8445a]"
                }`}>{org.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* ── Alerts ── */}
        <div className="card-dark p-5 admin-anim-up admin-delay-3 admin-hover-lift">
          <h3 className="text-base font-bold text-[--color-text] mb-4 flex items-center gap-2">
            <div className="admin-anim-glow w-8 h-8 rounded-xl bg-[#f5a623]/10 flex items-center justify-center">
              <Bell size={16} className="text-[#f5a623]" />
            </div>
            התראות ({alerts.length})
          </h3>
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`admin-anim-slide admin-delay-${i + 2} p-3.5 rounded-xl bg-[--color-surface2] border flex items-center justify-between transition-all admin-hover-glow ${
                  alert.level === "critical"
                    ? "border-[#e8445a]/30 border-r-[3px] border-r-[#e8445a]"
                    : "border-[#f5a623]/30 border-r-[3px] border-r-[#f5a623]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    alert.level === "critical" ? "bg-[#e8445a]/10" : "bg-[#f5a623]/10"
                  }`}>
                    <alert.icon size={14} className={alert.level === "critical" ? "text-[#e8445a]" : "text-[#f5a623]"} />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[--color-text]">{alert.org}</div>
                    <div className="text-[11px] text-[--color-muted]">{alert.issue}</div>
                  </div>
                </div>
                <button className="text-[11px] font-semibold text-[#a78bfa] hover:text-[#c4b5fd] px-3 py-1.5 rounded-lg hover:bg-[#a78bfa]/10 transition-all">
                  טפל →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team Tasks ── */}
        <div className="card-dark p-5 admin-anim-up admin-delay-4 admin-hover-lift">
          <h3 className="text-base font-bold text-[--color-text] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center">
              <Users size={16} className="text-[#a78bfa]" />
            </div>
            משימות צוות ({openTasks} פתוחות)
          </h3>
          <div className="space-y-2">
            {teamTasks.map((task, i) => (
              <div key={i} className={`admin-anim-slide admin-delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[--color-surface2] border border-[--color-border] transition-all admin-hover-glow`}>
                <div className="flex items-center gap-3">
                  {task.status === "done" ? (
                    <div className="w-7 h-7 rounded-lg bg-[#2ecc8f]/10 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-[#2ecc8f]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-[#f5a623]/10 flex items-center justify-center">
                      <Clock size={14} className="text-[#f5a623]" />
                    </div>
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
        <div className="card-dark p-5 admin-anim-up admin-delay-5 admin-hover-lift">
          <h3 className="text-base font-bold text-[--color-text] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#4a7cff]/10 flex items-center justify-center">
              <Clock size={16} className="text-[#4a7cff]" />
            </div>
            לוח זמנים – דדליינים
          </h3>
          <div className="space-y-3 relative">
            {/* vertical line */}
            <div className="absolute top-0 bottom-0 right-[11px] w-[2px] bg-[--color-border] rounded-full" />
            {timeline.map((item, i) => (
              <div key={i} className={`admin-anim-slide admin-delay-${i + 1} flex items-center gap-4 relative`}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center z-10 ring-4 ring-[--color-surface]"
                  style={{ background: item.color, boxShadow: `0 0 12px ${item.color}40` }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="flex-1 flex items-center justify-between p-3 rounded-xl bg-[--color-surface2] border border-[--color-border] hover:border-[#a78bfa]/30 transition-all">
                  <div>
                    <div className="text-[13px] font-medium text-[--color-text]">{item.event}</div>
                    <div className="text-[11px] text-[--color-muted]">{item.org}</div>
                  </div>
                  <span className="text-[12px] font-bold text-[--color-muted]">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Integration Status ── */}
        <div className="card-dark p-5 admin-anim-up admin-delay-6 admin-hover-lift">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[--color-text] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2ecc8f]/10 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-[#2ecc8f]" />
              </div>
              סטטוס אינטגרציות
            </h3>
            <span className="badge badge-success">8/10 מחוברות</span>
          </div>
          <div className="space-y-2">
            {recentSyncs.map((item, i) => (
              <div key={i} className={`admin-anim-slide admin-delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.03] transition-all`}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#2ecc8f]" style={{ boxShadow: "0 0 8px rgba(46,204,143,0.5)" }} />
                  <span className="text-[13px] font-medium text-[--color-text]">{item.integration}</span>
                </div>
                <span className="text-[11px] text-[--color-muted]">{item.time}</span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/integrations"
            className="inline-flex items-center gap-1 mt-4 text-[12px] font-semibold text-[#a78bfa] hover:text-[#c4b5fd] transition-colors"
          >
            ניהול אינטגרציות <ArrowLeft size={12} />
          </Link>
        </div>
      </div>
    </>
  );
}
