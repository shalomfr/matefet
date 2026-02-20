"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { FileText, FolderOpen, Download } from "lucide-react";

type Document = {
  id: string;
  name: string;
  category: string;
  description?: string;
  fileUrl?: string;
  mimeType?: string;
  createdAt: string;
};

const categoryLabels: Record<string, string> = {
  FOUNDING: "מסמכי ייסוד",
  FINANCIAL: "כספי",
  COMPLIANCE: "ציות",
  BOARD: "ועד",
  GENERAL: "כללי",
};

export default function PortalDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/documents")
      .then(r => r.json())
      .then(res => { if (res.success) setDocuments(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="המסמכים שלי" subtitle="ספריית מסמכים – תקנון, אישורים, פרוטוקולים" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const getFileType = (doc: Document) => {
    if (doc.mimeType) {
      if (doc.mimeType.includes("pdf")) return "PDF";
      if (doc.mimeType.includes("spreadsheet") || doc.mimeType.includes("excel")) return "XLSX";
      if (doc.mimeType.includes("word") || doc.mimeType.includes("document")) return "DOC";
      if (doc.mimeType.includes("image")) return "IMG";
    }
    // Fallback: try to guess from fileUrl extension
    if (doc.fileUrl) {
      const ext = doc.fileUrl.split(".").pop()?.toUpperCase();
      if (ext) return ext.substring(0, 4);
    }
    return "PDF";
  };

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
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
            {documents.length === 0 ? (
              <div className="text-center py-8 text-[13px] text-[#64748b]">אין מסמכים</div>
            ) : (
              documents.map((doc, i) => (
                <div
                  key={doc.id}
                  className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-5 hover:bg-[#f8f9fc] transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                      <FileText size={18} className="text-[#2563eb]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#1e293b]">{doc.name}</div>
                      <div className="text-[11px] text-[#64748b]">
                        {getFileType(doc)} · {categoryLabels[doc.category] ?? doc.category} · {new Date(doc.createdAt).toLocaleDateString("he-IL")}
                      </div>
                    </div>
                  </div>
                  {doc.fileUrl ? (
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-[#eff6ff] text-[#2563eb] transition-all">
                      <Download size={14} />
                    </a>
                  ) : (
                    <button className="p-2 rounded-lg hover:bg-[#eff6ff] text-[#2563eb] transition-all">
                      <Download size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
