"use client";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Shield, ArrowLeft } from "lucide-react";

const complianceItems = [
  { title: "אישור ניהול תקין", status: "warning", days: 14, desc: "פג בעוד 14 יום – חידוש נדרש" },
  { title: "תקנון מעודכן", status: "ok", desc: "תוקף" },
  { title: "דוח שנתי לרשם", status: "ok", desc: "הוגש" },
  { title: "דוח כספי רבעוני", status: "ok", desc: "הוגש" },
];

export default function PortalStatusPage() {
  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="האם אני בסדר?" subtitle="מצב הציות והמסמכים הנדרשים לארגונך" />

      <div className="max-w-[800px]">
        {/* Warning banner */}
        <div className="anim-fade-down bg-white rounded-2xl border border-[#fde68a] p-5 mb-6 flex items-center gap-3" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="w-10 h-10 rounded-xl bg-[#fffbeb] flex items-center justify-center">
            <AlertTriangle size={20} className="text-[#d97706]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-bold text-[#1e293b]">יש פריט שדורש תשומת לב</h2>
            <p className="text-[13px] text-[#64748b]">אישור ניהול תקין – 14 יום נותרים</p>
          </div>
          <Link href="/portal" className="text-[12px] font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
            טפל עכשיו <ArrowLeft size={12} />
          </Link>
        </div>

        {/* Compliance list */}
        <div className="anim-fade-up delay-2 bg-white rounded-2xl border border-[#e8ecf4] overflow-hidden hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="p-5 border-b border-[#e8ecf4] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Shield size={16} className="text-[#2563eb]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#1e293b]">מסמכים ואישורים</h3>
          </div>
          <div className="divide-y divide-[#e8ecf4]">
            {complianceItems.map((item, i) => (
              <div
                key={i}
                className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-5 hover:bg-[#f8f9fc] transition-colors`}
              >
                <div className="flex items-center gap-3">
                  {item.status === "ok" ? (
                    <CheckCircle2 size={20} className="text-[#16a34a]" />
                  ) : (
                    <AlertTriangle size={20} className="text-[#d97706]" />
                  )}
                  <div>
                    <div className="text-[13px] font-semibold text-[#1e293b]">{item.title}</div>
                    <div className="text-[12px] text-[#64748b]">{item.desc}</div>
                  </div>
                </div>
                {item.days && (
                  <span className="text-[11px] font-semibold text-[#ef4444] bg-[#fef2f2] px-3 py-1.5 rounded-lg border border-[#fecaca]">
                    {item.days} ימים
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
