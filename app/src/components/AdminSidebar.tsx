"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Link2,
  Zap,
  Users,
  BarChart3,
  ChevronDown,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "דשבורד" },
  { href: "/admin/organizations", icon: Building2, label: "ארגונים" },
  { href: "/admin/integrations", icon: Link2, label: "אינטגרציות" },
  { href: "/admin/automation", icon: Zap, label: "אוטומציות" },
  { href: "/admin/users", icon: Users, label: "משתמשים" },
  { href: "/admin/reports", icon: BarChart3, label: "דוחות" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [orgOpen, setOrgOpen] = useState(false);

  return (
    <aside className="sidebar-dark w-60 h-screen fixed right-0 top-0 flex flex-col z-40">
      <div className="px-6 pt-7 pb-5 border-b border-[#2a3050]">
        <div className="text-[10px] text-[#c8a96e] tracking-wider mb-2 font-normal">
          מעטפת ניהולית
        </div>
        <h1 className="text-lg font-bold text-[#e8eaf2] leading-tight">
          פאנל ניהול
        </h1>
        <p className="text-[11px] text-[#7a85a3] mt-1 font-light">עובדי החברה</p>
      </div>

      <div className="px-4 py-3">
        <button
          onClick={() => setOrgOpen(!orgOpen)}
          className="w-full bg-[#1e2335] border border-[#2a3050] rounded-[10px] p-3 flex items-center gap-3 cursor-pointer hover:border-[#4a7cff] transition-colors"
        >
          <div className="flex-1 text-right">
            <div className="text-[10px] text-[#7a85a3] mb-1">צפייה בארגון</div>
            <div className="text-[13px] font-medium text-[#e8eaf2]">כל הארגונים</div>
          </div>
          <ChevronDown
            size={14}
            className={`text-[#7a85a3] transition-transform ${orgOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="flex-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg mb-px transition-all text-[13px] ${
                isActive
                  ? "bg-[#4a7cff]/10 text-[#e8eaf2] border-r-[3px] border-[#4a7cff]"
                  : "text-[#7a85a3] hover:text-[#e8eaf2] hover:bg-white/[0.03]"
              }`}
            >
              <item.icon size={16} strokeWidth={isActive ? 2 : 1.7} />
              <span className="flex-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2a3050]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#4a7cff]/10 border border-[#4a7cff]/30 flex items-center justify-center text-[11px] font-semibold text-[#4a7cff]">
            ע
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-medium text-[#e8eaf2]">עובד מערכת</div>
            <div className="text-[10px] text-[#7a85a3]">Admin</div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-[#7a85a3] hover:text-[#e8445a]">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
