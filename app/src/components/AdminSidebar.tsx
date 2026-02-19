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

export default function AdminSidebar() {
  const pathname = usePathname();
  const [orgOpen, setOrgOpen] = useState(false);

  return (
    <aside
      className="w-60 h-screen fixed right-0 top-0 flex flex-col z-40"
      style={{
        background: "#ffffff",
        borderLeft: "1px solid #e8ecf4",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.03)",
      }}
    >
      {/* Logo / Brand */}
      <div className="px-6 pt-7 pb-5 border-b border-[#e8ecf4]">
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px] font-bold"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5c3d9a)" }}
          >
            מ
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-[#1e293b] leading-tight">
              מעטפת ניהולית
            </h1>
            <p className="text-[10px] text-[#94a3b8] font-medium">פאנל ניהול</p>
          </div>
        </div>
      </div>

      {/* Organization Selector */}
      <div className="px-4 py-3">
        <button
          onClick={() => setOrgOpen(!orgOpen)}
          className="w-full bg-[#f8f9fc] border border-[#e8ecf4] rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#f3effa] hover:border-[#d4c8e8] transition-all"
        >
          <div className="flex-1 text-right">
            <div className="text-[10px] text-[#94a3b8] mb-0.5">צפייה בארגון</div>
            <div className="text-[13px] font-semibold text-[#1e293b]">כל הארגונים</div>
          </div>
          <ChevronDown
            size={14}
            className={`text-[#94a3b8] transition-transform ${orgOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-1 transition-all text-[13px] ${
                isActive
                  ? "bg-[#f3effa] text-[#5c3d9a] border-r-[3px] border-[#7c3aed] font-semibold"
                  : "text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8f9fc] font-medium"
              }`}
            >
              <item.icon
                size={16}
                strokeWidth={isActive ? 2.2 : 1.7}
                className={isActive ? "text-[#7c3aed]" : ""}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-[#e8ecf4]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5c3d9a)" }}
          >
            ע
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold text-[#1e293b]">עובד מערכת</div>
            <div className="text-[10px] text-[#94a3b8]">Admin</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 rounded-lg hover:bg-[#fef2f2] transition-colors text-[#94a3b8] hover:text-[#ef4444]"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
