import React from 'react';
import { EmployeeStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: EmployeeStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isActive = status === 'Active';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-slate-100 text-slate-600 border border-slate-200'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};

