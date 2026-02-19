"use client";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ChevronLeft, FileText, Shield } from "lucide-react";

const complianceItems = [
  { title: "אישור ניהול תקין", status: "warning", days: 14, desc: "פג בעוד 14 יום – חידוש נדרש" },
  { title: "תקנון מעודכן", status: "ok", desc: "תוקף" },
  { title: "דוח שנתי לרשם", status: "ok", desc: "הוגש" },
  { title: "דוח כספי רבעוני", status: "ok", desc: "הוגש" },
];

export default function PortalStatusPage() {
  return (
    <div className="max-w-[800px] mx-auto px-8 py-8">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1 text-[13px] text-[#64748b] hover:text-[#2563eb] mb-6"
      >
        <ChevronLeft size={14} /> חזרה לראשי
      </Link>

      <h1 className="text-2xl font-bold text-[#1e293b] mb-2 font-[Frank_Ruhl_Libre,serif]">
        האם אני בסדר?
      </h1>
      <p className="text-[14px] text-[#64748b] mb-8">
        מצב הציות והמסמכים הנדרשים לארגונך
      </p>

      <div className="portal-card p-6 mb-6 bg-[#fffbeb] border-2 border-[#fde68a] rounded-[16px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#fef3c7] flex items-center justify-center">
            <AlertTriangle size={24} className="text-[#d97706]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1e293b]">יש פריט שדורש תשומת לב</h2>
            <p className="text-[14px] text-[#64748b]">אישור ניהול תקין – 14 יום נותרים</p>
          </div>
        </div>
        <Link
          href="/portal"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#2563eb] hover:underline"
        >
          טפל עכשיו <ChevronLeft size={14} />
        </Link>
      </div>

      <div className="portal-card overflow-hidden rounded-[16px]">
        <div className="p-5 border-b border-[#e2e8f2]">
          <h3 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
            <Shield size={18} /> מסמכים ואישורים
          </h3>
        </div>
        <div className="divide-y divide-[#e2e8f2]">
          {complianceItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-5 hover:bg-[#f4f6fb] transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.status === "ok" ? (
                  <CheckCircle2 size={20} className="text-[#16a34a]" />
                ) : (
                  <AlertTriangle size={20} className="text-[#d97706]" />
                )}
                <div>
                  <div className="font-semibold text-[#1e293b]">{item.title}</div>
                  <div className="text-[13px] text-[#64748b]">{item.desc}</div>
                </div>
              </div>
              {item.days && (
                <span className="badge bg-[#fef2f2] text-[#dc2626] font-semibold">
                  {item.days} ימים
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
