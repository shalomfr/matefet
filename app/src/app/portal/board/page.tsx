"use client";
import Topbar from "@/components/Topbar";
import { Users, Calendar, Download, Clock, UserCheck, Crown, User, CheckCircle2 } from "lucide-react";

const boardMembers = [
  { name: "יוסי לוי", role: "יו״ר", attendance: 100, initials: "יל" },
  { name: "שרה כהן", role: "גזברית", attendance: 92, initials: "שכ" },
  { name: "דוד אברהם", role: "חבר ועד", attendance: 85, initials: "דא" },
  { name: "רחל מזרחי", role: "חברת ועד", attendance: 77, initials: "רמ" },
  { name: "משה גולן", role: "חבר ועד", attendance: 69, initials: "מג" },
];

const nextMeeting = {
  date: "28.02.2026",
  time: "18:00",
  location: "משרדי העמותה, ת״א",
  topics: [
    "אישור דוח כספי Q4",
    "תקציב 2026 – הצגה ואישור",
    "עדכון מצב ניהול תקין",
    "שונות",
  ],
};

const pastMeetings = [
  { number: 13, date: "15.01.2026", topics: 5, approved: true },
  { number: 12, date: "10.12.2025", topics: 4, approved: true },
  { number: 11, date: "20.11.2025", topics: 6, approved: true },
  { number: 10, date: "15.10.2025", topics: 3, approved: true },
];

function getRoleIcon(role: string) {
  if (role === "יו״ר") return Crown;
  if (role === "גזברית") return UserCheck;
  return User;
}

export default function PortalBoardPage() {
  return (
    <div className="px-8 pb-8">
      <Topbar title="הועד שלי" subtitle="חברי ועד, ישיבות ופרוטוקולים" />

      {/* Encouragement */}
      <div className="anim-fade-down bg-white rounded-2xl border border-[#bbf7d0] p-4 mb-6 flex items-center gap-3" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
          <CheckCircle2 size={16} className="text-[#16a34a]" />
        </div>
        <span className="text-[13px] font-medium text-[#16a34a]">
          הועד שלך נפגש בקביעות – כל הכבוד! נוכחות ממוצעת: 85%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Board Members */}
        <div className="anim-fade-up delay-1 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Users size={16} className="text-[#2563eb]" />
            </div>
            חברי ועד ({boardMembers.length})
          </h3>
          <div className="space-y-2">
            {boardMembers.map((member, i) => {
              const Icon = getRoleIcon(member.role);
              return (
                <div key={member.name} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-[12px] font-bold text-white shadow-sm">
                      {member.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#1e293b]">{member.name}</div>
                      <div className="text-[11px] text-[#64748b] flex items-center gap-1">
                        <Icon size={11} /> {member.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[14px] font-bold text-[#2563eb]">{member.attendance}%</div>
                    <div className="text-[10px] text-[#64748b]">נוכחות</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Meeting + Stats */}
        <div>
          <div className="anim-fade-up delay-2 bg-white rounded-2xl p-5 border border-[#e8ecf4] mb-6 hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                <Calendar size={16} className="text-[#2563eb]" />
              </div>
              הישיבה הבאה
            </h3>
            <div className="bg-[#f8f9fc] rounded-xl p-4 mb-4 border border-[#e8ecf4]/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[16px] font-bold text-[#2563eb]">{nextMeeting.date}</span>
                <span className="text-[13px] font-semibold text-[#2563eb] bg-[#eff6ff] px-3.5 py-1.5 rounded-xl">
                  {nextMeeting.time}
                </span>
              </div>
              <div className="text-[12px] text-[#64748b]">{nextMeeting.location}</div>
            </div>
            <div className="text-[13px] font-semibold text-[#1e293b] mb-2">סדר יום:</div>
            <ol className="space-y-2">
              {nextMeeting.topics.map((topic, i) => (
                <li key={i} className={`anim-fade-right delay-${i + 1} flex items-center gap-2 text-[13px] text-[#64748b]`}>
                  <div className="w-5 h-5 rounded-md bg-[#eff6ff] flex items-center justify-center text-[10px] font-bold text-[#2563eb]">
                    {i + 1}
                  </div>
                  {topic}
                </li>
              ))}
            </ol>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="anim-fade-scale delay-3 bg-white rounded-2xl p-5 border border-[#e8ecf4] text-center hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
              <div className="text-[28px] font-bold text-[#2563eb]">13</div>
              <div className="text-[11px] text-[#64748b] mt-1">ישיבות השנה</div>
            </div>
            <div className="anim-fade-scale delay-4 bg-white rounded-2xl p-5 border border-[#e8ecf4] text-center hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
              <div className="text-[28px] font-bold text-[#16a34a]">100%</div>
              <div className="text-[11px] text-[#64748b] mt-1">פרוטוקולים מאושרים</div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Meetings */}
      <div className="anim-fade-up delay-4 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
            <Clock size={16} className="text-[#2563eb]" />
          </div>
          ישיבות אחרונות
        </h3>
        <div className="space-y-2">
          {pastMeetings.map((meeting, i) => (
            <div key={meeting.number} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all border border-transparent hover:border-[#e8ecf4]`}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[13px] font-bold text-[#2563eb]">
                  #{meeting.number}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#1e293b]">ישיבת ועד #{meeting.number}</div>
                  <div className="text-[11px] text-[#64748b]">{meeting.date} · {meeting.topics} נושאים</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {meeting.approved && (
                  <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
                    מאושר
                  </span>
                )}
                <button className="p-2 rounded-lg hover:bg-[#eff6ff] text-[#2563eb] transition-all">
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
