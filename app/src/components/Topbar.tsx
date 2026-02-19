"use client";
import { Search, Bell, User } from "lucide-react";

function getHebrewDate() {
  const now = new Date();
  const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const dayOfWeek = dayNames[now.getDay()];
  const formatted = now.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
  return { dayOfWeek, formatted };
}

export default function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { dayOfWeek, formatted } = getHebrewDate();

  return (
    <header className="flex items-start justify-between mb-8">
      <div>
        <h2 className="text-[28px] font-bold text-[#1e293b] leading-tight">{title}</h2>
        {subtitle && <p className="text-[13px] text-[#64748b] mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-left text-[12px] text-[#64748b] leading-relaxed ml-3">
          <div className="text-[13px] text-[#1e293b]">יום {dayOfWeek}</div>
          <div>{formatted}</div>
        </div>

        <div className="bg-white border border-[#e8ecf4] rounded-xl flex items-center gap-2 px-3 py-2 w-48 shadow-sm">
          <Search size={14} className="text-[#64748b]" />
          <input
            type="text"
            placeholder="חיפוש..."
            className="bg-transparent border-none outline-none text-[13px] text-[#1e293b] placeholder-[#94a3b8] w-full"
          />
        </div>

        <button className="w-9 h-9 rounded-xl bg-white border border-[#e8ecf4] flex items-center justify-center relative hover:border-[#7c3aed]/40 transition-colors shadow-sm">
          <Bell size={16} className="text-[#64748b]" />
          <span className="absolute -top-1 -left-1 w-4 h-4 bg-[#ef4444] rounded-full text-[9px] text-white flex items-center justify-center font-bold">
            2
          </span>
        </button>

        <div className="w-9 h-9 rounded-xl bg-white border border-[#e8ecf4] flex items-center justify-center shadow-sm overflow-hidden">
          <User size={16} className="text-[#64748b]" />
        </div>
      </div>
    </header>
  );
}
