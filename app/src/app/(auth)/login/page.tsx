"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "אימייל או סיסמה שגויים" : res.error);
        setLoading(false);
        return;
      }

      if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
        return;
      }
    } catch {
      setError("שגיאה בהתחברות");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#e8ecf4] p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1e293b]">התחברות</h1>
          <p className="text-[#64748b] mt-1">מעטפת ניהולית</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-2">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#5c3d9a]/30 focus:border-[#5c3d9a]"
              placeholder="••••••••"
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
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748b] mt-6">
          אין לך חשבון?{" "}
          <Link href="/register" className="text-[#5c3d9a] font-semibold hover:underline">
            הרשמה
          </Link>
        </p>
      </div>
    </div>
  );
}
