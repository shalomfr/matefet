"use client";
import Topbar from "@/components/Topbar";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function PortalContactPage() {
  const { showSuccess } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showSuccess("ההודעה נשלחה! המלווה יחזור אליך בהקדם.");
  };

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="פנה למלווה" subtitle="יש שאלה או צריך עזרה? נשמח לעזור" />

      <div className="max-w-[600px]">
        <div className="anim-fade-up delay-2 bg-white rounded-2xl p-6 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <MessageCircle size={20} className="text-[#2563eb]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1e293b]">שלח הודעה</h3>
              <p className="text-[12px] text-[#64748b]">המלווה שלך יחזור בהקדם</p>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[13px] font-medium text-[#1e293b] mb-2">נושא</label>
              <input
                type="text"
                placeholder="במה אפשר לעזור?"
                className="w-full px-4 py-3 rounded-xl border border-[#e8ecf4] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#1e293b] mb-2">הודעה</label>
              <textarea
                rows={4}
                placeholder="תאר את השאלה או הבקשה..."
                className="w-full px-4 py-3 rounded-xl border border-[#e8ecf4] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] resize-none transition-all"
              />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Send size={16} /> שלח
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
