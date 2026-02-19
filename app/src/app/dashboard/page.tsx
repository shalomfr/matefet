"use client";
import Topbar from "@/components/Topbar";
import { CheckCircle2, FileText, Users, Shield } from "lucide-react";

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
  { label: "ממשל תאגידי", pct: 95, color: "#2ecc8f" },
  { label: "ציות רגולטורי", pct: 86, color: "#f5a623" },
  { label: "ניהול סיכונים", pct: 78, color: "#4a7cff" },
  { label: "תשתית נהלים", pct: 100, color: "#2ecc8f" },
  { label: "ממשק רשות המסים", pct: 90, color: "#2ecc8f" },
];

const quickActions = [
  { icon: "📝", label: "פרוטוקול חדש", desc: "תבנית לישיבת ועד" },
  { icon: "📤", label: "הגש דוח", desc: "לרשם / רשות המסים" },
  { icon: "⚠️", label: "דווח אירוע", desc: "ניהול משברים" },
  { icon: "💬", label: "פנה למלווה", desc: "ניהול תקין בע״מ" },
];

export default function DashboardPage() {
  return (
    <>
      <Topbar
        title="שלום יוסי, הנה תמונת המצב שלך"
        subtitle="עמותת אור לציון · עדכון אחרון: היום, 09:14"
      />

      {/* Status Hero Card */}
      <div className="status-hero mb-6">
        <div className="flex items-center gap-5 relative">
          <div className="status-orb">
            <CheckCircle2 size={28} className="text-[#2ecc8f]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[22px] font-semibold text-[#2ecc8f] mb-1">
              הארגון שלך עומד בדרישות
            </h2>
            <p className="text-[13px] text-[--color-muted] leading-relaxed">
              לא זוהו ליקויים קריטיים. יש 2 פריטים שדורשים תשומת לב בחודש הקרוב.
            </p>
          </div>
          <div className="text-center mr-auto">
            <div className="score-num text-[#2ecc8f]">94</div>
            <div className="text-[11px] text-[--color-muted] mt-1">ציון ניהול תקין</div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { title: "ציות רגולטורי", icon: "📋", value: "12/14", label: "דרישות מולאו", tag: "2 פריטים פתוחים", tagClass: "tag-orange" },
          { title: "פגישת ועד הבאה", icon: "📅", value: "18 יום", label: "15 במרץ 2026", tag: "פרוטוקול מוכן", tagClass: "tag-green" },
          { title: "דוח שנתי לרשם", icon: "📄", value: "62 יום", label: "מועד הגשה: 30 אפריל", tag: "בזמן", tagClass: "tag-green" },
        ].map((card, i) => (
          <div key={card.title} className="card-dark p-5" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="card-title">{card.title}</span>
              <span className="text-base">{card.icon}</span>
            </div>
            <div className="kpi-value mb-1">{card.value}</div>
            <div className="text-[12px] text-[--color-muted] mb-2">{card.label}</div>
            <span className={`kpi-tag ${card.tagClass}`}>{card.tag}</span>
          </div>
        ))}
      </div>

      {/* Alerts + Timeline */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Alerts */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="card-title">התראות פעילות</span>
            <span className="text-base">🔔</span>
          </div>
          <div className="flex flex-col gap-2">
            {alerts.map((alert, i) => (
              <div key={i} className={`alert-item ${alert.severity}`}>
                <div className={`alert-dot ${alert.severity}`}></div>
                <div>
                  <div className="text-[13px] font-medium text-[--color-text] mb-0.5">{alert.title}</div>
                  <div className="text-[11px] text-[--color-muted] leading-relaxed">{alert.desc}</div>
                  <div
                    className={`text-[10px] mt-1 font-semibold ${
                      alert.severity === "red"
                        ? "text-[--color-red]"
                        : alert.severity === "orange"
                        ? "text-[--color-orange]"
                        : "text-[--color-green]"
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
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="card-title">יומן רגולטורי קרוב</span>
            <span className="text-base">🗓</span>
          </div>
          <div className="flex flex-col">
            {timeline.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 py-3 ${
                  i < timeline.length - 1 ? "border-b border-white/[0.04]" : ""
                }`}
              >
                <div className="w-[52px] flex-shrink-0 text-center">
                  <div className="tl-day">{item.day}</div>
                  <div className="tl-month">{item.month}</div>
                </div>
                <div className="w-px h-8 bg-[--color-border] flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-[--color-text] mb-0.5">{item.title}</div>
                  <div className="text-[11px] text-[--color-muted]">{item.sub}</div>
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
      <div className="grid grid-cols-2 gap-4">
        {/* Management Areas Progress */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="card-title">מצב תחומי ניהול</span>
            <span className="text-base">📊</span>
          </div>
          <div className="flex flex-col gap-3">
            {progressItems.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[12px] font-medium text-[--color-text]">{item.label}</span>
                  <span className="text-[11px] text-[--color-muted]">{item.pct}%</span>
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
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="card-title">פעולות מהירות</span>
            <span className="text-base">⚡</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <div key={action.label} className="action-btn">
                <div className="text-lg mb-1.5">{action.icon}</div>
                <div className="text-[12px] font-medium text-[--color-text]">{action.label}</div>
                <div className="text-[10px] text-[--color-muted] mt-0.5">{action.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
