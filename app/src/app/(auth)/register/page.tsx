"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
    organizationNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          organizationName: form.organizationName,
          organizationNumber: form.organizationNumber || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "שגיאה ברישום");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("שגיאה בתקשורת");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#e8ecf4] p-8 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-[#1e293b]">הבקשה נשלחה!</h2>
          <p className="text-[#64748b] mt-2">
            תקבל עדכון במייל לאחר אישור הבקשה. מפנה להתחברות...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#e8ecf4] p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1e293b]">הרשמת עמותה</h1>
          <p className="text-[#64748b] mt-1">מעטפת ניהולית</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-2">שם מלא</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#5c3d9a]/30 focus:border-[#5c3d9a]"
              placeholder="ישראל ישראלי"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-2">אימייל</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#5c3d9a]/30 focus:border-[#5c3d9a]"
              placeholder="you@example.com"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-2">סיסמה</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#5c3d9a]/30 focus:border-[#5c3d9a]"
              placeholder="מינימום 6 תווים"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-2">שם העמותה</label>
            <input
              type="text"
              value={form.organizationName}
              onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#5c3d9a]/30 focus:border-[#5c3d9a]"
              placeholder="עמותת XYZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#64748b] mb-2">מספר עמותה (אופציונלי)</label>
            <input
              type="text"
              value={form.organizationNumber}
              onChange={(e) => setForm((f) => ({ ...f, organizationNumber: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#5c3d9a]/30 focus:border-[#5c3d9a]"
              placeholder="580123456"
            />
          </div>

          {error && (
            <div className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#5c3d9a] text-white font-semibold hover:bg-[#4a2d7a] disabled:opacity-60 transition-colors"
          >
            {loading ? "שולח..." : "שלח בקשה"}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748b] mt-6">
          כבר רשום?{" "}
          <Link href="/login" className="text-[#5c3d9a] font-semibold hover:underline">
            התחברות
          </Link>
        </p>
      </div>
    </div>
  );
}
