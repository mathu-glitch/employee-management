import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: 'sky' | 'emerald' | 'amber' | 'indigo';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'sky',
  subtitle,
}) => {
  const variantStyles = {
    sky: {
      bgIcon: 'bg-sky-50 text-sky-600',
      border: 'border-sky-100',
      glow: 'group-hover:border-sky-300',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      glow: 'group-hover:border-emerald-300',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      glow: 'group-hover:border-amber-300',
    },
    indigo: {
      bgIcon: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
      glow: 'group-hover:border-indigo-300',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div
      className={`group relative bg-white p-6 rounded-xl border ${currentVariant.border} ${currentVariant.glow} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${currentVariant.bgIcon}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

