"use client";
import { useState, useEffect, useCallback } from "react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { useToast } from "@/components/Toast";
import { Zap, Play, CheckCircle2, Clock, Plus, Settings, ArrowLeft, ToggleRight, ToggleLeft, Loader2, X, Trash2 } from "lucide-react";

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

const TRIGGER_TYPES = [
  { value: "COMPLIANCE_EXPIRY", label: "תפוגת רגולציה" },
  { value: "DONATION_RECEIVED", label: "תרומה התקבלה" },
  { value: "MEETING_SCHEDULED", label: "פגישה נקבעה" },
  { value: "DOCUMENT_UPLOADED", label: "מסמך הועלה" },
  { value: "MANUAL", label: "ידני" },
  { value: "SCHEDULED", label: "מתוזמן" },
];

export default function AdminAutomationPage() {
  const { showSuccess, showError } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTriggerType, setFormTriggerType] = useState("MANUAL");
  const [formStatus, setFormStatus] = useState("ACTIVE");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [wfRes, exRes] = await Promise.all([
        fetch("/api/workflows").then((r) => r.json()),
        fetch("/api/workflows/executions").then((r) => r.json()),
      ]);
      if (wfRes.success) setWorkflows(wfRes.data);
      if (exRes.success) setExecutions(exRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function triggerExecution(workflowId: string) {
    setExecuting(workflowId);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/execute`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showSuccess("האוטומציה הופעלה בהצלחה");
        await fetchData();
      } else {
        showError(data.error ?? "שגיאה בהפעלת אוטומציה");
      }
    } catch (err) {
      console.error("שגיאה בהפעלת אוטומציה:", err);
      showError("שגיאה בהפעלת אוטומציה");
    } finally {
      setExecuting(null);
    }
  }

  async function toggleWorkflowStatus(wf: Workflow) {
    const newStatus = wf.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      const res = await fetch(`/api/workflows/${wf.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(newStatus === "ACTIVE" ? "האוטומציה הופעלה" : "האוטומציה הושהתה");
        await fetchData();
      } else {
        showError(data.error ?? "שגיאה בשינוי סטטוס");
      }
    } catch {
      showError("שגיאה בשינוי סטטוס");
    }
  }

  function openCreateModal() {
    setFormName("");
    setFormDescription("");
    setFormTriggerType("MANUAL");
    setFormStatus("ACTIVE");
    setShowCreateModal(true);
  }

  function openSettingsModal(wf: Workflow) {
    setSelectedWorkflow(wf);
    setFormName(wf.name);
    setFormDescription(wf.description ?? "");
    setFormTriggerType(wf.triggerType);
    setFormStatus(wf.status);
    setShowSettingsModal(true);
  }

  function openDeleteConfirm(wf: Workflow) {
    setSelectedWorkflow(wf);
    setShowDeleteConfirm(true);
  }

  async function handleCreateWorkflow() {
    if (!formName.trim()) {
      showError("יש להזין שם לאוטומציה");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim() || null,
          triggerType: formTriggerType,
          status: formStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("האוטומציה נוצרה בהצלחה");
        setShowCreateModal(false);
        await fetchData();
      } else {
        showError(data.error ?? "שגיאה ביצירת אוטומציה");
      }
    } catch {
      showError("שגיאה ביצירת אוטומציה");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateWorkflow() {
    if (!selectedWorkflow || !formName.trim()) {
      showError("יש להזין שם לאוטומציה");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/workflows/${selectedWorkflow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim() || null,
          triggerType: formTriggerType,
          status: formStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("האוטומציה עודכנה בהצלחה");
        setShowSettingsModal(false);
        await fetchData();
      } else {
        showError(data.error ?? "שגיאה בעדכון אוטומציה");
      }
    } catch {
      showError("שגיאה בעדכון אוטומציה");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteWorkflow() {
    if (!selectedWorkflow) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/workflows/${selectedWorkflow.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("האוטומציה נמחקה בהצלחה");
        setShowDeleteConfirm(false);
        await fetchData();
      } else {
        showError(data.error ?? "שגיאה במחיקת אוטומציה");
      }
    } catch {
      showError("שגיאה במחיקת אוטומציה");
    } finally {
      setSubmitting(false);
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
  const successCount = executions.filter((e) => e.status === "SUCCESS").length;
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
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
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
                    <button
                      onClick={() => toggleWorkflowStatus(wf)}
                      className="text-[#64748b] hover:text-[#2563eb]"
                      title={wf.status === "ACTIVE" ? "השהה" : "הפעל"}
                    >
                      {wf.status === "ACTIVE" ? <ToggleRight size={22} className="text-[#2563eb]" /> : <ToggleLeft size={22} />}
                    </button>
                    <button
                      onClick={() => openSettingsModal(wf)}
                      className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b] hover:text-[#2563eb] transition-colors"
                      title="הגדרות"
                    >
                      <Settings size={14} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(wf)}
                      className="p-1.5 rounded-lg hover:bg-[#fef2f2] text-[#64748b] hover:text-[#e8445a] transition-colors"
                      title="מחק"
                    >
                      <Trash2 size={14} />
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
                  {exec.status === "SUCCESS" ? (
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
                  <span className={`badge ${exec.status === "SUCCESS" ? "badge-success" : exec.status === "FAILED" ? "badge-danger" : "badge-warning"}`}>
                    {exec.status === "SUCCESS" ? "הצלחה" : exec.status === "FAILED" ? "שגיאה" : exec.status === "RUNNING" ? "רץ" : "ממתין"}
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

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl border border-[#e8ecf4] w-full max-w-md p-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1e293b]">צור אוטומציה חדשה</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">שם האוטומציה</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="לדוגמה: שליחת תזכורת תפוגת רישיון"
                  className="w-full px-4 py-2.5 text-sm border border-[#e8ecf4] rounded-xl bg-[#f8f9fc] focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">תיאור</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="תיאור קצר של האוטומציה..."
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-[#e8ecf4] rounded-xl bg-[#f8f9fc] focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">סוג טריגר</label>
                <select
                  value={formTriggerType}
                  onChange={(e) => setFormTriggerType(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[#e8ecf4] rounded-xl bg-[#f8f9fc] focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all"
                >
                  {TRIGGER_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">סטטוס</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[#e8ecf4] rounded-xl bg-[#f8f9fc] focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all"
                >
                  <option value="ACTIVE">פעיל</option>
                  <option value="PAUSED">מושהה</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCreateWorkflow}
                disabled={submitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Plus size={16} />
                )}
                צור אוטומציה
              </button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-[#64748b] hover:text-[#1e293b] transition-colors">
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings / Edit Workflow Modal */}
      {showSettingsModal && selectedWorkflow && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-2xl border border-[#e8ecf4] w-full max-w-md p-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1e293b]">הגדרות אוטומציה</h3>
              <button onClick={() => setShowSettingsModal(false)} className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#64748b]">
                <X size={18} />
              </button>
            </div>

            {/* Workflow info */}
            <div className="mb-4 p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e8ecf4]/50">
              <div className="grid grid-cols-2 gap-2 text-xs text-[#64748b]">
                <div>
                  <span className="font-medium">נוצר:</span>{" "}
                  {new Date(selectedWorkflow.createdAt).toLocaleDateString("he-IL")}
                </div>
                <div>
                  <span className="font-medium">הרצות:</span>{" "}
                  {selectedWorkflow.runCount ?? selectedWorkflow._count?.executions ?? 0}
                </div>
                <div>
                  <span className="font-medium">סטטוס:</span>{" "}
                  {selectedWorkflow.status === "ACTIVE" ? "פעיל" : "מושהה"}
                </div>
                <div>
                  <span className="font-medium">הרצה אחרונה:</span>{" "}
                  {selectedWorkflow.lastRunAt ? new Date(selectedWorkflow.lastRunAt).toLocaleDateString("he-IL") : "—"}
                </div>
              </div>
              {selectedWorkflow.steps && selectedWorkflow.steps.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#e8ecf4]">
                  <div className="text-xs font-medium text-[#64748b] mb-1">צעדים:</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedWorkflow.steps.map((step, i) => (
                      <span key={step.id} className="flex items-center gap-1">
                        <span className="badge badge-success text-[10px]">{step.actionType}</span>
                        {i < selectedWorkflow.steps.length - 1 && <ArrowLeft size={10} className="text-[#64748b]" />}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">שם האוטומציה</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[#e8ecf4] rounded-xl bg-[#f8f9fc] focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">תיאור</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-[#e8ecf4] rounded-xl bg-[#f8f9fc] focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">סוג טריגר</label>
                <select
                  value={formTriggerType}
                  onChange={(e) => setFormTriggerType(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[#e8ecf4] rounded-xl bg-[#f8f9fc] focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all"
                >
                  {TRIGGER_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">סטטוס</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[#e8ecf4] rounded-xl bg-[#f8f9fc] focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all"
                >
                  <option value="ACTIVE">פעיל</option>
                  <option value="PAUSED">מושהה</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleUpdateWorkflow}
                disabled={submitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Settings size={16} />
                )}
                שמור שינויים
              </button>
              <button onClick={() => setShowSettingsModal(false)} className="px-4 py-2 text-sm font-medium text-[#64748b] hover:text-[#1e293b] transition-colors">
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && selectedWorkflow && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl border border-[#e8ecf4] w-full max-w-sm p-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#fef2f2] flex items-center justify-center">
                <Trash2 size={18} className="text-[#e8445a]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1e293b]">מחיקת אוטומציה</h3>
                <p className="text-sm text-[#64748b]">פעולה זו לא ניתנת לביטול</p>
              </div>
            </div>
            <p className="text-sm text-[#1e293b] mb-6">
              האם אתה בטוח שברצונך למחוק את <span className="font-bold">{selectedWorkflow.name}</span>?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteWorkflow}
                disabled={submitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#e8445a] rounded-xl hover:bg-[#dc2626] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Trash2 size={14} />
                )}
                מחק
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm font-medium text-[#64748b] hover:text-[#1e293b] transition-colors">
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
