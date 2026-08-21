import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  subtitle?: string;
}

export default function DashboardCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
}: DashboardCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E9EDF7] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#707EAE]">{title}</p>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] transition-transform group-hover:scale-110 group-hover:bg-[#6366F1] group-hover:text-white">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
          {value}
        </p>

        {change && (
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              isPositive
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Optional Subtitle Footer */}
      {subtitle && (
        <p className="mt-2 text-xs font-medium text-[#94A3B8]">{subtitle}</p>
      )}

      {/* Subtle bottom gradient accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366F1] to-[#3965FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}