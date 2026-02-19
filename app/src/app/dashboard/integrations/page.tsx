"use client";
import Topbar from "@/components/Topbar";
import { Link2, CheckCircle2, XCircle, Settings, ExternalLink, RefreshCw } from "lucide-react";

const integrations = [
  {
    name: "חשבונית ירוקה",
    description: "הפקת חשבוניות וקבלות אוטומטית",
    icon: "🧾",
    status: "connected",
    lastSync: "לפני 5 דקות",
    category: "חשבונאות",
  },
  {
    name: "iCount",
    description: "מערכת הנהלת חשבונות",
    icon: "📊",
    status: "disconnected",
    lastSync: "—",
    category: "חשבונאות",
  },
  {
    name: "Tranzila",
    description: "סליקת אשראי ותשלומי תורמים",
    icon: "💳",
    status: "connected",
    lastSync: "לפני 12 דקות",
    category: "תשלומים",
  },
  {
    name: "CardCom",
    description: "סליקת כרטיסי אשראי",
    icon: "💳",
    status: "disconnected",
    lastSync: "—",
    category: "תשלומים",
  },
  {
    name: "WhatsApp Business",
    description: "הודעות אוטומטיות לתורמים ומתנדבים",
    icon: "📱",
    status: "connected",
    lastSync: "לפני שעה",
    category: "תקשורת",
  },
  {
    name: "Google Workspace",
    description: "Gmail, Calendar, Drive - סנכרון מלא",
    icon: "📧",
    status: "connected",
    lastSync: "לפני 3 דקות",
    category: "תקשורת",
  },
  {
    name: "רשם העמותות",
    description: "הגשת דוחות ובדיקת סטטוס אוטומטית",
    icon: "🏛️",
    status: "connected",
    lastSync: "לפני יום",
    category: "רגולציה",
  },
  {
    name: "מס הכנסה",
    description: "דיווחים ואישורי מס",
    icon: "🏦",
    status: "connected",
    lastSync: "לפני שבוע",
    category: "רגולציה",
  },
  {
    name: "SMS (019)",
    description: "שליחת הודעות SMS לתורמים",
    icon: "📲",
    status: "connected",
    lastSync: "לפני 2 שעות",
    category: "תקשורת",
  },
  {
    name: "בנק הפועלים",
    description: "ייבוא תנועות בנק אוטומטי",
    icon: "🏦",
    status: "disconnected",
    lastSync: "—",
    category: "בנקאות",
  },
];

const categories = [...new Set(integrations.map((i) => i.category))];

export default function IntegrationsPage() {
  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  return (
    <>
      <Topbar title="אינטגרציות" />

      {/* Stats Banner */}
      <div className="glass-card p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#7c5cfc]/10 flex items-center justify-center">
            <Link2 size={22} className="text-[#7c5cfc]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#1e1b3a]">
              {connectedCount} מתוך {integrations.length} מחוברים
            </div>
            <div className="text-sm text-[#9b98b8]">חבר שירותים נוספים לאוטומציה מלאה</div>
          </div>
        </div>
        <div className="h-3 flex-1 max-w-xs mx-8 bg-white/40 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#7c5cfc]"
            style={{ width: `${(connectedCount / integrations.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Integrations by Category */}
      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h3 className="text-sm font-bold text-[#6b6894] mb-3 mr-1">{cat}</h3>
          <div className="grid grid-cols-2 gap-4">
            {integrations
              .filter((i) => i.category === cat)
              .map((integration) => (
                <div
                  key={integration.name}
                  className={`glass-card p-5 ${
                    integration.status === "connected" ? "border-r-4 border-r-emerald-400" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{integration.icon}</div>
                      <div>
                        <div className="text-sm font-bold text-[#1e1b3a]">{integration.name}</div>
                        <div className="text-xs text-[#9b98b8]">{integration.description}</div>
                      </div>
                    </div>
                    {integration.status === "connected" ? (
                      <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={20} className="text-gray-300 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9b98b8]">
                      {integration.status === "connected"
                        ? `סנכרון אחרון: ${integration.lastSync}`
                        : "לא מחובר"}
                    </span>
                    <div className="flex gap-1">
                      {integration.status === "connected" ? (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-white/60 text-[#9b98b8]" title="סנכרן">
                            <RefreshCw size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/60 text-[#9b98b8]" title="הגדרות">
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
    </>
  );
}
