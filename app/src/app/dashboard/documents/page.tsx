"use client";
import Topbar from "@/components/Topbar";
import { FolderOpen } from "lucide-react";

export default function DocumentsPage() {
  return (
    <>
      <Topbar title="ספריית מסמכים" />
      <div className="glass-card p-8 text-center">
        <FolderOpen size={48} className="mx-auto text-[#7c5cfc] mb-4" />
        <h2 className="text-xl font-bold text-[#1e1b3a] mb-2">ספריית מסמכים</h2>
        <p className="text-sm text-[#6b6894]">ניהול וארגון מסמכים רגולטוריים</p>
      </div>
    </>
  );
}
