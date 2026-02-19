"use client";
import Topbar from "@/components/Topbar";
import { MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Topbar title="פניה למלווה" />
      <div className="glass-card p-8 text-center">
        <MessageCircle size={48} className="mx-auto text-[#7c5cfc] mb-4" />
        <h2 className="text-xl font-bold text-[#1e1b3a] mb-2">פניה למלווה</h2>
        <p className="text-sm text-[#6b6894]">יצירת קשר עם המלווה הרגולטורי שלך</p>
      </div>
    </>
  );
}
