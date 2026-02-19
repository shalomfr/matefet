"use client";
import Topbar from "@/components/Topbar";
import {
  Wallet,
  Heart,
  ShieldCheck,
  Users,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Calendar,
  Send,
  FileWarning,
  MessageCircle,
} from "lucide-react";

const alerts = [
  {
    severity: "red" as const,
    title: "חידוש אישור ניהול תקין",
    desc: "האישור פג בעוד 14 יום – נדרשת הגשת מסמכים לרשם",
    due: "דחוף · עד 5 במרץ 2026",
  },
  {
    severity: "orange" as const,
    title: "עדכון תקנון – סעיף 12",
    desc: "נדרש עדכון בעקבות שינוי חקיקה בינואר 2026",
    due: "עד 31 במרץ 2026",
  },
  {
    severity: "green" as const,
    title: "דוח כספי רבעוני – הוגש ✓",
    desc: "הדוח לרבעון ד׳ 2025 הוגש ואושר בהצלחה",
    due: "הושלם · 12.02.2026",
  },
];

const timeline = [
  { day: "05", month: "מרץ", title: "חידוש ניהול תקין", sub: "הגשה לרשם העמותות", badge: "דחוף", badgeColor: "danger" },
  { day: "15", month: "מרץ", title: "ישיבת ועד רבעונית", sub: "פרוטוקול · אישור תקציב", badge: "בהכנה", badgeColor: "warning" },
  { day: "31", month: "מרץ", title: "עדכון תקנון", sub: "הגשה לאישור הועד", badge: "ממתין", badgeColor: "warning" },
  { day: "30", month: "אפריל", title: "דוח שנתי לרשם", sub: "כולל דוח כספי מבוקר", badge: "בזמן", badgeColor: "success" },
];

const progressItems = [
  { label: "ממשל תאגידי", pct: 95, color: "#34d399" },
  { label: "ציות רגולטורי", pct: 86, color: "#fbbf24" },
  { label: "ניהול סיכונים", pct: 78, color: "#7c5cfc" },
  { label: "תשתית נהלים", pct: 100, color: "#34d399" },
  { label: "ממשק רשות המסים", pct: 90, color: "#34d399" },
];

const quickActions = [
  { icon: "📝", label: "פרוטוקול חדש", desc: "תבנית לישיבת ועד" },
  { icon: "📤", label: "הגש דוח", desc: "לרשם / רשות המסים" },
  { icon: "⚠️", label: "דווח אירוע", desc: "ניהול משברים" },
  { icon: "💬", label: "פנה למלווה", desc: "ניהול תקין בע״מ" },
];

const recentActivity = [
  { icon: Heart, color: "#e879f9", text: "תרומה חדשה - ₪5,000 מדוד לוי", time: "לפני 12 דקות" },
  { icon: FileText, color: "#7c5cfc", text: "קבלה #1042 נשלחה אוטומטית", time: "לפני 15 דקות" },
  { icon: CheckCircle2, color: "#34d399", text: "דוח שנתי 2025 הוגש בהצלחה", time: "לפני שעה" },
  { icon: Zap, color: "#fbbf24", text: "אוטומציה: ברכות חנוכה נשלחו ל-248 תורמים", time: "לפני 2 שעות" },
  { icon: Users, color: "#60a5fa", text: "ישיבת ועד #18 - פרוטוקול נוצר אוטומטית", time: "לפני 3 שעות" },
];

