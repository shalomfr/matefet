"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckCircle, Calendar, FileText, BarChart2, MessageCircle, LogOut } from "lucide-react";

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
    <aside className="w-60 h-screen fixed right-0 top-0 flex flex-col z-40 bg-white border-l border-[#e2e8f2] portal-sidebar">
      <div className="px-6 pt-7 pb-5 border-b border-[#e2e8f2]">
        <div className="text-[10px] text-[#b45309] tracking-wider mb-2 font-normal">
          בסיעתא דשמיא
        </div>
        <h1 className="text-[22px] font-bold text-[#1e293b] leading-tight font-[Frank_Ruhl_Libre,serif]">
          מעטפת
        </h1>
        <p className="text-[12px] text-[#64748b] mt-1">מעטפת ניהולית בע״מ</p>
      </div>

      <div className="px-4 py-3">
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-3">
          <div className="text-[11px] text-[#64748b] mb-1">הארגון שלי</div>
          <div className="text-[14px] font-semibold text-[#1e293b]">עמותת אור לציון</div>
          <div className="text-[11px] text-[#64748b] mt-1">מס׳ עמותה: 580123456</div>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-[15px] font-medium transition-all ${
                isActive
                  ? "bg-[#eff6ff] text-[#2563eb] border-r-[3px] border-[#2563eb]"
                  : "text-[#64748b] hover:text-[#1e293b] hover:bg-[#f4f6fb]"
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.7} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e2e8f2]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#eff6ff] border-2 border-[#bfdbfe] flex items-center justify-center text-[14px] font-bold text-[#2563eb]">
            יל
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-[#1e293b]">יוסי לוי</div>
            <div className="text-[11px] text-[#64748b]">מנהל עמותה</div>
          </div>
          <button className="p-2 rounded-lg hover:bg-[#f4f6fb] text-[#64748b] hover:text-[#dc2626] transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
