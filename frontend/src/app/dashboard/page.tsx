'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { Users, UserCheck, UserX, ArrowRight, Building, Plus } from 'lucide-react';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiRequest<DashboardStats>('/dashboard/stats');
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time workforce statistics and department metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/employees">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Manage Employees
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchStats}>
            Retry
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Employees"
          value={stats?.total_employees ?? 0}
          icon={Users}
          variant="sky"
          subtitle="All registered staff members"
        />
        <StatCard
          title="Active Employees"
          value={stats?.active_employees ?? 0}
          icon={UserCheck}
          variant="emerald"
          subtitle="Currently active status"
        />
        <StatCard
          title="Inactive Employees"
          value={stats?.inactive_employees ?? 0}
          icon={UserX}
          variant="amber"
          subtitle="On leave or former staff"
        />
      </div>

      {/* Department Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-800">
                Department Distribution
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {stats?.total_employees ?? 0} total headcount
            </span>
          </div>

          {stats && Object.keys(stats.department_counts).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.department_counts).map(([dept, count]) => {
                const total = stats.total_employees || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={dept} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{dept}</span>
                      <span className="text-slate-500 font-medium">
                        {count} employee{count > 1 ? 's' : ''} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-6 text-center">
              No department data available.
            </p>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">
              Quick Navigation
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Access employee records, filter by department, update employee details, or manage employment statuses.
            </p>

            <div className="space-y-3">
              <Link href="/dashboard/employees" className="block">
                <div className="p-3.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition cursor-pointer flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-sky-700">
                      View Employee Directory
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            System status: <span className="text-emerald-600 font-semibold">Online</span> • API v1
          </div>
        </div>
      </div>
    </div>
  );
}

