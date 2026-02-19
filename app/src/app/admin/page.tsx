"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import {
  Building2, Link2, Zap, AlertTriangle, CheckCircle2, Clock,
  Users, ArrowLeft, Bell, Shield, FileWarning, TrendingUp,
} from "lucide-react";

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
  { date: "20.02", org: "עמותת חיים", event: "אישור תקנון", color: "#16a34a" },
  { date: "22.02", org: "קרן חסד", event: "בדיקת אינטגרציה", color: "#d97706" },
  { date: "28.02", org: "אגודת הסטודנטים", event: "תזכורת דוח שנתי", color: "#ef4444" },
  { date: "05.03", org: "אור לציון", event: "חידוש ניהול תקין", color: "#ef4444" },
  { date: "31.03", org: "הכל", event: "דדליין דוחות שנתיים", color: "#7c3aed" },
];

const recentSyncs = [
  { integration: "חשבונית ירוקה", time: "לפני 5 דקות" },
  { integration: "רשם העמותות", time: "לפני יום" },
  { integration: "Tranzila", time: "לפני 12 דקות" },
  { integration: "Google Workspace", time: "לפני 3 שעות" },
];

export default function AdminDashboardPage() {
  const okOrgs = orgHealth.filter((o) => o.status === "ok").length;
  const warnOrgs = orgHealth.filter((o) => o.status === "warning").length;
  const critOrgs = orgHealth.filter((o) => o.status === "critical").length;
  const openTasks = teamTasks.filter((t) => t.status === "open").length;

  return (
    <div className="px-8 pb-8">
      <Topbar title="דשבורד פנימי" subtitle="מעטפת ניהולית · עדכון אחרון: היום 14:30" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="anim-fade-scale delay-1"><StatCard icon={Building2} label="ארגונים פעילים" value={String(orgHealth.length)} color="#7c3aed" /></div>
        <div className="anim-fade-scale delay-2"><StatCard icon={Link2} label="אינטגרציות מחוברות" value="8/10" color="#16a34a" /></div>
        <div className="anim-fade-scale delay-3"><StatCard icon={Zap} label="אוטומציות פעילות" value="10" change="+3" trend="up" color="#7c3aed" /></div>
        <div className="anim-fade-scale delay-4"><StatCard icon={AlertTriangle} label="התראות פתוחות" value={String(alerts.length)} color="#d97706" /></div>
      </div>

      {/* Org Health */}
      <div className="anim-fade-up delay-2 bg-white rounded-2xl p-5 mb-6 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f3effa] flex items-center justify-center"><TrendingUp size={16} className="text-[#7c3aed]" /></div>
            סקירת ארגונים
          </h3>
          <Link href="/admin/organizations" className="text-[12px] font-semibold text-[#7c3aed] hover:underline flex items-center gap-1">
            לכל הארגונים <ArrowLeft size={12} />
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-5">
          {[
            { count: okOrgs, label: "תקינים", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
            { count: warnOrgs, label: "דורשים תשומת לב", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
            { count: critOrgs, label: "קריטי", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
          ].map((chip) => (
            <div key={chip.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105" style={{ background: chip.bg, border: `1px solid ${chip.border}` }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: chip.color }} />
              <span className="text-[13px] font-semibold" style={{ color: chip.color }}>{chip.count} {chip.label}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {orgHealth.map((org, i) => (
            <div key={org.name} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#7c3aed]/20 transition-all`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-9 rounded-full" style={{ background: org.status === "ok" ? "#16a34a" : org.status === "warning" ? "#d97706" : "#ef4444" }} />
                <div>
                  <span className="text-[13px] font-medium text-[#1e293b]">{org.name}</span>
                  {org.issues > 0 && <span className="text-[11px] text-[#64748b] mr-2"> · {org.issues} בעיות</span>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div className="h-full rounded-full anim-progress" style={{ width: `${org.score}%`, background: org.score >= 90 ? "#16a34a" : org.score >= 70 ? "#d97706" : "#ef4444", animationDelay: `${0.3 + i * 0.1}s` }} />
                </div>
                <span className={`text-[15px] font-bold min-w-[36px] text-left ${org.score >= 90 ? "text-[#16a34a]" : org.score >= 70 ? "text-[#d97706]" : "text-[#ef4444]"}`}>{org.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Alerts */}
        <div className="anim-fade-up delay-3 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fffbeb] flex items-center justify-center"><Bell size={16} className="text-[#d97706]" /></div>
            התראות ({alerts.length})
          </h3>
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div key={i} className={`anim-fade-right delay-${i + 2} p-3.5 rounded-xl bg-[#f8f9fc] border flex items-center justify-between hover-glow ${alert.level === "critical" ? "border-[#fecaca] border-r-[3px] border-r-[#ef4444]" : "border-[#fde68a] border-r-[3px] border-r-[#d97706]"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${alert.level === "critical" ? "bg-[#fef2f2]" : "bg-[#fffbeb]"}`}>
                    <alert.icon size={14} className={alert.level === "critical" ? "text-[#ef4444]" : "text-[#d97706]"} />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#1e293b]">{alert.org}</div>
                    <div className="text-[11px] text-[#64748b]">{alert.issue}</div>
                  </div>
                </div>
                <button className="text-[11px] font-semibold text-[#7c3aed] hover:text-[#5b21b6] px-3 py-1.5 rounded-lg hover:bg-[#f3effa] transition-all">טפל →</button>
              </div>
            ))}
          </div>
        </div>

        {/* Team Tasks */}
        <div className="anim-fade-up delay-4 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f3effa] flex items-center justify-center"><Users size={16} className="text-[#7c3aed]" /></div>
            משימות צוות ({openTasks} פתוחות)
          </h3>
          <div className="space-y-2">
            {teamTasks.map((task, i) => (
              <div key={i} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#7c3aed]/20 transition-all`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${task.status === "done" ? "bg-[#f0fdf4]" : "bg-[#fffbeb]"}`}>
                    {task.status === "done" ? <CheckCircle2 size={14} className="text-[#16a34a]" /> : <Clock size={14} className="text-[#d97706]" />}
                  </div>
                  <div>
                    <div className={`text-[13px] font-medium ${task.status === "done" ? "text-[#64748b] line-through" : "text-[#1e293b]"}`}>{task.task}</div>
                    <div className="text-[11px] text-[#64748b]">{task.assignee} · עד {task.due}</div>
                  </div>
                </div>
                {task.status === "done" && <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1 rounded-lg border border-[#bbf7d0]">הושלם</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="anim-fade-up delay-5 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f3effa] flex items-center justify-center"><Clock size={16} className="text-[#7c3aed]" /></div>
            לוח זמנים – דדליינים
          </h3>
          <div className="space-y-3 relative">
            <div className="absolute top-0 bottom-0 right-[11px] w-[2px] bg-[#e8ecf4] rounded-full" />
            {timeline.map((item, i) => (
              <div key={i} className={`anim-fade-right delay-${i + 1} flex items-center gap-4 relative`}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center z-10 ring-4 ring-white" style={{ background: item.color }}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="flex-1 flex items-center justify-between p-3 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#7c3aed]/20 transition-all">
                  <div>
                    <div className="text-[13px] font-medium text-[#1e293b]">{item.event}</div>
                    <div className="text-[11px] text-[#64748b]">{item.org}</div>
                  </div>
                  <span className="text-[12px] font-bold text-[#64748b]">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Status */}
        <div className="anim-fade-up delay-6 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center"><CheckCircle2 size={16} className="text-[#16a34a]" /></div>
              סטטוס אינטגרציות
            </h3>
            <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1 rounded-lg border border-[#bbf7d0]">8/10 מחוברות</span>
          </div>
          <div className="space-y-2">
            {recentSyncs.map((item, i) => (
              <div key={i} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all`}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#16a34a]" style={{ boxShadow: "0 0 6px rgba(22,163,74,0.4)" }} />
                  <span className="text-[13px] font-medium text-[#1e293b]">{item.integration}</span>
                </div>
                <span className="text-[11px] text-[#64748b]">{item.time}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/integrations" className="inline-flex items-center gap-1 mt-4 text-[12px] font-semibold text-[#7c3aed] hover:underline">
            ניהול אינטגרציות <ArrowLeft size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
