"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  BarChart3,
  Link2,
  Settings,
  ChevronDown,
  LogOut,
  CalendarDays,
  FolderOpen,
  Scale,
  MessageCircle,
  Pin,
} from "lucide-react";

const navSections = [
  {
    label: "ניהול",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "לוח בקרה", badge: null },
      { href: "/dashboard/compliance", icon: ShieldCheck, label: "ציות רגולטורי", badge: 2 },
      { href: "/dashboard/calendar", icon: CalendarDays, label: "לוח שנה רגולטורי", badge: 3 },
      { href: "/dashboard/documents", icon: FolderOpen, label: "ספריית מסמכים", badge: null },
      { href: "/dashboard/risks", icon: Scale, label: "ניהול סיכונים", badge: null },
    ],
  },
  {
    label: "ארגון",
    items: [
      { href: "/dashboard/board", icon: Users, label: "ועד ונושאי משרה", badge: null },
      { href: "/dashboard/reports", icon: BarChart3, label: "דוחות ותקציב", badge: null },
      { href: "/dashboard/integrations", icon: Link2, label: "ממשקי רשויות", badge: null },
    ],
  },
  {
    label: "ליווי",
    items: [
      { href: "/dashboard/contact", icon: MessageCircle, label: "פניה למלווה", badge: null },
      { href: "/dashboard/projects", icon: Pin, label: "פרויקטים פעילים", badge: null },
      { href: "/dashboard/settings", icon: Settings, label: "הגדרות", badge: null },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [orgOpen, setOrgOpen] = useState(false);

  return (
    <aside className="sidebar-dark w-60 h-screen fixed right-0 top-0 flex flex-col z-40">
      {/* Logo with blessing */}
      <div className="px-6 pt-7 pb-5 border-b border-[#2a3050]">
        <div className="text-[10px] text-[#c8a96e] tracking-wider mb-2 font-normal">
          בסיעתא דשמיא
        </div>
        <h1 className="text-lg font-bold text-[#e8eaf2] leading-tight">
          ניהול תקין
        </h1>
        <p className="text-[11px] text-[#7a85a3] mt-1 font-light">מעטפת ניהולית בע״מ</p>
      </div>

      {/* Organization Selector */}
      <div className="px-4 py-3">
        <button
          onClick={() => setOrgOpen(!orgOpen)}
          className="w-full bg-[#1e2335] border border-[#2a3050] rounded-[10px] p-3 flex items-center gap-3 cursor-pointer hover:border-[#4a7cff] transition-colors"
        >
          <div className="flex-1 text-right">
            <div className="text-[10px] text-[#7a85a3] mb-1">ארגון פעיל</div>
            <div className="text-[13px] font-medium text-[#e8eaf2]">עמותת אור לציון</div>
            <div className="text-[11px] text-[#7a85a3] mt-0.5">עמותה רשומה · מס׳ 580123456</div>
          </div>
          <ChevronDown
            size={14}
            className={`text-[#7a85a3] transition-transform ${orgOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation with sections */}
      <nav className="flex-1 px-2 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="px-4 pt-3 pb-1 text-[10px] text-[#7a85a3] tracking-wider uppercase font-semibold">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-lg mb-px transition-all text-[13px] ${
                    isActive
                      ? "bg-[#4a7cff]/10 text-[#e8eaf2] border-r-[3px] border-[#4a7cff]"
                      : "text-[#7a85a3] hover:text-[#e8eaf2] hover:bg-white/[0.03]"
                  }`}
                >
                  <item.icon size={16} strokeWidth={isActive ? 2 : 1.7} />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="bg-[#e8445a] text-white rounded-[10px] text-[10px] px-1.5 py-px font-semibold">
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
      <div className="p-4 border-t border-[#2a3050]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#4a7cff]/10 border border-[#4a7cff]/30 flex items-center justify-center text-[11px] font-semibold text-[#4a7cff]">
            שכ
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-medium text-[#e8eaf2]">שלום כהן</div>
            <div className="text-[10px] text-[#7a85a3]">מנהל עמותה</div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-[#7a85a3] hover:text-[#e8445a]">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
