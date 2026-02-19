"use client";
import Link from "next/link";
import { ChevronLeft, FileText, FolderOpen } from "lucide-react";

const documents = [
  { name: "תקנון מעודכן 2025", type: "PDF", date: "01.01.2025" },
  { name: "אישור ניהול תקין – חודשי", type: "PDF", date: "15.01.2026" },
  { name: "דוח כספי Q4 2025", type: "PDF", date: "10.01.2026" },
  { name: "פרוטוקול ישיבת ועד – ינואר", type: "PDF", date: "20.01.2026" },
];

export default function PortalDocumentsPage() {
  return (
    <div className="max-w-[800px] mx-auto px-8 py-8">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1 text-[13px] text-[#64748b] hover:text-[#2563eb] mb-6"
      >
        <ChevronLeft size={14} /> חזרה לראשי
      </Link>

      <h1 className="text-2xl font-bold text-[#1e293b] mb-2 font-[Frank_Ruhl_Libre,serif]">
        המסמכים שלי
      </h1>
      <p className="text-[14px] text-[#64748b] mb-8">
        ספריית מסמכים – תקנון, אישורים, פרוטוקולים
      </p>

      <div className="portal-card overflow-hidden rounded-[16px]">
        <div className="p-5 border-b border-[#e2e8f2] flex items-center gap-2">
          <FolderOpen size={20} className="text-[#2563eb]" />
          <h3 className="text-base font-bold text-[#1e293b]">מסמכים אחרונים</h3>
        </div>
        <div className="divide-y divide-[#e2e8f2]">
          {documents.map((doc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-5 hover:bg-[#f4f6fb] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center">
                  <FileText size={18} className="text-[#2563eb]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1e293b]">{doc.name}</div>
                  <div className="text-[12px] text-[#64748b]">{doc.type} · {doc.date}</div>
                </div>
              </div>
              <span className="text-[12px] text-[#2563eb] font-semibold">הורד</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
