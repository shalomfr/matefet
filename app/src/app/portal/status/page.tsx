"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Shield, ArrowLeft, AlertCircle } from "lucide-react";

type ComplianceItem = {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
};

type ComplianceCertificate = {
  id: string;
  name: string;
  issuedBy?: string;
  issuedAt?: string;
  expiresAt?: string;
  status: string;
};

type ComplianceData = {
  items: ComplianceItem[];
  certificates: ComplianceCertificate[];
};

export default function PortalStatusPage() {
  const [data, setData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/compliance")
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="האם אני בסדר?" subtitle="מצב הציות והמסמכים הנדרשים לארגונך" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const items = data?.items ?? [];
  const certificates = data?.certificates ?? [];

  // Find warning/expired items
  const warningItems = items.filter(i => i.status === "WARNING" || i.status === "EXPIRED" || i.status === "MISSING");
  const closestWarning = warningItems.length > 0 ? warningItems[0] : null;

  const getDaysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "OK": return "תקין";
      case "WARNING": return "דורש תשומת לב";
      case "EXPIRED": return "פג תוקף";
      case "MISSING": return "חסר";
      default: return status;
    }
  };

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="האם אני בסדר?" subtitle="מצב הציות והמסמכים הנדרשים לארגונך" />

      <div className="max-w-[800px]">
        {/* Warning banner */}
        {closestWarning && (
          <div className="anim-fade-down bg-white rounded-2xl border border-[#fde68a] p-5 mb-6 flex items-center gap-3" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <div className="w-10 h-10 rounded-xl bg-[#fffbeb] flex items-center justify-center">
              <AlertTriangle size={20} className="text-[#d97706]" />
            </div>
            <div className="flex-1">
              <h2 className="text-[15px] font-bold text-[#1e293b]">
                {warningItems.length === 1 ? "יש פריט שדורש תשומת לב" : `יש ${warningItems.length} פריטים שדורשים תשומת לב`}
              </h2>
              <p className="text-[13px] text-[#64748b]">
                {closestWarning.name}
                {closestWarning.dueDate ? ` – ${getDaysUntil(closestWarning.dueDate)} ימים נותרים` : ""}
              </p>
            </div>
            <Link href="/portal" className="text-[12px] font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
              טפל עכשיו <ArrowLeft size={12} />
            </Link>
          </div>
        )}

        {/* No warnings banner */}
        {warningItems.length === 0 && items.length > 0 && (
          <div className="anim-fade-down bg-white rounded-2xl border border-[#bbf7d0] p-5 mb-6 flex items-center gap-3" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
              <CheckCircle2 size={20} className="text-[#16a34a]" />
            </div>
            <div className="flex-1">
              <h2 className="text-[15px] font-bold text-[#1e293b]">הכל בסדר!</h2>
              <p className="text-[13px] text-[#64748b]">כל הפריטים תקינים</p>
            </div>
          </div>
        )}

        {/* Compliance list */}
        <div className="anim-fade-up delay-2 bg-white rounded-2xl border border-[#e8ecf4] overflow-hidden hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="p-5 border-b border-[#e8ecf4] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Shield size={16} className="text-[#2563eb]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#1e293b]">מסמכים ואישורים</h3>
          </div>
          <div className="divide-y divide-[#e8ecf4]">
            {items.length === 0 ? (
              <div className="text-center py-8 text-[13px] text-[#64748b]">אין נתונים</div>
            ) : (
              items.map((item, i) => {
                const days = getDaysUntil(item.dueDate);
                return (
                  <div
                    key={item.id}
                    className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-5 hover:bg-[#f8f9fc] transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      {item.status === "OK" ? (
                        <CheckCircle2 size={20} className="text-[#16a34a]" />
                      ) : item.status === "EXPIRED" || item.status === "MISSING" ? (
                        <AlertCircle size={20} className="text-[#ef4444]" />
                      ) : (
                        <AlertTriangle size={20} className="text-[#d97706]" />
                      )}
                      <div>
                        <div className="text-[13px] font-semibold text-[#1e293b]">{item.name}</div>
                        <div className="text-[12px] text-[#64748b]">{item.description ?? getStatusLabel(item.status)}</div>
                      </div>
                    </div>
                    {days !== null && item.status !== "OK" && (
                      <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border ${
                        item.status === "EXPIRED" || item.status === "MISSING"
                          ? "text-[#ef4444] bg-[#fef2f2] border-[#fecaca]"
                          : "text-[#d97706] bg-[#fffbeb] border-[#fde68a]"
                      }`}>
                        {days} ימים
                      </span>
                    )}
                    {item.status === "OK" && (
                      <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
                        תקין
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Certificates section */}
        {certificates.length > 0 && (
          <div className="anim-fade-up delay-4 bg-white rounded-2xl border border-[#e8ecf4] overflow-hidden hover-lift mt-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <div className="p-5 border-b border-[#e8ecf4] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
                <CheckCircle2 size={16} className="text-[#16a34a]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b]">תעודות ואישורים</h3>
            </div>
            <div className="divide-y divide-[#e8ecf4]">
              {certificates.map((cert, i) => {
                const days = getDaysUntil(cert.expiresAt);
                return (
                  <div
                    key={cert.id}
                    className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-5 hover:bg-[#f8f9fc] transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      {cert.status === "OK" ? (
                        <CheckCircle2 size={20} className="text-[#16a34a]" />
                      ) : (
                        <AlertTriangle size={20} className="text-[#d97706]" />
                      )}
                      <div>
                        <div className="text-[13px] font-semibold text-[#1e293b]">{cert.name}</div>
                        <div className="text-[12px] text-[#64748b]">
                          {cert.issuedBy ? `מונפק ע״י ${cert.issuedBy}` : ""}
                          {cert.expiresAt ? ` · תוקף עד ${new Date(cert.expiresAt).toLocaleDateString("he-IL")}` : ""}
                        </div>
                      </div>
                    </div>
                    {days !== null && cert.status !== "OK" && (
                      <span className="text-[11px] font-semibold text-[#ef4444] bg-[#fef2f2] px-3 py-1.5 rounded-lg border border-[#fecaca]">
                        {days} ימים
                      </span>
                    )}
                    {cert.status === "OK" && (
                      <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
                        תקין
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
