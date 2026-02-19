"use client";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  color: string;
}

export default function StatCard({ icon: Icon, label, value, change, trend, color }: StatCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              trend === "up" ? "text-emerald-500" : "text-red-400"
            }`}
          >
            {trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-extrabold text-[#1e1b3a] mb-1">{value}</div>
      <div className="text-xs text-[#9b98b8] font-medium">{label}</div>
    </div>
  );
}
