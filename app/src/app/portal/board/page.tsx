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
    <div className="min-h-screen" style={{ background: "#f8f9fc" }}>
      {/* Header */}
      <div
        className="px-8 pt-8 pb-8 relative overflow-hidden anim-gradient"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 40%, #4c1d95 100%)",
          backgroundSize: "200% 200%",
        }}
      >
        <div className="absolute top-[-40px] left-[-20px] w-[160px] h-[160px] rounded-full bg-white/5 anim-float" />
        <div className="absolute bottom-[-60px] right-[15%] w-[200px] h-[200px] rounded-full bg-white/[0.03] anim-float" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 anim-fade-up">
          <h1 className="text-[24px] font-bold text-white font-[Frank_Ruhl_Libre,serif] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Users size={20} className="text-white" />
            </div>
            הועד שלי
          </h1>
          <p className="text-[14px] text-white/70 mt-2 mr-[52px]">חברי ועד, ישיבות ופרוטוקולים</p>
        </div>
      </div>

      <div className="px-8 py-6 max-w-[1100px]">
        {/* Encouragement */}
        <div className="anim-fade-down bg-gradient-to-l from-[#f0fdf4] to-white border border-[#bbf7d0] rounded-2xl p-4 mb-6 text-center">
          <span className="text-[14px] font-medium text-[#16a34a]">
            הועד שלך נפגש בקביעות – כל הכבוד! 🎉 נוכחות ממוצעת: 85%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Board Members */}
          <div className="anim-fade-up delay-1 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#f3effa] flex items-center justify-center">
                <Users size={16} className="text-[#7c3aed]" />
              </div>
              חברי ועד ({boardMembers.length})
            </h3>
            <div className="space-y-3">
              {boardMembers.map((member, i) => {
                const Icon = getRoleIcon(member.role);
                return (
                  <div key={member.name} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#7c3aed]/20 transition-all`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center text-[12px] font-bold text-white shadow-md">
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
                      <div className="text-[14px] font-bold text-[#7c3aed]">{member.attendance}%</div>
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
                <div className="w-8 h-8 rounded-xl bg-[#f3effa] flex items-center justify-center">
                  <Calendar size={16} className="text-[#7c3aed]" />
                </div>
                הישיבה הבאה
              </h3>
              <div className="bg-gradient-to-l from-[#f3effa] to-[#ede9fe] rounded-xl p-4 mb-4 border border-[#7c3aed]/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[16px] font-bold text-[#7c3aed]">{nextMeeting.date}</span>
                  <span className="text-[13px] font-semibold text-[#7c3aed] bg-white px-3.5 py-1.5 rounded-xl shadow-sm">
                    {nextMeeting.time}
                  </span>
                </div>
                <div className="text-[12px] text-[#64748b]">{nextMeeting.location}</div>
              </div>
              <div className="text-[13px] font-semibold text-[#1e293b] mb-2">סדר יום:</div>
              <ol className="space-y-2">
                {nextMeeting.topics.map((topic, i) => (
                  <li key={i} className={`anim-fade-right delay-${i + 1} flex items-center gap-2 text-[13px] text-[#64748b]`}>
                    <div className="w-5 h-5 rounded-md bg-[#f3effa] flex items-center justify-center text-[10px] font-bold text-[#7c3aed]">
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
                <div className="anim-count delay-5 text-[28px] font-bold text-[#7c3aed]">13</div>
                <div className="text-[11px] text-[#64748b] mt-1">ישיבות השנה</div>
              </div>
              <div className="anim-fade-scale delay-4 bg-white rounded-2xl p-5 border border-[#e8ecf4] text-center hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
                <div className="anim-count delay-6 text-[28px] font-bold text-[#16a34a]">100%</div>
                <div className="text-[11px] text-[#64748b] mt-1">פרוטוקולים מאושרים</div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Meetings */}
        <div className="anim-fade-up delay-4 bg-white rounded-2xl p-5 border border-[#e8ecf4]" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f3effa] flex items-center justify-center">
              <Clock size={16} className="text-[#7c3aed]" />
            </div>
            ישיבות אחרונות
          </h3>
          <div className="space-y-2">
            {pastMeetings.map((meeting, i) => (
              <div key={meeting.number} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-4 rounded-xl hover:bg-[#f8f9fc] transition-all border border-transparent hover:border-[#e8ecf4]`}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#f3effa] to-[#ede9fe] flex items-center justify-center text-[13px] font-bold text-[#7c3aed]">
                    #{meeting.number}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1e293b]">ישיבת ועד #{meeting.number}</div>
                    <div className="text-[11px] text-[#64748b]">{meeting.date} · {meeting.topics} נושאים</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {meeting.approved && (
                    <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 rounded-xl border border-[#bbf7d0]">
                      מאושר ✓
                    </span>
                  )}
                  <button className="p-2.5 rounded-xl hover:bg-[#f3effa] text-[#7c3aed] transition-all hover:scale-110">
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