export default function DashboardPage() {
  return (
    <>
      <Topbar title="לוח בקרה" />

      {/* Status Hero Card */}
      <div className="status-hero mb-6">
        <div className="flex items-center gap-5 relative">
          <div className="status-orb">
            <CheckCircle2 size={28} className="text-emerald-500" />
          </div>
          <div className="flex-1">
            <h2
              className="text-[22px] font-semibold text-emerald-600 mb-1"
              style={{ fontFamily: "'Frank Ruhl Libre', serif" }}
            >
              הארגון שלך עומד בדרישות
            </h2>
            <p className="text-[13px] text-[#6b6894] leading-relaxed">
              לא זוהו ליקויים קריטיים. יש 2 פריטים שדורשים תשומת לב בחודש הקרוב.
            </p>
          </div>
          <div className="text-center mr-auto">
            <div className="score-num text-emerald-500">94</div>
            <div className="text-[11px] text-[#9b98b8] mt-1">ציון ניהול תקין</div>
          </div>
        </div>
      </div>

      {/* KPI Row - 3 cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { title: "ציות רגולטורי", icon: "📋", value: "12/14", label: "דרישות מולאו", tag: "2 פריטים פתוחים", tagColor: "warning" },
          { title: "פגישת ועד הבאה", icon: "📅", value: "18 יום", label: "15 במרץ 2026", tag: "פרוטוקול מוכן", tagColor: "success" },
          { title: "דוח שנתי לרשם", icon: "📄", value: "62 יום", label: "מועד הגשה: 30 אפריל", tag: "בזמן", tagColor: "success" },
        ].map((card, i) => (
          <div
            key={card.title}
            className={`glass-card p-5 animate-fadeUp${i > 0 ? `-${i}` : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">{card.title}</span>
              <span className="text-base">{card.icon}</span>
            </div>
            <div className="kpi-value mb-1">{card.value}</div>
            <div className="text-[12px] text-[#9b98b8] mb-2">{card.label}</div>
            <span
              className={`badge badge-${card.tagColor}`}
            >
              {card.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Alerts + Timeline */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Alerts */}
        <div className="glass-card p-5 animate-fadeUp">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label">התראות פעילות</span>
            <span className="text-base">🔔</span>
          </div>
          <div className="flex flex-col gap-2">
            {alerts.map((alert, i) => (
              <div key={i} className={`alert-item ${alert.severity}`}>
                <div className={`alert-dot ${alert.severity}`}></div>
                <div>
                  <div className="text-[13px] font-medium text-[#1e1b3a] mb-0.5">{alert.title}</div>
                  <div className="text-[11px] text-[#6b6894] leading-relaxed">{alert.desc}</div>
                  <div
                    className={`text-[10px] mt-1 font-semibold ${
                      alert.severity === "red"
                        ? "text-red-500"
                        : alert.severity === "orange"
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {alert.severity === "red" && "⚠ "}
                    {alert.due}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card p-5 animate-fadeUp-1">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label">יומן רגולטורי קרוב</span>
            <span className="text-base">🗓</span>
          </div>
          <div className="flex flex-col">
            {timeline.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 py-3 ${
                  i < timeline.length - 1 ? "border-b border-[#7c5cfc]/5" : ""
                }`}
              >
                <div className="w-[52px] flex-shrink-0 text-center">
                  <div className="tl-day">{item.day}</div>
                  <div className="tl-month">{item.month}</div>
                </div>
                <div className="w-px h-8 bg-[#7c5cfc]/10 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-[#1e1b3a] mb-0.5">{item.title}</div>
                  <div className="text-[11px] text-[#9b98b8]">{item.sub}</div>
                </div>
                <span className={`badge badge-${item.badgeColor} flex-shrink-0`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress + Quick Actions */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Management Areas Progress */}
        <div className="glass-card p-5 animate-fadeUp-2">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label">מצב תחומי ניהול</span>
            <span className="text-base">📊</span>
          </div>
          <div className="flex flex-col gap-3">
            {progressItems.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[12px] font-medium text-[#1e1b3a]">{item.label}</span>
                  <span className="text-[11px] text-[#9b98b8]">{item.pct}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${item.pct}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-5 animate-fadeUp-3">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label">פעולות מהירות</span>
            <span className="text-base">⚡</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <div key={action.label} className="action-btn">
                <div className="text-lg mb-1.5">{action.icon}</div>
                <div className="text-[12px] font-medium text-[#1e1b3a]">{action.label}</div>
                <div className="text-[10px] text-[#9b98b8] mt-0.5">{action.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity + Stats */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="col-span-2 glass-card p-5 animate-fadeUp-4">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label">פעילות אחרונה</span>
            <button className="text-xs text-[#7c5cfc] font-semibold hover:underline">
              הצג הכל
            </button>
          </div>
          <div className="space-y-2">
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
                  <div className="text-[13px] font-medium text-[#1e1b3a]">{item.text}</div>
                </div>
                <div className="text-[11px] text-[#9b98b8] flex items-center gap-1 flex-shrink-0">
                  <Clock size={12} />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automations stats */}
        <div className="glass-card p-5 animate-fadeUp-4">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label">אוטומציות פעילות</span>
            <Zap size={16} className="text-[#7c5cfc]" />
          </div>
          <div className="space-y-3">
            {[
              { name: "קבלות אוטומטיות", runs: 142, active: true },
              { name: "תזכורות ניהול תקין", runs: 8, active: true },
              { name: "דוחות חודשיים", runs: 12, active: true },
              { name: "ברכות לתורמים", runs: 248, active: true },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <Zap size={13} className="text-[#7c5cfc]" />
                  <span className="text-[12px] text-[#6b6894]">{item.name}</span>
                </div>
                <span className="badge badge-success text-[10px]">{item.runs} הרצות</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
