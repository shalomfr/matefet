"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
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
        // redirect to the right portal based on role, or to callbackUrl
        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          // fetch session to know the role
          const sessionRes = await fetch("/api/auth/session");
          const session = await sessionRes.json();
          const role = session?.user?.role;
          if (role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/portal");
          }
        }
        router.refresh();
        return;
      }
    } catch {
      setError("שגיאה בהתחברות");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#f8f9fc" }}>
      {/* background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[45%]" style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a5f 100%)" }}>
        <div className="absolute top-[-60px] left-[-40px] w-[200px] h-[200px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-80px] right-[10%] w-[300px] h-[300px] rounded-full bg-white/[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* logo */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-white font-[Frank_Ruhl_Libre,serif]">מעטפת</h1>
          <p className="text-white/60 text-[13px] mt-1">מעטפת ניהולית בע״מ</p>
        </div>

        {/* card */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-[#e8ecf4] p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#1e293b]">התחברות</h2>
            <p className="text-[13px] text-[#64748b] mt-1">הזן את פרטי הכניסה שלך</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">אימייל</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all"
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
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f2] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all"
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
              className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-60 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
            >
              {loading ? "מתחבר..." : "התחבר"}
            </button>
          </form>

          <p className="text-center text-sm text-[#64748b] mt-6">
            אין לך חשבון?{" "}
            <Link href="/register" className="text-[#2563eb] font-semibold hover:underline">
              הרשמה
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
