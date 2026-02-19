"use client";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { HandHelping, Clock, Award, CalendarDays, Plus, Filter, Download } from "lucide-react";

const volunteers = [
  { name: "נועה לוינשטיין", phone: "050-1112233", area: "חינוך", hours: 142, since: "03.2024", status: "פעיל" },
  { name: "עומר דהן", phone: "052-4445566", area: "לוגיסטיקה", hours: 98, since: "06.2024", status: "פעיל" },
  { name: "ליאור כץ", phone: "054-7778899", area: "שיווק", hours: 76, since: "09.2024", status: "פעיל" },
  { name: "תמר אזולאי", phone: "058-1234567", area: "חינוך", hours: 210, since: "01.2024", status: "פעיל" },
  { name: "איתי מזרחי", phone: "053-9876543", area: "אירועים", hours: 54, since: "11.2024", status: "פעיל" },
  { name: "שירה בן דוד", phone: "050-5551234", area: "ניהול", hours: 180, since: "02.2024", status: "לא פעיל" },
];

const shifts = [
  { date: "22.02.2026", time: "09:00-13:00", activity: "חוגים לילדים", volunteers: 4, location: "מרכז קהילתי" },
  { date: "23.02.2026", time: "16:00-20:00", activity: "ערב גיוס", volunteers: 8, location: "אולם אירועים" },
  { date: "25.02.2026", time: "10:00-14:00", activity: "חלוקת מזון", volunteers: 6, location: "מחסן ראשי" },
  { date: "27.02.2026", time: "09:00-12:00", activity: "שיעורי עזר", volunteers: 3, location: "בית ספר אופק" },
];

const volCols = [
  {
    key: "name",
    label: "שם",
    render: (_: unknown, row: Record<string, unknown>) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#34d399] to-[#60a5fa] flex items-center justify-center text-white text-xs font-bold">
          {(row.name as string).charAt(0)}
        </div>
        <span className="font-semibold text-[#1e1b3a]">{row.name as string}</span>
      </div>
    ),
  },
  { key: "phone", label: "טלפון" },
  { key: "area", label: "תחום", render: (val: unknown) => <span className="badge badge-purple">{val as string}</span> },
  { key: "hours", label: "שעות", render: (val: unknown) => <span className="font-bold text-[#7c5cfc]">{val as number}</span> },
  { key: "since", label: "מתנדב/ת מאז" },
  {
    key: "status",
    label: "סטטוס",
    render: (val: unknown) => (
      <span className={`badge ${val === "פעיל" ? "badge-success" : "badge-warning"}`}>{val as string}</span>
    ),
  },
];

const shiftCols = [
  { key: "date", label: "תאריך" },
  { key: "time", label: "שעות" },
  { key: "activity", label: "פעילות" },
  { key: "volunteers", label: "מתנדבים" },
  { key: "location", label: "מיקום" },
];

export default function VolunteersPage() {
  return (
    <>
      <Topbar title="ניהול מתנדבים" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={HandHelping} label="מתנדבים פעילים" value="48" change="+5" trend="up" color="#34d399" />
        <StatCard icon={Clock} label="שעות החודש" value="286" change="+12%" trend="up" color="#7c5cfc" />
        <StatCard icon={CalendarDays} label="משמרות השבוע" value="4" color="#60a5fa" />
        <StatCard icon={Award} label="מתנדב מצטיין" value="תמר א." color="#fbbf24" />
      </div>

      {/* Upcoming Shifts */}
      <div className="mb-6">
        <DataTable
          columns={shiftCols}
          data={shifts}
          title="משמרות קרובות"
          action={
            <button className="btn-primary flex items-center gap-2 !py-1.5 !text-xs">
              <Plus size={14} /> משמרת חדשה
            </button>
          }
        />
      </div>

      {/* Volunteers List */}
      <div className="mb-6">
        <DataTable
          columns={volCols}
          data={volunteers}
          title="רשימת מתנדבים"
          action={
            <div className="flex gap-2">
              <button className="btn-secondary flex items-center gap-2 !py-1.5 !text-xs">
                <Download size={14} /> ייצוא
              </button>
              <button className="btn-primary flex items-center gap-2 !py-1.5 !text-xs">
                <Plus size={14} /> מתנדב/ת חדש/ה
              </button>
            </div>
          }
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <h4 className="text-sm font-bold text-[#1e1b3a] mb-4">לפי תחום</h4>
          {[
            { area: "חינוך", count: 18, color: "#7c5cfc" },
            { area: "לוגיסטיקה", count: 12, color: "#e879f9" },
            { area: "שיווק", count: 8, color: "#60a5fa" },
            { area: "אירועים", count: 6, color: "#34d399" },
            { area: "ניהול", count: 4, color: "#fbbf24" },
          ].map((item) => (
            <div key={item.area} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></span>
                <span className="text-sm text-[#6b6894]">{item.area}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.count}</span>
            </div>
          ))}
        </div>

        <div className="glass-card p-5">
          <h4 className="text-sm font-bold text-[#1e1b3a] mb-4">מצטיינים החודש</h4>
          {volunteers.sort((a, b) => b.hours - a.hours).slice(0, 5).map((v, i) => (
            <div key={v.name} className="flex items-center gap-3 py-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#fb923c] text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-[#6b6894]">{v.name}</span>
              <span className="text-sm font-bold text-[#7c5cfc]">{v.hours} שעות</span>
            </div>
          ))}
        </div>

        <div className="glass-card p-5">
          <h4 className="text-sm font-bold text-[#1e1b3a] mb-4">שעות לפי חודש</h4>
          {[
            { month: "פברואר 2026", hours: 286 },
            { month: "ינואר 2026", hours: 312 },
            { month: "דצמבר 2025", hours: 245 },
            { month: "נובמבר 2025", hours: 198 },
            { month: "אוקטובר 2025", hours: 267 },
          ].map((item) => (
            <div key={item.month} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-[#6b6894]">{item.month}</span>
              <span className="text-sm font-semibold text-[#1e1b3a]">{item.hours} שעות</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
