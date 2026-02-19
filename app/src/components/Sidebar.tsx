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
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "דשבורד", badge: null },
  { href: "/dashboard/finance", icon: Wallet, label: "ניהול כספי", badge: 3 },
  { href: "/dashboard/donors", icon: Heart, label: "תורמים", badge: 12 },
  { href: "/dashboard/compliance", icon: ShieldCheck, label: "ניהול תקין", badge: 2 },
  { href: "/dashboard/board", icon: Users, label: "ועד מנהל", badge: null },
  { href: "/dashboard/volunteers", icon: HandHelping, label: "מתנדבים", badge: null },
  { href: "/dashboard/automation", icon: Zap, label: "אוטומציות", badge: 5 },
  { href: "/dashboard/reports", icon: BarChart3, label: "דוחות", badge: null },
  { href: "/dashboard/integrations", icon: Link2, label: "אינטגרציות", badge: null },
  { href: "/dashboard/settings", icon: Settings, label: "הגדרות", badge: null },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [orgOpen, setOrgOpen] = useState(false);

  return (
    <aside className="glass-sidebar w-64 h-screen fixed right-0 top-0 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-extrabold bg-gradient-to-l from-[#7c5cfc] to-[#a78bfa] bg-clip-text text-transparent">
          מעטפת
        </h1>
        <p className="text-xs text-[#9b98b8] mt-1">ניהול תקין אוטומטי</p>
      </div>

      {/* Organization Selector */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setOrgOpen(!orgOpen)}
          className="w-full glass-card p-3 flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center text-white text-sm font-bold">
            ע
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm font-semibold text-[#1e1b3a]">עמותת אור</div>
            <div className="text-xs text-[#9b98b8]">580123456</div>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#9b98b8] transition-transform ${orgOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all text-sm font-medium ${
                isActive
                  ? "bg-gradient-to-l from-[#7c5cfc]/15 to-[#a78bfa]/10 text-[#7c5cfc] shadow-sm"
                  : "text-[#6b6894] hover:bg-white/40 hover:text-[#1e1b3a]"
              }`}
            >
              <item.icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={`min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold ${
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
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e879f9] to-[#a78bfa] flex items-center justify-center text-white text-sm font-bold">
            ש
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#1e1b3a]">שלום כהן</div>
            <div className="text-xs text-[#9b98b8]">מנהל</div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-white/50 transition-colors text-[#9b98b8] hover:text-[#f87171]">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
