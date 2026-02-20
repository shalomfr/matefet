"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { BarChart2, FileText } from "lucide-react";
import { useToast } from "@/components/Toast";

type BudgetLine = {
  id: string;
  category: string;
  planned: number;
  actual: number;
};

type Budget = {
  id: string;
  year: number;
  name: string;
  totalBudget: number;
  totalSpent: number;
  isActive: boolean;
  lines: BudgetLine[];
};

type Donor = {
  id: string;
  firstName: string;
  lastName: string;
};

type Donation = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  donatedAt: string;
  donor?: Donor | null;
};

type ReportsData = {
  budgets: Budget[];
  donations: Donation[];
};

export default function PortalReportsPage() {
  const { showSuccess } = useToast();
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/budget").then(r => r.json()),
      fetch("/api/donations").then(r => r.json()),
    ])
      .then(([budgetRes, donationsRes]) => {
        setData({
          budgets: budgetRes.success ? budgetRes.data : [],
          donations: donationsRes.success ? donationsRes.data : [],
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="דוחות ותקציב" subtitle="דוחות כספיים, שנתיים ותקציבים" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const budgets = data?.budgets ?? [];
  const donations = data?.donations ?? [];

  // Build report items from budgets
  const reportItems = budgets.map(b => ({
    id: b.id,
    name: b.name,
    period: `שנת ${b.year}`,
    status: b.isActive ? "פעיל" : "הוגש",
    totalBudget: b.totalBudget,
    totalSpent: b.totalSpent,
    percentage: b.totalBudget > 0 ? Math.round((b.totalSpent / b.totalBudget) * 100) : 0,
  }));

  // Donation summary
  const totalDonations = donations
    .filter(d => d.status === "COMPLETED")
    .reduce((sum, d) => sum + d.amount, 0);
  const donationCount = donations.filter(d => d.status === "COMPLETED").length;

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="דוחות ותקציב" subtitle="דוחות כספיים, שנתיים ותקציבים" />

      <div className="max-w-[800px]">
        {/* Donation summary card */}
        {donationCount > 0 && (
          <div className="anim-fade-down bg-white rounded-2xl border border-[#bbf7d0] p-5 mb-6 flex items-center gap-3" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[16px] font-bold text-[#16a34a]">
              ₪
            </div>
            <div className="flex-1">
              <h2 className="text-[15px] font-bold text-[#1e293b]">סה״כ תרומות: ₪{totalDonations.toLocaleString()}</h2>
              <p className="text-[13px] text-[#64748b]">{donationCount} תרומות שהושלמו</p>
            </div>
          </div>
        )}

        {/* Budgets / Reports list */}
        <div className="anim-fade-up delay-2 bg-white rounded-2xl border border-[#e8ecf4] overflow-hidden hover-lift" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="p-5 border-b border-[#e8ecf4] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <BarChart2 size={16} className="text-[#2563eb]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#1e293b]">תקציבים ודוחות</h3>
          </div>
          <div className="divide-y divide-[#e8ecf4]">
            {reportItems.length === 0 ? (
              <div className="text-center py-8 text-[13px] text-[#64748b]">אין דוחות</div>
            ) : (
              reportItems.map((r, i) => (
                <div
                  key={r.id}
                  className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-5 hover:bg-[#f8f9fc] transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                      <FileText size={18} className="text-[#2563eb]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#1e293b]">{r.name}</div>
                      <div className="text-[11px] text-[#64748b]">
                        {r.period} · ₪{r.totalSpent.toLocaleString()} / ₪{r.totalBudget.toLocaleString()} ({r.percentage}%)
                      </div>
                    </div>
                  </div>
                  {r.status === "פעיל" ? (
                    <span className="text-[11px] font-semibold text-[#2563eb] bg-[#eff6ff] px-3 py-1.5 rounded-lg border border-[#bfdbfe]">
                      {r.status}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
                      {r.status}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent donations */}
        {donations.length > 0 && (
          <div className="anim-fade-up delay-4 bg-white rounded-2xl border border-[#e8ecf4] overflow-hidden hover-lift mt-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <div className="p-5 border-b border-[#e8ecf4] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
                <FileText size={16} className="text-[#16a34a]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b]">תרומות אחרונות</h3>
            </div>
            <div className="divide-y divide-[#e8ecf4]">
              {donations.slice(0, 10).map((d, i) => {
                const donorName = d.donor
                  ? `${d.donor.firstName} ${d.donor.lastName}`
                  : "אנונימי";
                const statusLabel = d.status === "COMPLETED" ? "הושלם" : d.status === "PENDING" ? "ממתין" : d.status;
                const statusColor = d.status === "COMPLETED" ? "#16a34a" : d.status === "PENDING" ? "#d97706" : "#64748b";
                return (
                  <div
                    key={d.id}
                    className={`anim-fade-right delay-${i + 1} flex items-center justify-between p-5 hover:bg-[#f8f9fc] transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[12px] font-bold text-[#16a34a]">
                        ₪
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#1e293b]">{donorName}</div>
                        <div className="text-[11px] text-[#64748b]">
                          ₪{d.amount.toLocaleString()} · {new Date(d.donatedAt).toLocaleDateString("he-IL")}
                          {d.method ? ` · ${d.method}` : ""}
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                      style={{
                        color: statusColor,
                        background: d.status === "COMPLETED" ? "#f0fdf4" : "#fffbeb",
                        border: `1px solid ${d.status === "COMPLETED" ? "#bbf7d0" : "#fde68a"}`,
                      }}
                    >
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
