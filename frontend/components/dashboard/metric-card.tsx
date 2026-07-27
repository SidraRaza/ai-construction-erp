import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  gradient?: string;
}

export function MetricCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  gradient = "from-amber-500/10 to-orange-500/5",
}: MetricCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} border border-slate-800 p-5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:shadow-2xl`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-amber-400 shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
        {change && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
