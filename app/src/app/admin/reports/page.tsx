"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { BarChart3, Building2, Zap, TrendingUp } from "lucide-react";

interface Overview {
  organizations: number;
  users: number;
  pendingApprovals: number;
  activeWorkflows: number;
  totalExecutions: number;
  totalDonations: number;
  donationCount: number;
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
  organizations: OrgData[];
}

export default function AdminReportsPage() {
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
        <Topbar title="דוחות פנימיים" subtitle="סטטיסטיקות ושימוש" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="דוחות פנימיים" subtitle="סטטיסטיקות ושימוש" />
        <div className="flex items-center justify-center h-64 text-[#64748b]">אין נתונים</div>
      </div>
    );
  }

  const overview = data.overview;
  const organizations = data.organizations ?? [];

  // Calculate a simple usage-like metric per org based on their activity
  const maxActivity = Math.max(
    ...organizations.map((o) => o.users + o.workflows + o.donations),
    1
  );

  const barColors = ["#2ecc8f", "#2563eb", "#f5a623", "#60a5fa", "#e8445a", "#16a34a", "#d97706", "#8b5cf6"];

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="דוחות פנימיים" subtitle="סטטיסטיקות ושימוש" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Building2} label="ארגונים פעילים" value={String(overview?.organizations ?? 0)} color="#2563eb" />
        <StatCard icon={Zap} label="סה״כ הרצות" value={String(overview?.totalExecutions ?? 0)} color="#2ecc8f" />
        <StatCard icon={TrendingUp} label="סה״כ תרומות" value={`₪${(overview?.totalDonations ?? 0).toLocaleString()}`} color="#60a5fa" />
        <StatCard icon={BarChart3} label="מספר תרומות" value={String(overview?.donationCount ?? 0)} color="#f5a623" />
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <h3 className="text-base font-bold text-[#1e293b] mb-4">שימוש לפי ארגון</h3>
        {organizations.length === 0 ? (
          <div className="text-center text-[#64748b] py-8">אין נתונים</div>
        ) : (
          <div className="space-y-3">
            {organizations.map((org, i) => {
              const activity = org.users + org.workflows + org.donations;
              const usage = Math.round((activity / maxActivity) * 100);
              const barColor = barColors[i % barColors.length];
              return (
                <div key={org.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-[#1e293b]">{org.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#64748b]">{org.users} משתמשים · {org.workflows} אוטומציות · {org.donations} תרומות</span>
                      <span className="text-[13px] font-bold text-[#64748b]">{usage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#f8f9fc] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${usage}%`, background: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
