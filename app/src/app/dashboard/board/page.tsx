"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { Users, Calendar, FileText, CheckSquare, Plus, Vote } from "lucide-react";

const meetings = [
  { id: "#19", date: "22.03.2026", time: "18:00", topic: "אישור תקציב Q2", status: "מתוכנן", attendees: 7 },
  { id: "#18", date: "15.02.2026", time: "18:00", topic: "דוח שנתי 2025 + אישור מבקר", status: "הסתיים", attendees: 8 },
  { id: "#17", date: "18.01.2026", time: "18:00", topic: "תכנון פעילות שנתית 2026", status: "הסתיים", attendees: 7 },
  { id: "#16", date: "20.12.2025", time: "18:00", topic: "אסיפה כללית + בחירת ועד", status: "הסתיים", attendees: 12 },
];

const boardMembers = [
  { name: "שלום כהן", role: "יו\"ר", meetings: "18/18" },
  { name: "מרים לוי", role: "גזברית", meetings: "17/18" },
  { name: "אברהם יצחקי", role: "מזכיר", meetings: "16/18" },
  { name: "נעמי ברק", role: "חברת ועד", meetings: "15/18" },
  { name: "יוסי פרידמן", role: "חבר ועד", meetings: "18/18" },
  { name: "דינה שרון", role: "חברת ועד", meetings: "14/18" },
  { name: "אריה גולן", role: "חבר ועד", meetings: "16/18" },
];

const decisions = [
  { id: "DEC-042", meeting: "#18", decision: "אישור דוח כספי שנתי 2025", vote: "פה אחד", date: "15.02.2026", status: "אושר" },
  { id: "DEC-041", meeting: "#18", decision: "מינוי רו\"ח חיצוני לשנת 2026", vote: "7 בעד, 1 נמנע", date: "15.02.2026", status: "אושר" },
  { id: "DEC-040", meeting: "#17", decision: "תקציב פעילות שנתי", vote: "פה אחד", date: "18.01.2026", status: "אושר" },
];

const meetingCols = [
  { key: "id", label: "מספר" },
  { key: "date", label: "תאריך" },
  { key: "time", label: "שעה" },
  { key: "topic", label: "נושא" },
  { key: "attendees", label: "משתתפים" },
  {
    key: "status",
    label: "סטטוס",
    render: (val: unknown) => (
      <span className={`badge ${val === "מתוכנן" ? "badge-info" : "badge-success"}`}>{val as string}</span>
    ),
  },
];

const decisionCols = [
  { key: "id", label: "מספר" },
  { key: "meeting", label: "ישיבה" },
  { key: "decision", label: "החלטה" },
  { key: "vote", label: "הצבעה" },
  { key: "date", label: "תאריך" },
  {
    key: "status",
    label: "סטטוס",
    render: (val: unknown) => <span className="badge badge-success">{val as string}</span>,
  },
];

export default function BoardPage() {
  return (
    <>
      <Topbar title="ועד מנהל" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="חברי ועד" value="7" color="#4a7cff" />
        <StatCard icon={Calendar} label="ישיבות השנה" value="3" color="#2ecc8f" />
        <StatCard icon={CheckSquare} label="החלטות" value="42" change="+4" trend="up" color="#2ecc8f" />
        <StatCard icon={FileText} label="פרוטוקולים" value="18" color="#a78bfa" />
      </div>

      <div className="card-dark p-5 mb-6 border-r-4 border-r-[#4a7cff]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#4a7cff]/10 flex items-center justify-center">
              <Calendar size={22} className="text-[#4a7cff]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[--color-text]">ישיבה הבאה: #19</h3>
              <p className="text-[13px] text-[--color-muted]">22.03.2026 בשעה 18:00 - אישור תקציב Q2</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary !text-xs">שלח תזכורות</button>
            <button className="btn-primary !text-xs">נהל ישיבה</button>
          </div>
        </div>
      </div>

      <div className="card-dark p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[--color-text]">חברי ועד מנהל</h3>
          <button className="btn-primary flex items-center gap-2 !py-1.5 !text-xs">
            <Plus size={14} /> הוסף חבר ועד
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {boardMembers.map((member) => (
            <div key={member.name} className="p-4 rounded-lg bg-[--color-surface2] border border-[--color-border] hover:border-[#4a7cff]/30 transition-colors text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#a78bfa] flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                {member.name.charAt(0)}
              </div>
              <div className="text-[13px] font-medium text-[--color-text]">{member.name}</div>
              <div className="text-xs text-[#4a7cff] font-medium">{member.role}</div>
              <div className="text-xs text-[--color-muted] mt-1">נוכחות: {member.meetings}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <DataTable columns={meetingCols} data={meetings} title="ישיבות" action={<button className="btn-primary flex items-center gap-2 !py-1.5 !text-xs"><Plus size={14} /> ישיבה חדשה</button>} />
      </div>

      <DataTable columns={decisionCols} data={decisions} title="החלטות ועד" action={<button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs"><Vote size={14} /> הצבעה חדשה</button>} />
    </>
  );
}
