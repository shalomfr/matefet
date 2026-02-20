"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { Users, Calendar, Download, Clock, UserCheck, Crown, User, CheckCircle2 } from "lucide-react";

type BoardMember = {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  startDate?: string;
};

type BoardMeeting = {
  id: string;
  title: string;
  date: string;
  location?: string;
  status: string;
  summary?: string;
  attendeesCount?: number;
  resolutions: { id: string; title: string; status: string }[];
  protocol?: { id: string; approvedAt?: string } | null;
};

type BoardResolution = {
  id: string;
  title: string;
  description?: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  createdAt: string;
  meeting?: { id: string; title: string } | null;
};

type BoardData = {
  members: BoardMember[];
  meetings: BoardMeeting[];
  resolutions: BoardResolution[];
};

function getRoleIcon(role: string) {
  const lower = role.toLowerCase();
  if (lower.includes("יו\"ר") || lower.includes("יו״ר") || lower === "chair" || lower === "chairperson") return Crown;
  if (lower.includes("גזבר") || lower === "treasurer") return UserCheck;
  return User;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return name.substring(0, 2);
}

export default function PortalBoardPage() {
  const [data, setData] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/board/meetings").then(r => r.json()),
      fetch("/api/board/members").then(r => r.json()),
      fetch("/api/board/resolutions").then(r => r.json()),
    ])
      .then(([meetingsRes, membersRes, resolutionsRes]) => {
        setData({
          meetings: meetingsRes.success ? meetingsRes.data : [],
          members: membersRes.success ? membersRes.data : [],
          resolutions: resolutionsRes.success ? resolutionsRes.data : [],
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="הועד שלי" subtitle="חברי ועד, ישיבות ופרוטוקולים" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const members = (data?.members ?? []).filter(m => m.isActive);
  const meetings = data?.meetings ?? [];
  const resolutions = data?.resolutions ?? [];

  // Find next upcoming meeting
  const now = Date.now();
  const upcomingMeetings = meetings
    .filter(m => new Date(m.date).getTime() >= now && m.status === "SCHEDULED")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextMeeting = upcomingMeetings[0] ?? null;

  // Past meetings sorted desc
  const pastMeetings = meetings
    .filter(m => new Date(m.date).getTime() < now || m.status === "COMPLETED")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Stats
  const totalMeetings = meetings.length;
  const approvedProtocols = meetings.filter(m => m.protocol?.approvedAt).length;
  const approvalPct = totalMeetings > 0 ? Math.round((approvedProtocols / totalMeetings) * 100) : 0;

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="הועד שלי" subtitle="חברי ועד, ישיבות ופרוטוקולים" />

      {/* Encouragement */}
      {members.length > 0 && (
        <div className="anim-fade-down bg-white rounded-2xl border border-[#bbf7d0] p-4 mb-6 flex items-center gap-3" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
            <CheckCircle2 size={16} className="text-[#16a34a]" />
          </div>
          <span className="text-[13px] font-medium text-[#16a34a]">
            הועד שלך כולל {members.length} חברים פעילים – כל הכבוד!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Board Members */}
        <div className="anim-fade-up delay-1 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Users size={16} className="text-[#2563eb]" />
            </div>
            חברי ועד ({members.length})
          </h3>
          <div className="space-y-2">
            {members.length === 0 ? (
              <div className="text-center py-6 text-[13px] text-[#64748b]">אין חברי ועד</div>
            ) : (
              members.map((member, i) => {
                const Icon = getRoleIcon(member.role);
                return (
                  <div key={member.id} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-[12px] font-bold text-white shadow-sm">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#1e293b]">{member.name}</div>
                        <div className="text-[11px] text-[#64748b] flex items-center gap-1">
                          <Icon size={11} /> {member.role}
                        </div>
                      </div>
                    </div>
                    {member.phone && (
                      <div className="text-[11px] text-[#64748b]">{member.phone}</div>
                    )}
                  </div>
                );
              })
            )}
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
            {nextMeeting ? (
              <>
                <div className="bg-[#f8f9fc] rounded-xl p-4 mb-4 border border-[#e8ecf4]/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[16px] font-bold text-[#2563eb]">
                      {new Date(nextMeeting.date).toLocaleDateString("he-IL")}
                    </span>
                    <span className="text-[13px] font-semibold text-[#2563eb] bg-[#eff6ff] px-3.5 py-1.5 rounded-xl">
                      {new Date(nextMeeting.date).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#64748b]">{nextMeeting.location ?? "מקום טרם נקבע"}</div>
                </div>
                <div className="text-[13px] font-semibold text-[#1e293b] mb-2">{nextMeeting.title}</div>
                {nextMeeting.summary && (
                  <p className="text-[12px] text-[#64748b]">{nextMeeting.summary}</p>
                )}
                {nextMeeting.resolutions.length > 0 && (
                  <>
                    <div className="text-[13px] font-semibold text-[#1e293b] mb-2 mt-3">סדר יום:</div>
                    <ol className="space-y-2">
                      {nextMeeting.resolutions.map((res, i) => (
                        <li key={res.id} className={`anim-fade-right delay-${i + 1} flex items-center gap-2 text-[13px] text-[#64748b]`}>
                          <div className="w-5 h-5 rounded-md bg-[#eff6ff] flex items-center justify-center text-[10px] font-bold text-[#2563eb]">
                            {i + 1}
                          </div>
                          {res.title}
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-[13px] text-[#64748b]">אין ישיבה מתוכננת</div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="anim-fade-scale delay-3 bg-white rounded-2xl p-5 border border-[#e8ecf4] text-center hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
              <div className="text-[28px] font-bold text-[#2563eb]">{totalMeetings}</div>
              <div className="text-[11px] text-[#64748b] mt-1">ישיבות</div>
            </div>
            <div className="anim-fade-scale delay-4 bg-white rounded-2xl p-5 border border-[#e8ecf4] text-center hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
              <div className="text-[28px] font-bold text-[#16a34a]">{approvalPct}%</div>
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
          {pastMeetings.length === 0 ? (
            <div className="text-center py-6 text-[13px] text-[#64748b]">אין ישיבות קודמות</div>
          ) : (
            pastMeetings.map((meeting, i) => (
              <div key={meeting.id} className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all border border-transparent hover:border-[#e8ecf4]`}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[13px] font-bold text-[#2563eb]">
                    {new Date(meeting.date).getDate()}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1e293b]">{meeting.title}</div>
                    <div className="text-[11px] text-[#64748b]">
                      {new Date(meeting.date).toLocaleDateString("he-IL")} · {meeting.resolutions.length} נושאים
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {meeting.protocol?.approvedAt && (
                    <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
                      מאושר
                    </span>
                  )}
                  <button className="p-2 rounded-lg hover:bg-[#eff6ff] text-[#2563eb] transition-all">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
