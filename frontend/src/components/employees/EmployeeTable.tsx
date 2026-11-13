'use client';

import React from 'react';
import { Employee } from '@/lib/types';
import { StatusBadge } from '../ui/StatusBadge';
import { Eye, Edit2, Trash2, Mail, Phone, Calendar, Briefcase, Building } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-500 border-t-transparent mb-3" />
          <p className="text-sm text-slate-500">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No employees found</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          No records match the current search or filter criteria. Try adjusting your search query or reset the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50/75">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Name & Designation
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Contact Info
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Joining Date
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/75 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {emp.name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {emp.designation}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.department}</span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.joining_date}</span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={emp.status} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(emp)}
                      className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                      title="View employee profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(emp)}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      title="Edit employee"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(emp)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

