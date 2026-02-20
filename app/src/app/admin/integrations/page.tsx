"use client";
import Topbar from "@/components/Topbar";
import { Link2, CheckCircle2, XCircle, Settings, ExternalLink, RefreshCw } from "lucide-react";

const integrations = [
  { name: "חשבונית ירוקה", description: "הפקת חשבוניות וקבלות אוטומטית", icon: "🧾", status: "connected", lastSync: "לפני 5 דקות", category: "חשבונאות" },
  { name: "iCount", description: "מערכת הנהלת חשבונות", icon: "📊", status: "disconnected", lastSync: "—", category: "חשבונאות" },
  { name: "Tranzila", description: "סליקת אשראי ותשלומי תורמים", icon: "💳", status: "connected", lastSync: "לפני 12 דקות", category: "תשלומים" },
  { name: "CardCom", description: "סליקת כרטיסי אשראי", icon: "💳", status: "disconnected", lastSync: "—", category: "תשלומים" },
  { name: "WhatsApp Business", description: "הודעות אוטומטיות לתורמים ומתנדבים", icon: "📱", status: "connected", lastSync: "לפני שעה", category: "תקשורת" },
  { name: "Google Workspace", description: "Gmail, Calendar, Drive - סנכרון מלא", icon: "📧", status: "connected", lastSync: "לפני 3 דקות", category: "תקשורת" },
  { name: "רשם העמותות", description: "הגשת דוחות ובדיקת סטטוס אוטומטית", icon: "🏛️", status: "connected", lastSync: "לפני יום", category: "רגולציה" },
  { name: "מס הכנסה", description: "דיווחים ואישורי מס", icon: "🏦", status: "connected", lastSync: "לפני שבוע", category: "רגולציה" },
  { name: "SMS (019)", description: "שליחת הודעות SMS לתורמים", icon: "📲", status: "connected", lastSync: "לפני 2 שעות", category: "תקשורת" },
  { name: "בנק הפועלים", description: "ייבוא תנועות בנק אוטומטי", icon: "🏦", status: "disconnected", lastSync: "—", category: "בנקאות" },
];

const categories = [...new Set(integrations.map((i) => i.category))];

export default function AdminIntegrationsPage() {
  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="אינטגרציות" subtitle="ניהול חיבורי שירותים חיצוניים" />

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-5 mb-6 flex items-center justify-between" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center">
            <Link2 size={22} className="text-[#2563eb]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#1e293b]">
              {connectedCount} מתוך {integrations.length} מחוברים
            </div>
            <div className="text-sm text-[#64748b]">חבר שירותים נוספים לאוטומציה מלאה</div>
          </div>
        </div>
        <div className="h-3 flex-1 max-w-xs mx-8 bg-[#f8f9fc] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2563eb]"
            style={{ width: `${(connectedCount / integrations.length) * 100}%` }}
          />
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h3 className="text-sm font-bold text-[#64748b] mb-3 mr-1">{cat}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations
              .filter((i) => i.category === cat)
              .map((integration) => (
                <div
                  key={integration.name}
                  className={`bg-white rounded-2xl border border-[#e8ecf4] p-5 ${
                    integration.status === "connected" ? "border-r-4 border-r-[#2ecc8f]" : ""
                  }`}
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{integration.icon}</div>
                      <div>
                        <div className="text-sm font-bold text-[#1e293b]">{integration.name}</div>
                        <div className="text-xs text-[#64748b]">{integration.description}</div>
                      </div>
                    </div>
                    {integration.status === "connected" ? (
                      <CheckCircle2 size={20} className="text-[#2ecc8f] flex-shrink-0" />
                    ) : (
                      <XCircle size={20} className="text-[#64748b] flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-[#64748b]">
                        {integration.status === "connected"
                          ? `סנכרון אחרון: ${integration.lastSync}`
                          : "לא מחובר"}
                      </span>
                      <span className="text-[11px] font-medium text-[#d97706] mt-1">חיבור בקרוב</span>
                    </div>
                    <div className="flex gap-1">
                      {integration.status === "connected" ? (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b]" title="סנכרן">
                            <RefreshCw size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b]" title="הגדרות">
                            <Settings size={14} />
                          </button>
                        </>
                      ) : (
                        <button className="btn-primary !py-1 !px-3 !text-xs flex items-center gap-1">
                          <ExternalLink size={12} /> חבר
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
