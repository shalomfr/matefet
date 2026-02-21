"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import {
  Building2, Link2, Zap, AlertTriangle, CheckCircle2, Clock,
  Users, ArrowLeft, Bell, TrendingUp,
} from "lucide-react";

interface Overview {
  organizations: number;
  users: number;
  pendingApprovals: number;
  activeWorkflows: number;
  totalExecutions: number;
  totalDonations: number;
  donationCount: number;
}

interface Execution {
  id: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  workflow: { name: string };
  organization: { name: string };
}

interface OrgData {
  id: string;
  name: string;
  number: string;
  users: number;
  workflows: number;
  donations: number;
  createdAt: string;
}

interface AdminStats {
  overview: Overview;
  recentExecutions: Execution[];
  organizations: OrgData[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/admin")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="דשבורד פנימי" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="דשבורד פנימי" />
        <div className="flex items-center justify-center h-64 text-[#64748b]">אין נתונים</div>
      </div>
    );
  }

  const overview = data.overview;
  const recentExecutions = data.recentExecutions ?? [];
  const organizations = data.organizations ?? [];

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="דשבורד פנימי" subtitle="מעטפת ניהולית" />

      <div data-tour="admin-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="anim-fade-scale delay-1"><StatCard icon={Building2} label="ארגונים פעילים" value={String(overview?.organizations ?? 0)} color="#2563eb" /></div>
        <div className="anim-fade-scale delay-2"><StatCard icon={Users} label="משתמשים" value={String(overview?.users ?? 0)} color="#16a34a" /></div>
        <div className="anim-fade-scale delay-3"><StatCard icon={Zap} label="אוטומציות פעילות" value={String(overview?.activeWorkflows ?? 0)} color="#2563eb" /></div>
        <div className="anim-fade-scale delay-4"><StatCard icon={AlertTriangle} label="ממתינים לאישור" value={String(overview?.pendingApprovals ?? 0)} color="#d97706" /></div>
      </div>

      {/* Org Overview */}
      <div data-tour="admin-orgs" className="anim-fade-up delay-2 bg-white rounded-2xl p-5 mb-6 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center"><TrendingUp size={16} className="text-[#2563eb]" /></div>
            סקירת ארגונים
          </h3>
          <Link href="/admin/organizations" className="text-[12px] font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
            לכל הארגונים <ArrowLeft size={12} />
          </Link>
        </div>
        {organizations.length === 0 ? (
          <div className="text-center text-[#64748b] py-6">אין נתונים</div>
        ) : (
          <div className="space-y-2">
            {organizations.map((org, i) => {
              return (
                <Link
                  key={org.id}
                  href="/admin/organizations"
                  className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all block`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-9 rounded-full bg-[#16a34a]" />
                    <div>
                      <span className="text-[13px] font-medium text-[#1e293b]">{org.name}</span>
                      <span className="text-[11px] text-[#64748b] mr-2"> · {org.users} משתמשים · {org.workflows} אוטומציות · {org.donations} תרומות</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-[#64748b]">{org.number}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div data-tour="admin-quicklinks" className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Stats Summary */}
        <div className="anim-fade-up delay-3 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fffbeb] flex items-center justify-center"><Bell size={16} className="text-[#d97706]" /></div>
            סיכום מספרי
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50">
              <span className="text-[13px] font-medium text-[#1e293b]">סה״כ הרצות אוטומציה</span>
              <span className="text-[15px] font-bold text-[#2563eb]">{overview?.totalExecutions ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50">
              <span className="text-[13px] font-medium text-[#1e293b]">סה״כ תרומות</span>
              <span className="text-[15px] font-bold text-[#16a34a]">₪{(overview?.totalDonations ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50">
              <span className="text-[13px] font-medium text-[#1e293b]">מספר תרומות</span>
              <span className="text-[15px] font-bold text-[#64748b]">{overview?.donationCount ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Executions */}
        <div className="anim-fade-up delay-4 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center"><Clock size={16} className="text-[#2563eb]" /></div>
            הרצות אחרונות
          </h3>
          {recentExecutions.length === 0 ? (
            <div className="text-center text-[#64748b] py-6">אין נתונים</div>
          ) : (
            <div className="space-y-2">
              {recentExecutions.slice(0, 5).map((exec) => (
                <div key={exec.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50 hover:border-[#2563eb]/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${exec.status === "SUCCESS" ? "bg-[#f0fdf4]" : exec.status === "FAILED" ? "bg-[#fef2f2]" : "bg-[#fffbeb]"}`}>
                      {exec.status === "SUCCESS" ? <CheckCircle2 size={14} className="text-[#16a34a]" /> : exec.status === "FAILED" ? <AlertTriangle size={14} className="text-[#ef4444]" /> : <Clock size={14} className="text-[#d97706]" />}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#1e293b]">{exec.workflow?.name ?? "—"}</div>
                      <div className="text-[11px] text-[#64748b]">{exec.organization?.name ?? "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${exec.status === "SUCCESS" ? "badge-success" : exec.status === "FAILED" ? "badge-danger" : "badge-warning"}`}>
                      {exec.status === "SUCCESS" ? "הושלם" : exec.status === "FAILED" ? "נכשל" : exec.status === "RUNNING" ? "רץ" : "ממתין"}
                    </span>
                    <span className="text-[11px] text-[#64748b]">{new Date(exec.startedAt).toLocaleDateString("he-IL")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Quick Links */}
        <div className="anim-fade-up delay-5 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h3 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center"><Link2 size={16} className="text-[#2563eb]" /></div>
            קישורים מהירים
          </h3>
          <div className="space-y-2">
            {[
              { href: "/admin/organizations", label: "ניהול ארגונים", icon: Building2 },
              { href: "/admin/users", label: "משתמשים והרשאות", icon: Users },
              { href: "/admin/automation", label: "אוטומציות", icon: Zap },
              { href: "/admin/integrations", label: "אינטגרציות", icon: Link2 },
              { href: "/admin/reports", label: "דוחות", icon: TrendingUp },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f8f9fc] transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center">
                  <link.icon size={14} className="text-[#2563eb]" />
                </div>
                <span className="text-[13px] font-medium text-[#1e293b]">{link.label}</span>
                <ArrowLeft size={12} className="text-[#64748b] mr-auto" />
              </Link>
            ))}
          </div>
        </div>

        {/* סטטוס כללי */}
        <div className="anim-fade-up delay-6 bg-white rounded-2xl p-5 border border-[#e8ecf4] hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center"><CheckCircle2 size={16} className="text-[#16a34a]" /></div>
              סטטוס כללי
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]" style={{ boxShadow: "0 0 6px rgba(22,163,74,0.4)" }} />
                <span className="text-[13px] font-medium text-[#1e293b]">ארגונים</span>
              </div>
              <span className="text-[13px] font-bold text-[#2563eb]">{overview?.organizations ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]" style={{ boxShadow: "0 0 6px rgba(22,163,74,0.4)" }} />
                <span className="text-[13px] font-medium text-[#1e293b]">משתמשים</span>
              </div>
              <span className="text-[13px] font-bold text-[#2563eb]">{overview?.users ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f8f9fc] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2563eb]" style={{ boxShadow: "0 0 6px rgba(37,99,235,0.4)" }} />
                <span className="text-[13px] font-medium text-[#1e293b]">אוטומציות</span>
              </div>
              <span className="text-[13px] font-bold text-[#2563eb]">{overview?.activeWorkflows ?? 0}</span>
            </div>
          </div>
          <Link href="/admin/integrations" className="inline-flex items-center gap-1 mt-4 text-[12px] font-semibold text-[#2563eb] hover:underline">
            ניהול אינטגרציות <ArrowLeft size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
