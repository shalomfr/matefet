"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { Heart, Users, Repeat, TrendingUp, Plus, Filter, Download, Mail, Phone } from "lucide-react";

const donorData = [
  { name: "דוד לוי", email: "david@email.com", phone: "050-1234567", totalDonated: "₪52,000", lastDonation: "19.02.2026", status: "פעיל", recurring: "כן" },
  { name: "שרה כהן", email: "sarah@email.com", phone: "052-9876543", totalDonated: "₪38,400", lastDonation: "18.02.2026", status: "פעיל", recurring: "כן" },
  { name: "משה אברהם", email: "moshe@email.com", phone: "054-5551234", totalDonated: "₪12,500", lastDonation: "17.02.2026", status: "פעיל", recurring: "לא" },
  { name: "רחל גולדשטיין", email: "rachel@email.com", phone: "050-7778899", totalDonated: "₪95,000", lastDonation: "16.02.2026", status: "VIP", recurring: "כן" },
  { name: "חיים ברק", email: "haim@email.com", phone: "053-1112233", totalDonated: "₪24,000", lastDonation: "15.02.2026", status: "פעיל", recurring: "כן" },
  { name: "יעל שמיר", email: "yael@email.com", phone: "058-4445566", totalDonated: "₪6,000", lastDonation: "01.02.2026", status: "לא פעיל", recurring: "לא" },
];

const campaignData = [
  { name: "קמפיין חנוכה 2025", goal: "₪100,000", raised: "₪87,500", donors: 156, status: "הסתיים" },
  { name: "בניית מרכז קהילתי", goal: "₪500,000", raised: "₪312,000", donors: 89, status: "פעיל" },
  { name: "מלגות סטודנטים 2026", goal: "₪200,000", raised: "₪45,000", donors: 23, status: "פעיל" },
];

