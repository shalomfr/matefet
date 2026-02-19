"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/* ─── Envelope Animation Component (infinite loop) ─── */
function EnvelopeAnimation() {
  return (
    <div className="envelope-scene">
      <div className="env">
        {/* paper with checkmark – sits behind the body, slides up */}
        <div className="env-paper">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" className="env-check-circle" />
            <path d="M12 20.5L18 26.5L28 14.5" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="env-check-mark" />
          </svg>
        </div>

        {/* envelope back */}
        <div className="env-back" />

        {/* envelope front V-fold */}
        <div className="env-front" />

        {/* flap (triangle that opens) */}
        <div className="env-flap-wrap">
          <div className="env-flap" />
        </div>
      </div>

      <style>{`
        .envelope-scene {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          height: 110px;
          margin-bottom: 8px;
          perspective: 600px;
        }

        .env {
          position: relative;
          width: 96px;
          height: 70px;
        }

        /* ── back wall ── */
        .env-back {
          position: absolute;
          inset: 0;
          top: 14px;
          background: linear-gradient(180deg, #dbeafe 0%, #eff6ff 100%);
          border-radius: 4px 4px 12px 12px;
          box-shadow: 0 6px 28px rgba(37, 99, 235, 0.18);
          z-index: 1;
        }

        /* ── front V fold ── */
        .env-front {
          position: absolute;
          top: 14px;
          left: 0;
          width: 96px;
          height: 56px;
          z-index: 3;
          clip-path: polygon(0 20%, 50% 85%, 100% 20%, 100% 100%, 0 100%);
          background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
          border-radius: 0 0 12px 12px;
        }

        /* ── paper ── */
        .env-paper {
          position: absolute;
          left: 50%;
          bottom: 16px;
          width: 60px;
          height: 60px;
          margin-left: -30px;
          background: #ffffff;
          border: 1.5px solid #e8ecf4;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          animation: paperLoop 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* ── flap wrapper (provides perspective anchor) ── */
        .env-flap-wrap {
          position: absolute;
          top: 14px;
          left: 0;
          width: 96px;
          height: 0;
          z-index: 4;
          perspective: 400px;
        }

        .env-flap {
          width: 0;
          height: 0;
          border-left: 48px solid transparent;
          border-right: 48px solid transparent;
          border-top: 34px solid #bfdbfe;
          transform-origin: top center;
          animation: flapLoop 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* ── checkmark parts ── */
        .env-check-circle {
          opacity: 0;
          animation: checkCircleLoop 5s ease infinite;
        }

        .env-check-mark {
          stroke-dasharray: 34;
          stroke-dashoffset: 34;
          animation: checkDrawLoop 5s ease infinite;
        }

        /* ═══════ KEYFRAMES ═══════ */

        /* Flap: closed → open → closed
           0-10%   closed (waiting)
           10-25%  opens
           25-65%  stays open
           65-80%  closes
           80-100% stays closed */
        @keyframes flapLoop {
          0%, 10%   { transform: rotateX(0deg); }
          25%       { transform: rotateX(170deg); }
          65%       { transform: rotateX(170deg); }
          80%, 100% { transform: rotateX(0deg); }
        }

        /* Paper: inside → slides up → slides back
           0-15%   inside
           15-35%  slides up
           35-60%  stays up
           60-78%  slides down
           78-100% stays inside */
        @keyframes paperLoop {
          0%, 15%   { transform: translateY(0); }
          35%       { transform: translateY(-44px); }
          60%       { transform: translateY(-44px); }
          78%, 100% { transform: translateY(0); }
        }

        /* Check circle: invisible → appears → disappears
           0-30%   invisible
           35-40%  appears
           55-60%  disappears
           60-100% invisible */
        @keyframes checkCircleLoop {
          0%, 30%   { opacity: 0; }
          38%, 55%  { opacity: 1; }
          63%, 100% { opacity: 0; }
        }

        /* Check mark: hidden → draws → hides
           0-35%   hidden
           35-48%  draws in
           55-60%  un-draws
           60-100% hidden */
        @keyframes checkDrawLoop {
          0%, 35%   { stroke-dashoffset: 34; }
          48%, 55%  { stroke-dashoffset: 0; }
          65%, 100% { stroke-dashoffset: 34; }
        }
      `}</style>
    </div>
  );
}

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
        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
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
        {/* card */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-[#e8ecf4] p-8">
          {/* envelope animation as logo */}
          <EnvelopeAnimation />

          <div className="text-center mb-6">
            <h1 className="text-[24px] font-extrabold text-[#1e293b]">מעטפת</h1>
            <p className="text-[13px] text-[#64748b] mt-1">מעטפת ניהולית בע״מ</p>
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
