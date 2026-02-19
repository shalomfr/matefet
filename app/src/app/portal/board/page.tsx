"use client";
import { Users, Calendar, Download, Clock, UserCheck, Crown, User } from "lucide-react";

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
    <div className="min-h-screen" style={{ background: "#f4f6fb" }}>
      {/* Header */}
      <div
        className="px-8 pt-8 pb-6"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #4c1d95 100%)" }}
      >
        <h1 className="text-[24px] font-bold text-white font-[Frank_Ruhl_Libre,serif]">
          👥 הועד שלי
        </h1>
        <p className="text-[14px] text-white/70 mt-1">חברי ועד, ישיבות ופרוטוקולים</p>
      </div>

      <div className="px-8 py-6 max-w-[1100px]">
        {/* Encouragement */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 mb-6 text-center">
          <span className="text-[14px] font-medium text-[#16a34a]">
            הועד שלך נפגש בקביעות – כל הכבוד! 🎉 נוכחות ממוצעת: 85%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Board Members */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8ecf4] shadow-sm">
            <h3 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#5c3d9a]" /> חברי ועד ({boardMembers.length})
            </h3>
            <div className="space-y-3">
              {boardMembers.map((member) => {
                const Icon = getRoleIcon(member.role);
                return (
                  <div key={member.name} className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9fc]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f3effa] flex items-center justify-center text-[13px] font-bold text-[#5c3d9a]">
                        {member.initials}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#1e293b]">{member.name}</div>
                        <div className="text-[11px] text-[#64748b] flex items-center gap-1">
                          <Icon size={12} /> {member.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[14px] font-bold text-[#5c3d9a]">{member.attendance}%</div>
                      <div className="text-[10px] text-[#64748b]">נוכחות</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Meeting */}
          <div>
            <div className="bg-white rounded-2xl p-5 border border-[#e8ecf4] shadow-sm mb-6">
              <h3 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-[#5c3d9a]" /> הישיבה הבאה
              </h3>
              <div className="bg-[#f3effa] rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[15px] font-bold text-[#5c3d9a]">{nextMeeting.date}</span>
                  <span className="text-[13px] font-semibold text-[#5c3d9a] bg-white px-3 py-1 rounded-lg">
                    {nextMeeting.time}
                  </span>
                </div>
                <div className="text-[12px] text-[#64748b]">{nextMeeting.location}</div>
              </div>
              <div className="text-[13px] font-semibold text-[#1e293b] mb-2">סדר יום:</div>
              <ol className="space-y-2 list-decimal list-inside">
                {nextMeeting.topics.map((topic, i) => (
                  <li key={i} className="text-[13px] text-[#64748b]">{topic}</li>
                ))}
              </ol>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-[#e8ecf4] shadow-sm text-center">
                <div className="text-[24px] font-bold text-[#5c3d9a]">13</div>
                <div className="text-[11px] text-[#64748b]">ישיבות השנה</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#e8ecf4] shadow-sm text-center">
                <div className="text-[24px] font-bold text-[#16a34a]">100%</div>
                <div className="text-[11px] text-[#64748b]">פרוטוקולים מאושרים</div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Meetings */}
        <div className="bg-white rounded-2xl p-5 border border-[#e8ecf4] shadow-sm">
          <h3 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <Clock size={18} className="text-[#5c3d9a]" /> ישיבות אחרונות
          </h3>
          <div className="space-y-2">
            {pastMeetings.map((meeting) => (
              <div key={meeting.number} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f8f9fc] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f3effa] flex items-center justify-center text-[14px] font-bold text-[#5c3d9a]">
                    #{meeting.number}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1e293b]">ישיבת ועד #{meeting.number}</div>
                    <div className="text-[11px] text-[#64748b]">{meeting.date} · {meeting.topics} נושאים</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {meeting.approved && (
                    <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1 rounded-lg border border-[#bbf7d0]">
                      מאושר ✓
                    </span>
                  )}
                  <button className="p-2 rounded-lg hover:bg-[#f3effa] text-[#5c3d9a]">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
