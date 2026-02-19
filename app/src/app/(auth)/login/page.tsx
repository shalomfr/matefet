"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/* ─── Envelope Animation Component ─── */
function EnvelopeAnimation() {
  return (
    <div className="envelope-wrapper">
      <div className="envelope-container">
        {/* envelope body */}
        <div className="envelope-body">
          {/* inner paper with checkmark */}
          <div className="envelope-paper">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="checkmark-svg">
              <circle cx="18" cy="18" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" className="check-circle" />
              <path d="M11 18.5L16 23.5L25 13.5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-path" />
            </svg>
          </div>
          {/* envelope front */}
          <div className="envelope-front" />
        </div>
        {/* flap */}
        <div className="envelope-flap" />
      </div>

      <style>{`
        .envelope-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
        }

        .envelope-container {
          position: relative;
          width: 80px;
          height: 60px;
        }

        /* envelope body (back + sides) */
        .envelope-body {
          position: absolute;
          bottom: 0;
          width: 80px;
          height: 52px;
          background: white;
          border-radius: 4px 4px 10px 10px;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15);
          overflow: hidden;
          z-index: 2;
        }

        /* envelope front (V shape at bottom) */
        .envelope-front {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(135deg, transparent 33%, #eff6ff 33%, #eff6ff 34%, transparent 34%),
                      linear-gradient(225deg, transparent 33%, #eff6ff 33%, #eff6ff 34%, transparent 34%),
                      linear-gradient(to bottom, transparent 50%, #eff6ff 50%);
          z-index: 3;
        }

        /* paper that slides up */
        .envelope-paper {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%) translateY(0);
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 6px;
          border: 1.5px solid #e8ecf4;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          animation: paperSlideUp 2s cubic-bezier(0.22, 1, 0.36, 1) 1s both;
        }

        /* flap (top triangle) */
        .envelope-flap {
          position: absolute;
          top: 8px;
          left: 0;
          width: 0;
          height: 0;
          border-left: 40px solid transparent;
          border-right: 40px solid transparent;
          border-top: 30px solid #dbeafe;
          z-index: 4;
          transform-origin: top center;
          animation: flapOpen 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
        }

        /* checkmark circle */
        .check-circle {
          opacity: 0;
          animation: circleAppear 0.5s ease 2s both;
        }

        /* checkmark path */
        .check-path {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: drawCheck 0.6s cubic-bezier(0.22, 1, 0.36, 1) 2.2s both;
        }

        @keyframes flapOpen {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(180deg);
            border-top-color: #bfdbfe;
          }
        }

        @keyframes paperSlideUp {
          0% {
            transform: translateX(-50%) translateY(0);
          }
          100% {
            transform: translateX(-50%) translateY(-30px);
          }
        }

        @keyframes circleAppear {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes drawCheck {
          0% {
            stroke-dashoffset: 30;
          }
          100% {
            stroke-dashoffset: 0;
          }
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
        {/* logo with envelope animation */}
        <div className="text-center mb-8">
          <EnvelopeAnimation />
          <h1 className="text-[28px] font-bold text-white">מעטפת</h1>
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
