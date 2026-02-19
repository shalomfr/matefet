"use client";
import Topbar from "@/components/Topbar";
import { Settings, Building2, Users, Bell, Shield, Palette, Globe, CreditCard, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="הגדרות" />

      <div className="grid grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="card-dark p-4">
          <nav className="space-y-1">
            {[
              { icon: Building2, label: "פרטי עמותה", active: true },
              { icon: Users, label: "משתמשים והרשאות", active: false },
              { icon: Bell, label: "התראות", active: false },
              { icon: Shield, label: "אבטחה", active: false },
              { icon: Palette, label: "התאמה אישית", active: false },
              { icon: Globe, label: "שפה ואזור", active: false },
              { icon: CreditCard, label: "מנוי וחיוב", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? "bg-[#4a7cff]/10 text-[#4a7cff]"
                    : "text-[--color-muted] hover:bg-white/[0.04]"
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="col-span-3 space-y-6">
          {/* Organization Details */}
          <div className="card-dark p-6">
            <h3 className="text-base font-bold text-[--color-text] mb-5 flex items-center gap-2">
              <Building2 size={18} className="text-[#4a7cff]" />
              פרטי עמותה
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[--color-muted] mb-1.5">שם העמותה</label>
                <input className="dark-input" defaultValue="עמותת אור לקהילה" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[--color-muted] mb-1.5">מספר עמותה</label>
                <input className="dark-input" defaultValue="580123456" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[--color-muted] mb-1.5">כתובת</label>
                <input className="dark-input" defaultValue="רחוב הרצל 42, תל אביב" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[--color-muted] mb-1.5">טלפון</label>
                <input className="dark-input" defaultValue="03-1234567" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[--color-muted] mb-1.5">אימייל</label>
                <input className="dark-input" defaultValue="info@or-community.org.il" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[--color-muted] mb-1.5">אתר אינטרנט</label>
                <input className="dark-input" defaultValue="www.or-community.org.il" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-[--color-muted] mb-1.5">מטרות העמותה</label>
              <textarea
                className="dark-input !h-24 resize-none"
                defaultValue="קידום חינוך והעצמה קהילתית, סיוע לאוכלוסיות מוחלשות, הפעלת תכניות חינוכיות וחברתיות."
              />
            </div>
            <div className="flex justify-end mt-5">
              <button className="btn-primary flex items-center gap-2">
                <Save size={16} /> שמור שינויים
              </button>
            </div>
          </div>

          {/* Users */}
          <div className="card-dark p-6">
            <h3 className="text-base font-bold text-[--color-text] mb-5 flex items-center gap-2">
              <Users size={18} className="text-[#4a7cff]" />
              משתמשים והרשאות
            </h3>
            <div className="space-y-3">
              {[
                { name: "שלום כהן", email: "shalom@email.com", role: "מנהל ראשי", color: "from-[#4a7cff] to-[#7c5cfc]" },
                { name: "מרים לוי", email: "miriam@email.com", role: "גזברית", color: "from-[#2ecc8f] to-[#4a7cff]" },
                { name: "אברהם יצחקי", email: "avraham@email.com", role: "מזכיר", color: "from-[#f5a623] to-[#e8445a]" },
                { name: "דנה שרון", email: "dana@email.com", role: "צפייה בלבד", color: "from-[#a78bfa] to-[#4a7cff]" },
              ].map((user) => (
                <div key={user.email} className="flex items-center justify-between p-3 rounded-xl bg-[--color-surface2] border border-[--color-border]">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-sm font-bold`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[--color-text]">{user.name}</div>
                      <div className="text-xs text-[--color-muted]">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-info">{user.role}</span>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[--color-muted]">
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary w-full mt-4 flex items-center justify-center gap-2">
              <Users size={16} /> הזמן משתמש חדש
            </button>
          </div>

          {/* Subscription */}
          <div className="card-dark p-6">
            <h3 className="text-base font-bold text-[--color-text] mb-5 flex items-center gap-2">
              <CreditCard size={18} className="text-[#4a7cff]" />
              מנוי וחיוב
            </h3>
            <div className="p-4 rounded-xl bg-[#4a7cff]/10 border border-[#4a7cff]/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#4a7cff]">מנוי פרימיום</div>
                  <div className="text-xs text-[--color-muted]">כל הפיצ׳רים + תמיכה מועדפת</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-extrabold text-[#4a7cff]">₪299</div>
                  <div className="text-xs text-[--color-muted]">לחודש</div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-[--color-muted]">חיוב הבא: 01.03.2026 • כרטיס: **** 4532</div>
          </div>
        </div>
      </div>
    </>
  );
}
