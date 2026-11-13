'use client';

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmployeeFiltersProps {
  search: string;
  department: string;
  status: string;
  departments: string[];
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  search,
  department,
  status,
  departments,
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(search || (department && department !== 'all') || (status && status !== 'all'));

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="block w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="block w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="block w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="w-full h-full py-2"
            leftIcon={<Filter className="w-3.5 h-3.5" />}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

