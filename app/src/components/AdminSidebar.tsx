"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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

const SIDEBAR_PURPLE = "#5c3d9a";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [orgOpen, setOrgOpen] = useState(false);

  return (
    <aside
      className="w-60 h-screen fixed right-0 top-0 flex flex-col z-40 sidebar-ecoursie"
      style={{ background: SIDEBAR_PURPLE }}
    >
      <div className="px-6 pt-7 pb-5 border-b border-white/10">
        <div className="text-[10px] text-[#d4c8e8] tracking-wider mb-2 font-normal">
          מעטפת ניהולית
        </div>
        <h1 className="text-lg font-bold text-white leading-tight">
          פאנל ניהול
        </h1>
        <p className="text-[11px] text-[#b8a8d0] mt-1 font-light">עובדי החברה</p>
      </div>

      <div className="px-4 py-3">
        <button
          onClick={() => setOrgOpen(!orgOpen)}
          className="w-full bg-white/10 border border-white/15 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/15 transition-colors"
        >
          <div className="flex-1 text-right">
            <div className="text-[10px] text-[#b8a8d0] mb-1">צפייה בארגון</div>
            <div className="text-[13px] font-medium text-white">כל הארגונים</div>
          </div>
          <ChevronDown
            size={14}
            className={`text-[#b8a8d0] transition-transform ${orgOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="flex-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl mb-1 transition-all text-[13px] ${
                isActive
                  ? "bg-white/20 text-white border-r-[3px] border-white"
                  : `text-[#b8a8d0] hover:text-white hover:bg-white/10`
              }`}
            >
              <item.icon size={16} strokeWidth={isActive ? 2 : 1.7} />
              <span className="flex-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            ע
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-medium text-white">עובד מערכת</div>
            <div className="text-[10px] text-[#b8a8d0]">Admin</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-[#b8a8d0] hover:text-[#fca5a5]"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
