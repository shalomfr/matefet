"use client";
import Link from "next/link";
import { ChevronLeft, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function PortalContactPage() {
  const { showSuccess } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showSuccess("ההודעה נשלחה! המלווה יחזור אליך בהקדם.");
  };

  return (
    <div className="max-w-[600px] mx-auto px-8 py-8">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1 text-[13px] text-[#64748b] hover:text-[#2563eb] mb-6"
      >
        <ChevronLeft size={14} /> חזרה לראשי
      </Link>

      <h1 className="text-2xl font-bold text-[#1e293b] mb-2 font-[Frank_Ruhl_Libre,serif]">
        פנה למלווה
      </h1>
      <p className="text-[14px] text-[#64748b] mb-8">
        יש שאלה או צריך עזרה? נשמח לעזור
      </p>

      <div className="portal-card p-6 rounded-[16px] mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center">
            <MessageCircle size={24} className="text-[#2563eb]" />
          </div>
          <div>
            <h3 className="font-bold text-[#1e293b]">שלח הודעה</h3>
            <p className="text-[13px] text-[#64748b]">המלווה שלך יחזור בהקדם</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[13px] font-medium text-[#1e293b] mb-2">נושא</label>
            <input
              type="text"
              placeholder="במה אפשר לעזור?"
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1e293b] mb-2">הודעה</label>
            <textarea
              rows={4}
              placeholder="תאר את השאלה או הבקשה..."
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] resize-none"
            />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Send size={16} /> שלח
          </button>
        </form>
      </div>
    </div>
  );
}
