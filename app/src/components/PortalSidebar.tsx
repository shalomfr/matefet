"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckCircle, Calendar, FileText, BarChart2, MessageCircle, LogOut } from "lucide-react";

const SIDEBAR_PURPLE = "#5c3d9a";

const navItems = [
  { href: "/portal", icon: Home, label: "המצב שלי" },
  { href: "/portal/status", icon: CheckCircle, label: "האם אני בסדר?" },
  { href: "/portal/calendar", icon: Calendar, label: "מה מתקרב?" },
  { href: "/portal/documents", icon: FileText, label: "המסמכים שלי" },
  { href: "/portal/reports", icon: BarChart2, label: "דוחות ותקציב" },
  { href: "/portal/contact", icon: MessageCircle, label: "פנה למלווה" },
];

export default function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 h-screen fixed right-0 top-0 flex flex-col z-40 sidebar-ecoursie"
      style={{ background: SIDEBAR_PURPLE }}
    >
      <div className="px-6 pt-7 pb-5 border-b border-white/10">
        <div className="text-[10px] text-[#d4c8e8] tracking-wider mb-2 font-normal">
          בסיעתא דשמיא
        </div>
        <h1 className="text-[22px] font-bold text-white leading-tight font-[Frank_Ruhl_Libre,serif]">
          מעטפת
        </h1>
        <p className="text-[12px] text-[#b8a8d0] mt-1">מעטפת ניהולית בע״מ</p>
      </div>

      <div className="px-4 py-3">
        <div className="bg-white/10 border border-white/15 rounded-xl p-3">
          <div className="text-[11px] text-[#b8a8d0] mb-1">הארגון שלי</div>
          <div className="text-[14px] font-semibold text-white">עמותת אור לציון</div>
          <div className="text-[11px] text-[#b8a8d0] mt-1">מס׳ עמותה: 580123456</div>
        </div>
      </div>

      <nav className="flex-1 px-2 overflow-y-auto py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/portal" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-[15px] font-medium transition-all ${
                isActive
                  ? "bg-white/20 text-white border-r-[3px] border-white"
                  : "text-[#b8a8d0] hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.7} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[14px] font-bold text-white">
            יל
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-white">יוסי לוי</div>
            <div className="text-[11px] text-[#b8a8d0]">מנהל עמותה</div>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/10 text-[#b8a8d0] hover:text-[#fca5a5] transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
