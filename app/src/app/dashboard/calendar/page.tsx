"use client";
import Topbar from "@/components/Topbar";
import { CalendarDays } from "lucide-react";

export default function CalendarPage() {
  return (
    <>
      <Topbar title="לוח שנה רגולטורי" />
      <div className="glass-card p-8 text-center">
        <CalendarDays size={48} className="mx-auto text-[#7c5cfc] mb-4" />
        <h2 className="text-xl font-bold text-[#1e1b3a] mb-2">לוח שנה רגולטורי</h2>
        <p className="text-sm text-[#6b6894]">ניהול לוח זמנים ודדליינים רגולטוריים</p>
      </div>
    </>
  );
}
