"use client";
import Link from "next/link";
import { ChevronLeft, BarChart2, FileText } from "lucide-react";
import { useToast } from "@/components/Toast";

const reports = [
  { name: "דוח כספי רבעוני Q4 2025", period: "אוקטובר–דצמבר 2025", status: "הוגש" },
  { name: "דוח שנתי 2024", period: "שנת 2024", status: "הוגש" },
  { name: "תקציב 2026", period: "שנת 2026", status: "בטיוטה" },
];

export default function PortalReportsPage() {
  const { showSuccess } = useToast();

  return (
    <div className="max-w-[800px] mx-auto px-8 py-8">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1 text-[13px] text-[#64748b] hover:text-[#2563eb] mb-6"
      >
        <ChevronLeft size={14} /> חזרה לראשי
      </Link>

      <h1 className="text-2xl font-bold text-[#1e293b] mb-2 font-[Frank_Ruhl_Libre,serif]">
        דוחות ותקציב
      </h1>
      <p className="text-[14px] text-[#64748b] mb-8">
        דוחות כספיים, שנתיים ותקציבים
      </p>

      <div className="portal-card overflow-hidden rounded-[16px]">
        <div className="p-5 border-b border-[#e2e8f2] flex items-center gap-2">
          <BarChart2 size={20} className="text-[#2563eb]" />
          <h3 className="text-base font-bold text-[#1e293b]">דוחות</h3>
        </div>
        <div className="divide-y divide-[#e2e8f2]">
          {reports.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-5 hover:bg-[#f4f6fb] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center">
                  <FileText size={18} className="text-[#2563eb]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1e293b]">{r.name}</div>
                  <div className="text-[12px] text-[#64748b]">{r.period}</div>
                </div>
              </div>
              {r.status === "בטיוטה" ? (
                <button
                  type="button"
                  onClick={() => showSuccess("כל הכבוד, הגשת את הדוח בזמן!")}
                  className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe]"
                >
                  הגש
                </button>
              ) : (
                <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#f0fdf4] text-[#16a34a]">
                  {r.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
