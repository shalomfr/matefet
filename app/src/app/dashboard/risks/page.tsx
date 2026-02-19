"use client";
import Topbar from "@/components/Topbar";
import { Scale } from "lucide-react";

export default function RisksPage() {
  return (
    <>
      <Topbar title="ניהול סיכונים" />
      <div className="glass-card p-8 text-center">
        <Scale size={48} className="mx-auto text-[#7c5cfc] mb-4" />
        <h2 className="text-xl font-bold text-[#1e1b3a] mb-2">ניהול סיכונים</h2>
        <p className="text-sm text-[#6b6894]">זיהוי, הערכה וניהול סיכונים רגולטוריים</p>
      </div>
    </>
  );
}
