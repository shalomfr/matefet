"use client";
import { Search, Bell, MessageSquare, Plus } from "lucide-react";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-[#1e1b3a]">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="glass flex items-center gap-2 px-4 py-2 w-64">
          <Search size={16} className="text-[#9b98b8]" />
          <input
            type="text"
            placeholder="חיפוש..."
            className="bg-transparent border-none outline-none text-sm text-[#1e1b3a] placeholder-[#9b98b8] w-full"
          />
        </div>

        {/* Notifications */}
        <button className="glass w-10 h-10 flex items-center justify-center relative hover:bg-white/70 transition-colors">
          <Bell size={18} className="text-[#6b6894]" />
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-[#7c5cfc] rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            4
          </span>
        </button>

        {/* Messages */}
        <button className="glass w-10 h-10 flex items-center justify-center relative hover:bg-white/70 transition-colors">
          <MessageSquare size={18} className="text-[#6b6894]" />
        </button>

        {/* Quick Action */}
        <button className="btn-primary flex items-center gap-2 !rounded-xl !px-4">
          <Plus size={16} />
          <span>חדש</span>
        </button>
      </div>
    </header>
  );
}
