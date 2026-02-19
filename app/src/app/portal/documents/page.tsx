"use client";
import Topbar from "@/components/Topbar";
import { FileText, FolderOpen, Download } from "lucide-react";

const documents = [
  { name: "תקנון מעודכן 2025", type: "PDF", date: "01.01.2025" },
  { name: "אישור ניהול תקין – חודשי", type: "PDF", date: "15.01.2026" },
  { name: "דוח כספי Q4 2025", type: "PDF", date: "10.01.2026" },
  { name: "פרוטוקול ישיבת ועד – ינואר", type: "PDF", date: "20.01.2026" },
];

export default function PortalDocumentsPage() {
  return (
    <div className="px-8 pb-8">
      <Topbar title="המסמכים שלי" subtitle="ספריית מסמכים – תקנון, אישורים, פרוטוקולים" />

      <div className="max-w-[800px]">
        <div className="anim-fade-up delay-2 bg-white rounded-2xl border border-[#e8ecf4] overflow-hidden hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="p-5 border-b border-[#e8ecf4] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <FolderOpen size={16} className="text-[#2563eb]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#1e293b]">מסמכים אחרונים</h3>
          </div>
          <div className="divide-y divide-[#e8ecf4]">
            {documents.map((doc, i) => (
              <div
                key={i}
                className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-5 hover:bg-[#f8f9fc] transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                    <FileText size={18} className="text-[#2563eb]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1e293b]">{doc.name}</div>
                    <div className="text-[11px] text-[#64748b]">{doc.type} · {doc.date}</div>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-[#eff6ff] text-[#2563eb] transition-all">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
