"use client";
import Topbar from "@/components/Topbar";
import { Pin } from "lucide-react";

export default function ProjectsPage() {
  return (
    <>
      <Topbar title="פרויקטים פעילים" />
      <div className="glass-card p-8 text-center">
        <Pin size={48} className="mx-auto text-[#7c5cfc] mb-4" />
        <h2 className="text-xl font-bold text-[#1e1b3a] mb-2">פרויקטים פעילים</h2>
        <p className="text-sm text-[#6b6894]">מעקב וניהול פרויקטים רגולטוריים פעילים</p>
      </div>
    </>
  );
}
