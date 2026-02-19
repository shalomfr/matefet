"use client";
import Topbar from "@/components/Topbar";
import { Settings, Building2, Users, Bell, Shield, Palette, Globe, CreditCard, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="הגדרות" />

      <div className="grid grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="glass-card p-4">
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
                    ? "bg-[#7c5cfc]/10 text-[#7c5cfc]"
                    : "text-[#6b6894] hover:bg-white/40"
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
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-[#1e1b3a] mb-5 flex items-center gap-2">
              <Building2 size={18} className="text-[#7c5cfc]" />
              פרטי עמותה
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6b6894] mb-1.5">שם העמותה</label>
                <input className="glass-input" defaultValue="עמותת אור לקהילה" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6b6894] mb-1.5">מספר עמותה</label>
                <input className="glass-input" defaultValue="580123456" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6b6894] mb-1.5">כתובת</label>
                <input className="glass-input" defaultValue="רחוב הרצל 42, תל אביב" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6b6894] mb-1.5">טלפון</label>
                <input className="glass-input" defaultValue="03-1234567" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6b6894] mb-1.5">אימייל</label>
                <input className="glass-input" defaultValue="info@or-community.org.il" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6b6894] mb-1.5">אתר אינטרנט</label>
                <input className="glass-input" defaultValue="www.or-community.org.il" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#6b6894] mb-1.5">מטרות העמותה</label>
              <textarea
                className="glass-input !h-24 resize-none"
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
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-[#1e1b3a] mb-5 flex items-center gap-2">
              <Users size={18} className="text-[#7c5cfc]" />
              משתמשים והרשאות
            </h3>
            <div className="space-y-3">
              {[
                { name: "שלום כהן", email: "shalom@email.com", role: "מנהל ראשי", color: "from-[#7c5cfc] to-[#a78bfa]" },
                { name: "מרים לוי", email: "miriam@email.com", role: "גזברית", color: "from-[#e879f9] to-[#a78bfa]" },
                { name: "אברהם יצחקי", email: "avraham@email.com", role: "מזכיר", color: "from-[#60a5fa] to-[#818cf8]" },
                { name: "דנה שרון", email: "dana@email.com", role: "צפייה בלבד", color: "from-[#34d399] to-[#60a5fa]" },
              ].map((user) => (
                <div key={user.email} className="flex items-center justify-between p-3 rounded-xl bg-white/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-sm font-bold`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1e1b3a]">{user.name}</div>
                      <div className="text-xs text-[#9b98b8]">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-purple">{user.role}</span>
                    <button className="p-1.5 rounded-lg hover:bg-white/60 text-[#9b98b8]">
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
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-[#1e1b3a] mb-5 flex items-center gap-2">
              <CreditCard size={18} className="text-[#7c5cfc]" />
              מנוי וחיוב
            </h3>
            <div className="p-4 rounded-xl bg-gradient-to-l from-[#7c5cfc]/10 to-[#a78bfa]/5 border border-[#7c5cfc]/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#7c5cfc]">מנוי פרימיום</div>
                  <div className="text-xs text-[#9b98b8]">כל הפיצ׳רים + תמיכה מועדפת</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-extrabold text-[#7c5cfc]">₪299</div>
                  <div className="text-xs text-[#9b98b8]">לחודש</div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-[#9b98b8]">חיוב הבא: 01.03.2026 • כרטיס: **** 4532</div>
          </div>
        </div>
      </div>
    </>
  );
}
