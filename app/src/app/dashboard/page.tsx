"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import {
  Wallet,
  Heart,
  ShieldCheck,
  Users,
  TrendingUp,
  FileText,
  ArrowUpLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

const recentActivity = [
  { icon: Heart, color: "#e879f9", text: "תרומה חדשה - ₪5,000 מדוד לוי", time: "לפני 12 דקות" },
  { icon: FileText, color: "#7c5cfc", text: "קבלה #1042 נשלחה אוטומטית", time: "לפני 15 דקות" },
  { icon: CheckCircle2, color: "#34d399", text: "דוח שנתי 2025 הוגש בהצלחה", time: "לפני שעה" },
  { icon: Zap, color: "#fbbf24", text: "אוטומציה: ברכות חנוכה נשלחו ל-248 תורמים", time: "לפני 2 שעות" },
  { icon: Users, color: "#60a5fa", text: "ישיבת ועד #18 - פרוטוקול נוצר אוטומטית", time: "לפני 3 שעות" },
  { icon: AlertTriangle, color: "#f87171", text: "תזכורת: חידוש אישור ניהול תקין בעוד 28 יום", time: "אתמול" },
];

const upcomingTasks = [
  { task: "הגשת דוח רבעוני למס הכנסה", date: "15.03.2026", status: "warning" as const },
  { task: "חידוש אישור ניהול תקין", date: "19.03.2026", status: "danger" as const },
  { task: "ישיבת ועד מנהל #19", date: "22.03.2026", status: "info" as const },
  { task: "שליחת דוח שנתי לרשם העמותות", date: "31.03.2026", status: "warning" as const },
];

export default function DashboardPage() {
  return (
    <>
      <Topbar title="דשבורד" />

      {/* Welcome Banner */}
      <div className="gradient-banner p-6 mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-white text-xl font-bold mb-1">בוקר טוב, שלום! 👋</h3>
          <p className="text-white/70 text-sm">
            העמותה מנוהלת תקין - 4 משימות ממתינות לתשומת לבך
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors">
            צפה במשימות
          </button>
          <button className="bg-white text-[#7c5cfc] px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all">
            דוח מהיר
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Wallet}
          label="הכנסות החודש"
          value="₪127,450"
          change="+18.2%"
          trend="up"
          color="#7c5cfc"
        />
        <StatCard
          icon={Heart}
          label="תורמים פעילים"
          value="342"
          change="+12"
          trend="up"
          color="#e879f9"
        />
        <StatCard
          icon={ShieldCheck}
          label="ציון ניהול תקין"
          value="96%"
          change="+3%"
          trend="up"
          color="#34d399"
        />
        <StatCard
          icon={TrendingUp}
          label="אוטומציות פעילות"
          value="18"
          change="5 חדשות"
          trend="up"
          color="#60a5fa"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#1e1b3a]">פעילות אחרונה</h3>
            <button className="text-xs text-[#7c5cfc] font-semibold hover:underline">
              הצג הכל
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/40 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}15` }}
                >
                  <item.icon size={17} style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#1e1b3a]">{item.text}</div>
                </div>
                <div className="text-xs text-[#9b98b8] flex items-center gap-1 flex-shrink-0">
                  <Clock size={12} />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#1e1b3a]">משימות קרובות</h3>
            <span className="badge badge-purple">{upcomingTasks.length} פתוחות</span>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/30 border border-white/50 hover:bg-white/50 transition-colors"
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className={`status-dot ${task.status} mt-1.5`}></span>
                  <div className="text-sm font-medium text-[#1e1b3a]">{task.task}</div>
                </div>
                <div className="flex items-center justify-between mr-4">
                  <span className="text-xs text-[#9b98b8]">{task.date}</span>
                  <button className="text-xs text-[#7c5cfc] font-semibold hover:underline">
                    טפל
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="glass-card p-5">
          <h4 className="text-sm font-bold text-[#1e1b3a] mb-3">חלוקת הכנסות</h4>
          <div className="space-y-3">
            {[
              { label: "תרומות", pct: 68, color: "#7c5cfc" },
              { label: "מענקים", pct: 22, color: "#e879f9" },
              { label: "אירועים", pct: 10, color: "#60a5fa" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#6b6894] font-medium">{item.label}</span>
                  <span className="font-bold" style={{ color: item.color }}>
                    {item.pct}%
                  </span>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.pct}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h4 className="text-sm font-bold text-[#1e1b3a] mb-3">ניהול תקין - סטטוס</h4>
          <div className="space-y-2">
            {[
              { label: "מסמכי יסוד", ok: true },
              { label: "פרוטוקולים", ok: true },
              { label: "דוח כספי שנתי", ok: true },
              { label: "אישור ניהול תקין", ok: false },
              { label: "דוח מילולי", ok: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span className="text-sm text-[#6b6894]">{item.label}</span>
                {item.ok ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h4 className="text-sm font-bold text-[#1e1b3a] mb-3">אוטומציות אחרונות</h4>
          <div className="space-y-2">
            {[
              { name: "קבלות אוטומטיות", runs: 142, active: true },
              { name: "תזכורות ניהול תקין", runs: 8, active: true },
              { name: "דוחות חודשיים", runs: 12, active: true },
              { name: "ברכות לתורמים", runs: 248, active: true },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-[#7c5cfc]" />
                  <span className="text-sm text-[#6b6894]">{item.name}</span>
                </div>
                <span className="badge badge-success">{item.runs} הרצות</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
