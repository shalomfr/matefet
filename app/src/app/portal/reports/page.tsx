"use client";
import Topbar from "@/components/Topbar";
import { BarChart2, FileText } from "lucide-react";
import { useToast } from "@/components/Toast";

const reports = [
  { name: "דוח כספי רבעוני Q4 2025", period: "אוקטובר–דצמבר 2025", status: "הוגש" },
  { name: "דוח שנתי 2024", period: "שנת 2024", status: "הוגש" },
  { name: "תקציב 2026", period: "שנת 2026", status: "בטיוטה" },
];

export default function PortalReportsPage() {
  const { showSuccess } = useToast();

  return (
    <div className="px-8 pb-8">
      <Topbar title="דוחות ותקציב" subtitle="דוחות כספיים, שנתיים ותקציבים" />

      <div className="max-w-[800px]">
        <div className="anim-fade-up delay-2 bg-white rounded-2xl border border-[#e8ecf4] overflow-hidden hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="p-5 border-b border-[#e8ecf4] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <BarChart2 size={16} className="text-[#2563eb]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#1e293b]">דוחות</h3>
          </div>
          <div className="divide-y divide-[#e8ecf4]">
            {reports.map((r, i) => (
              <div
                key={i}
                className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-5 hover:bg-[#f8f9fc] transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                    <FileText size={18} className="text-[#2563eb]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1e293b]">{r.name}</div>
                    <div className="text-[11px] text-[#64748b]">{r.period}</div>
                  </div>
                </div>
                {r.status === "בטיוטה" ? (
                  <button
                    type="button"
                    onClick={() => showSuccess("כל הכבוד, הגשת את הדוח בזמן!")}
                    className="text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] px-3 py-1.5 rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] transition-all"
                  >
                    הגש
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
                    {r.status}
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