const donorCols = [
  {
    key: "name",
    label: "שם",
    render: (_: unknown, row: Record<string, unknown>) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e879f9] to-[#a78bfa] flex items-center justify-center text-white text-xs font-bold">
          {(row.name as string).charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-[#1e1b3a]">{row.name as string}</div>
          <div className="text-xs text-[#9b98b8]">{row.email as string}</div>
        </div>
      </div>
    ),
  },
  { key: "phone", label: "טלפון" },
  { key: "totalDonated", label: "סה״כ תרם", render: (val: unknown) => <span className="font-bold text-[#7c5cfc]">{val as string}</span> },
  { key: "lastDonation", label: "תרומה אחרונה" },
  {
    key: "recurring",
    label: "הו״ק",
    render: (val: unknown) => (
      <span className={`badge ${val === "כן" ? "badge-success" : "badge-info"}`}>
        {val === "כן" ? "✓ הוראת קבע" : "חד-פעמי"}
      </span>
    ),
  },
  {
    key: "status",
    label: "סטטוס",
    render: (val: unknown) => {
      const v = val as string;
      const cls = v === "VIP" ? "badge-purple" : v === "פעיל" ? "badge-success" : "badge-warning";
      return <span className={`badge ${cls}`}>{v}</span>;
    },
  },
];

const campaignCols = [
  { key: "name", label: "שם קמפיין" },
  { key: "goal", label: "יעד" },
  {
    key: "raised",
    label: "גויס",
    render: (val: unknown, row: Record<string, unknown>) => {
      const raised = parseInt((val as string).replace(/[₪,]/g, ""));
      const goal = parseInt((row.goal as string).replace(/[₪,]/g, ""));
      const pct = Math.round((raised / goal) * 100);
      return (
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#7c5cfc]">{val as string}</span>
          <div className="w-20 h-2 bg-white/50 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#7c5cfc]" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-[#9b98b8]">{pct}%</span>
        </div>
      );
    },
  },
  { key: "donors", label: "תורמים" },
  {
    key: "status",
    label: "סטטוס",
    render: (val: unknown) => (
      <span className={`badge ${val === "פעיל" ? "badge-success" : "badge-info"}`}>{val as string}</span>
    ),
  },
];

export default function DonorsPage() {
  return (
    <>
      <Topbar title="ניהול תורמים" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Heart} label="סה״כ תורמים" value="342" change="+18" trend="up" color="#e879f9" />
        <StatCard icon={Users} label="תורמים פעילים" value="287" change="+12" trend="up" color="#7c5cfc" />
        <StatCard icon={Repeat} label="הוראות קבע" value="164" change="+8" trend="up" color="#34d399" />
        <StatCard icon={TrendingUp} label="ממוצע תרומה" value="₪1,850" change="+5.2%" trend="up" color="#60a5fa" />
      </div>

      {/* Quick Actions Banner */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-[#1e1b3a]">פעולות מהירות:</h3>
          <button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs">
            <Mail size={14} /> שלח מייל לכל התורמים
          </button>
          <button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs">
            <Download size={14} /> ייצוא רשימת תורמים
          </button>
          <button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs">
            <Phone size={14} /> ייצוא לWhatsApp
          </button>
        </div>
        <button className="btn-primary flex items-center gap-2 !py-1.5 !text-xs">
          <Plus size={14} /> תורם חדש
        </button>
      </div>

      {/* Donors Table */}
      <div className="mb-6">
        <DataTable
          columns={donorCols}
          data={donorData}
          title="רשימת תורמים"
          action={
            <button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs">
              <Filter size={14} /> סינון
            </button>
          }
        />
      </div>

      {/* Campaigns */}
      <DataTable
        columns={campaignCols}
        data={campaignData}
        title="קמפיינים"
        action={
          <button className="btn-primary flex items-center gap-2 !py-1.5 !text-xs">
            <Plus size={14} /> קמפיין חדש
          </button>
        }
      />

      {/* Donor Distribution */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="glass-card p-5">
          <h4 className="text-sm font-bold text-[#1e1b3a] mb-4">לפי סכום תרומה</h4>
          {[
            { range: "מעל ₪50,000", count: 8, pct: 45 },
            { range: "₪10,000 - ₪50,000", count: 34, pct: 30 },
            { range: "₪1,000 - ₪10,000", count: 156, pct: 18 },
            { range: "מתחת ל-₪1,000", count: 144, pct: 7 },
          ].map((item) => (
            <div key={item.range} className="flex items-center justify-between py-2">
              <span className="text-sm text-[#6b6894]">{item.range}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9b98b8]">{item.count} תורמים</span>
                <span className="badge badge-purple">{item.pct}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-5">
          <h4 className="text-sm font-bold text-[#1e1b3a] mb-4">תורמים מובילים</h4>
          {donorData.slice(0, 5).sort((a, b) => parseInt(b.totalDonated.replace(/[₪,]/g, "")) - parseInt(a.totalDonated.replace(/[₪,]/g, ""))).map((d, i) => (
            <div key={d.name} className="flex items-center gap-3 py-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#a78bfa] text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
              <span className="flex-1 text-sm text-[#6b6894]">{d.name}</span>
              <span className="text-sm font-bold text-[#7c5cfc]">{d.totalDonated}</span>
            </div>
          ))}
        </div>

        <div className="glass-card p-5">
          <h4 className="text-sm font-bold text-[#1e1b3a] mb-4">תרומות לפי חודש</h4>
          <div className="space-y-2">
            {[
              { month: "פברואר 2026", amount: "₪127,450" },
              { month: "ינואר 2026", amount: "₪98,200" },
              { month: "דצמבר 2025", amount: "₪215,000" },
              { month: "נובמבר 2025", amount: "₪78,500" },
              { month: "אוקטובר 2025", amount: "₪92,300" },
            ].map((item) => (
              <div key={item.month} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-[#6b6894]">{item.month}</span>
                <span className="text-sm font-semibold text-[#1e1b3a]">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
