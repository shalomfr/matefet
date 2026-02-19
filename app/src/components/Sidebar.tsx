"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Heart,
  ShieldCheck,
  Users,
  HandHelping,
  Zap,
  BarChart3,
  Link2,
  Settings,
  ChevronDown,
  LogOut,
  CalendarDays,
  FileText,
  AlertTriangle,
  MessageCircle,
  FolderOpen,
} from "lucide-react";

const navSections = [
  {
    label: "ניהול",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "לוח בקרה", badge: null },
      { href: "/dashboard/compliance", icon: ShieldCheck, label: "ציות רגולטורי", badge: 2 },
      { href: "/dashboard/finance", icon: Wallet, label: "ניהול כספי", badge: 3 },
      { href: "/dashboard/donors", icon: Heart, label: "תורמים", badge: 12 },
    ],
  },
  {
    label: "ארגון",
    items: [
      { href: "/dashboard/board", icon: Users, label: "ועד ונושאי משרה", badge: null },
      { href: "/dashboard/volunteers", icon: HandHelping, label: "מתנדבים", badge: null },
      { href: "/dashboard/reports", icon: BarChart3, label: "דוחות ותקציב", badge: null },
      { href: "/dashboard/automation", icon: Zap, label: "אוטומציות", badge: 5 },
    ],
  },
  {
    label: "ליווי",
    items: [
      { href: "/dashboard/integrations", icon: Link2, label: "ממשקי רשויות", badge: null },
      { href: "/dashboard/settings", icon: Settings, label: "הגדרות", badge: null },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [orgOpen, setOrgOpen] = useState(false);

  return (
    <aside className="glass-sidebar w-64 h-screen fixed right-0 top-0 flex flex-col z-40">
      {/* Logo with blessing */}
      <div className="p-6 pb-4 border-b border-white/20">
        <div className="text-[10px] text-[#c8a96e] tracking-wider mb-1.5 font-normal">
          בסיעתא דשמיא
        </div>
        <h1
          className="text-xl font-bold text-[#1e1b3a] leading-tight"
          style={{ fontFamily: "'Frank Ruhl Libre', serif" }}
        >
          מעטפת
        </h1>
        <p className="text-[11px] text-[#9b98b8] mt-0.5 font-light">ניהול תקין אוטומטי לעמותות</p>
      </div>

      {/* Organization Selector */}
      <div className="px-4 py-3">
        <button
          onClick={() => setOrgOpen(!orgOpen)}
          className="w-full glass-card p-3 flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center text-white text-sm font-bold">
            ע
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm font-semibold text-[#1e1b3a]">עמותת אור לציון</div>
            <div className="text-[11px] text-[#9b98b8]">עמותה רשומה · 580123456</div>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#9b98b8] transition-transform ${orgOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation with sections */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all text-[13px] font-medium ${
                    isActive
                      ? "bg-gradient-to-l from-[#7c5cfc]/15 to-[#a78bfa]/10 text-[#7c5cfc] shadow-sm border-r-[3px] border-[#7c5cfc]"
                      : "text-[#6b6894] hover:bg-white/40 hover:text-[#1e1b3a]"
                  }`}
                >
                  <item.icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-[#7c5cfc] text-white"
                          : "bg-[#7c5cfc]/10 text-[#7c5cfc]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c5cfc]/20 to-[#a78bfa]/10 border border-[#7c5cfc]/30 flex items-center justify-center text-[12px] font-semibold text-[#7c5cfc]">
            שכ
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-medium text-[#1e1b3a]">שלום כהן</div>
            <div className="text-[10px] text-[#9b98b8]">מנהל עמותה</div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-white/50 transition-colors text-[#9b98b8] hover:text-[#f87171]">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
