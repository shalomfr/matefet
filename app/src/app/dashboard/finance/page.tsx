"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import {
  Wallet,
  Receipt,
  ArrowLeftRight,
  PiggyBank,
  FileText,
  Download,
  Plus,
  Filter,
} from "lucide-react";

const invoiceData = [
  { number: "INV-1042", client: "חברת השקעות צפון", amount: "₪15,000", date: "18.02.2026", status: "שולם" },
  { number: "INV-1041", client: "קרן משפחת כהן", amount: "₪8,500", date: "15.02.2026", status: "שולם" },
  { number: "INV-1040", client: "עיריית חיפה - מענק", amount: "₪45,000", date: "12.02.2026", status: "ממתין" },
  { number: "INV-1039", client: "תרומת שמעון פרץ", amount: "₪2,000", date: "10.02.2026", status: "שולם" },
  { number: "INV-1038", client: "מפעל הפיס - מענק", amount: "₪30,000", date: "08.02.2026", status: "בעיבוד" },
];

const receiptData = [
  { number: "RCP-2156", donor: "דוד לוי", amount: "₪5,000", type: "סעיף 46", date: "19.02.2026" },
  { number: "RCP-2155", donor: "שרה כהן", amount: "₪1,200", type: "סעיף 46", date: "18.02.2026" },
  { number: "RCP-2154", donor: "משה אברהם", amount: "₪500", type: "רגילה", date: "17.02.2026" },
  { number: "RCP-2153", donor: "רחל גולדשטיין", amount: "₪10,000", type: "סעיף 46", date: "16.02.2026" },
  { number: "RCP-2152", donor: "חיים ברק", amount: "₪3,000", type: "סעיף 46", date: "15.02.2026" },
];

const transferData = [
  { ref: "TRF-890", from: "חשבון ראשי", to: "ספק - הדפסות", amount: "₪2,400", date: "19.02.2026", status: "בוצע" },
  { ref: "TRF-889", from: "חשבון ראשי", to: "שכ\"ד משרד", amount: "₪6,500", date: "18.02.2026", status: "בוצע" },
  { ref: "TRF-888", from: "חשבון מענקים", to: "חשבון ראשי", amount: "₪45,000", date: "15.02.2026", status: "ממתין" },
  { ref: "TRF-887", from: "חשבון ראשי", to: "משכורות", amount: "₪32,000", date: "01.02.2026", status: "בוצע" },
];

const invoiceCols = [
  { key: "number", label: "מספר" },
  { key: "client", label: "לקוח / גורם" },
  { key: "amount", label: "סכום" },
  { key: "date", label: "תאריך" },
  {
    key: "status",
    label: "סטטוס",
    render: (val: unknown) => {
      const v = val as string;
      const cls = v === "שולם" ? "badge-success" : v === "ממתין" ? "badge-warning" : "badge-info";
      return <span className={`badge ${cls}`}>{v}</span>;
    },
  },
];

const receiptCols = [
  { key: "number", label: "מספר" },
  { key: "donor", label: "תורם" },
  { key: "amount", label: "סכום" },
  { key: "type", label: "סוג", render: (val: unknown) => <span className="badge badge-purple">{val as string}</span> },
  { key: "date", label: "תאריך" },
];

const transferCols = [
  { key: "ref", label: "מספר" },
  { key: "from", label: "מחשבון" },
  { key: "to", label: "לחשבון / מוטב" },
  { key: "amount", label: "סכום" },
  { key: "date", label: "תאריך" },
  {
    key: "status",
    label: "סטטוס",
    render: (val: unknown) => {
      const v = val as string;
      return <span className={`badge ${v === "בוצע" ? "badge-success" : "badge-warning"}`}>{v}</span>;
    },
  },
];

export default function FinancePage() {
  return (
    <>
      <Topbar title="ניהול כספי" />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Wallet} label="יתרה בבנק" value="₪284,750" change="+₪42K" trend="up" color="#7c5cfc" />
        <StatCard icon={Receipt} label="קבלות החודש" value="47" change="+12" trend="up" color="#e879f9" />
        <StatCard icon={ArrowLeftRight} label="העברות ממתינות" value="3" color="#fbbf24" />
        <StatCard icon={PiggyBank} label="ניצול תקציב" value="72%" change="מתוך ₪500K" trend="up" color="#34d399" />
      </div>

      {/* Tabs simulation */}
      <div className="glass-card mb-6">
        <div className="flex gap-1 p-2">
          {["חשבוניות", "קבלות", "העברות", "תקציב"].map((tab, i) => (
            <button
              key={tab}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                i === 0
                  ? "bg-gradient-to-l from-[#7c5cfc]/15 to-[#a78bfa]/10 text-[#7c5cfc] shadow-sm"
                  : "text-[#6b6894] hover:bg-white/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="mb-6">
        <DataTable
          columns={invoiceCols}
          data={invoiceData}
          title="חשבוניות אחרונות"
          action={
            <div className="flex gap-2">
              <button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs">
                <Filter size={14} />
                סינון
              </button>
              <button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs">
                <Download size={14} />
                ייצוא
              </button>
              <button className="btn-primary flex items-center gap-2 !py-1.5 !text-xs">
                <Plus size={14} />
                חשבונית חדשה
              </button>
            </div>
          }
        />
      </div>

      {/* Receipts Table */}
      <div className="mb-6">
        <DataTable
          columns={receiptCols}
          data={receiptData}
          title="קבלות אחרונות"
          action={
            <button className="btn-primary flex items-center gap-2 !py-1.5 !text-xs">
              <Plus size={14} />
              קבלה חדשה
            </button>
          }
        />
      </div>

      {/* Transfers Table */}
      <DataTable
        columns={transferCols}
        data={transferData}
        title="העברות בנקאיות"
        action={
          <button className="btn-primary flex items-center gap-2 !py-1.5 !text-xs">
            <Plus size={14} />
            העברה חדשה
          </button>
        }
      />

      {/* Budget Overview */}
      <div className="glass-card p-5 mt-6">
        <h3 className="text-base font-bold text-[#1e1b3a] mb-4">תקציב שנתי 2026</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[#6b6894]">הכנסות</h4>
            {[
              { label: "תרומות", planned: "₪350,000", actual: "₪127,450", pct: 36 },
              { label: "מענקים", planned: "₪120,000", actual: "₪75,000", pct: 63 },
              { label: "אירועים", planned: "₪30,000", actual: "₪0", pct: 0 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#6b6894]">{item.label}</span>
                  <span className="text-[#1e1b3a] font-semibold">{item.actual} / {item.planned}</span>
                </div>
                <div className="h-2.5 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#7c5cfc]" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[#6b6894]">הוצאות</h4>
            {[
              { label: "שכר עובדים", planned: "₪200,000", actual: "₪64,000", pct: 32 },
              { label: "שכירות ומשרד", planned: "₪78,000", actual: "₪19,500", pct: 25 },
              { label: "פעילויות", planned: "₪100,000", actual: "₪18,200", pct: 18 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#6b6894]">{item.label}</span>
                  <span className="text-[#1e1b3a] font-semibold">{item.actual} / {item.planned}</span>
                </div>
                <div className="h-2.5 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#e879f9]" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
