"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { Zap, Play, CheckCircle2, Clock, Plus, Settings, ArrowLeft, ToggleRight, ToggleLeft, Loader2 } from "lucide-react";

interface WorkflowStep {
  id: string;
  order: number;
  actionType: string;
  actionConfig: Record<string, unknown>;
}

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  triggerType: string;
  status: string;
  runCount: number;
  lastRunAt: string | null;
  createdAt: string;
  steps: WorkflowStep[];
  _count: { executions: number };
}

interface StepLog {
  id: string;
  status: string;
  startedAt: string;
  step: { actionType: string; order: number };
}

interface Execution {
  id: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  workflow: { name: string; triggerType: string };
  stepLogs: StepLog[];
}

export default function AdminAutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/workflows").then((r) => r.json()),
      fetch("/api/workflows/executions").then((r) => r.json()),
    ])
      .then(([wfRes, exRes]) => {
        if (wfRes.success) setWorkflows(wfRes.data);
        if (exRes.success) setExecutions(exRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function triggerExecution(workflowId: string) {
    setExecuting(workflowId);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/execute`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        // Refresh data after execution
        const [wfRes, exRes] = await Promise.all([
          fetch("/api/workflows").then((r) => r.json()),
          fetch("/api/workflows/executions").then((r) => r.json()),
        ]);
        if (wfRes.success) setWorkflows(wfRes.data);
        if (exRes.success) setExecutions(exRes.data);
      }
    } catch (err) {
      console.error("שגיאה בהפעלת אוטומציה:", err);
    } finally {
      setExecuting(null);
    }
  }

  if (loading) {
    return (
      <div className="px-4 md:px-8 pb-6 md:pb-8">
        <Topbar title="אוטומציות" subtitle="ניהול workflows ותזמונים" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const activeCount = workflows.filter((w) => w.status === "ACTIVE").length;
  const totalRuns = workflows.reduce((sum, w) => sum + (w.runCount ?? w._count?.executions ?? 0), 0);
  const successCount = executions.filter((e) => e.status === "COMPLETED").length;
  const successRate = executions.length > 0 ? ((successCount / executions.length) * 100).toFixed(1) : "0";

  const filteredWorkflows = filter === "all"
    ? workflows
    : filter === "active"
      ? workflows.filter((w) => w.status === "ACTIVE")
      : workflows.filter((w) => w.status !== "ACTIVE");

  const lastExec = executions.length > 0 ? executions[0] : null;
  const lastRunLabel = lastExec
    ? formatTimeAgo(new Date(lastExec.startedAt))
    : "—";

  function formatTimeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "הרגע";
    if (minutes < 60) return `${minutes} דק'`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} שעות`;
    const days = Math.floor(hours / 24);
    return `${days} ימים`;
  }

  return (
    <div className="px-4 md:px-8 pb-6 md:pb-8">
      <Topbar title="אוטומציות" subtitle="ניהול workflows ותזמונים" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Zap} label="אוטומציות פעילות" value={String(activeCount)} color="#2563eb" />
        <StatCard icon={Play} label="סה״כ הרצות" value={String(totalRuns)} color="#2ecc8f" />
        <StatCard icon={CheckCircle2} label="אחוז הצלחה" value={`${successRate}%`} color="#60a5fa" />
        <StatCard icon={Clock} label="הרצה אחרונה" value={lastRunLabel} color="#f5a623" />
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-5 mb-6 border-r-4 border-r-[#2563eb] flex items-center justify-between" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div>
          <h3 className="text-lg font-bold text-[#1e293b] mb-1">בנה אוטומציה חדשה</h3>
          <p className="text-sm text-[#64748b]">הגדר טריגר, תנאים ופעולות - והכל רץ לבד</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} /> צור אוטומציה
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-5 mb-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1e293b]">אוטומציות ({workflows.length})</h3>
          <div className="flex gap-2">
            {([
              { key: "all" as const, label: "הכל" },
              { key: "active" as const, label: "פעילות" },
              { key: "paused" as const, label: "מושהות" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.key ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#64748b] hover:bg-[#f8f9fc]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredWorkflows.length === 0 ? (
          <div className="text-center text-[#64748b] py-8">אין נתונים</div>
        ) : (
          <div className="space-y-3">
            {filteredWorkflows.map((wf) => (
              <div
                key={wf.id}
                className="p-4 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4] hover:border-[#2563eb]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      wf.status === "ACTIVE" ? "bg-[#eff6ff]" : "bg-[#e8ecf4]/30"
                    }`}>
                      <Zap size={17} className={wf.status === "ACTIVE" ? "text-[#2563eb]" : "text-[#64748b]"} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1e293b]">{wf.name}</div>
                      <div className="text-xs text-[#64748b]">טריגר: {wf.triggerType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="badge badge-purple">{wf.runCount ?? wf._count?.executions ?? 0} הרצות</span>
                    <span className="text-xs text-[#64748b]">
                      {wf.lastRunAt ? new Date(wf.lastRunAt).toLocaleDateString("he-IL") : "—"}
                    </span>
                    <button
                      onClick={() => triggerExecution(wf.id)}
                      disabled={executing === wf.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] transition-all disabled:opacity-50"
                      title="הפעל ידנית"
                    >
                      {executing === wf.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Play size={14} />
                      )}
                      הפעל ידנית
                    </button>
                    <button className="text-[#64748b] hover:text-[#2563eb]">
                      {wf.status === "ACTIVE" ? <ToggleRight size={22} className="text-[#2563eb]" /> : <ToggleLeft size={22} />}
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b]">
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
                {wf.steps && wf.steps.length > 0 && (
                  <div className="flex items-center gap-2 mr-12 text-xs text-[#64748b]">
                    <span className="badge badge-warning">טריגר</span>
                    <ArrowLeft size={12} className="text-[#64748b]" />
                    {wf.steps.map((step, i) => (
                      <span key={step.id} className="flex items-center gap-2">
                        <span className="badge badge-success">{step.actionType}</span>
                        {i < wf.steps.length - 1 && <ArrowLeft size={12} className="text-[#64748b]" />}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ecf4] p-5" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
        <h3 className="text-base font-bold text-[#1e293b] mb-4">הרצות אחרונות</h3>
        {executions.length === 0 ? (
          <div className="text-center text-[#64748b] py-8">אין נתונים</div>
        ) : (
          <div className="space-y-2">
            {executions.slice(0, 10).map((exec) => (
              <div key={exec.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f9fc] transition-colors">
                <div className="flex items-center gap-3">
                  {exec.status === "COMPLETED" ? (
                    <CheckCircle2 size={16} className="text-[#2ecc8f]" />
                  ) : exec.status === "FAILED" ? (
                    <div className="w-4 h-4 rounded-full bg-[#e8445a] flex items-center justify-center text-white text-[8px] font-bold">!</div>
                  ) : (
                    <Clock size={16} className="text-[#d97706]" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-[#1e293b]">{exec.workflow?.name ?? "—"}</div>
                    <div className="text-xs text-[#64748b]">{exec.workflow?.triggerType ?? "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${exec.status === "COMPLETED" ? "badge-success" : exec.status === "FAILED" ? "badge-danger" : "badge-warning"}`}>
                    {exec.status === "COMPLETED" ? "הצלחה" : exec.status === "FAILED" ? "שגיאה" : exec.status === "RUNNING" ? "רץ" : "ממתין"}
                  </span>
                  <span className="text-xs text-[#64748b]">
                    {new Date(exec.startedAt).toLocaleDateString("he-IL")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
