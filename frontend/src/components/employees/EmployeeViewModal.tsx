'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Employee } from '@/lib/types';
import { Mail, Phone, Calendar, Building, Briefcase, Hash, Clock } from 'lucide-react';

interface EmployeeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit?: (employee: Employee) => void;
}

export const EmployeeViewModal: React.FC<EmployeeViewModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
}) => {
  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Profile Details" maxWidth="md">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 font-extrabold text-xl flex items-center justify-center shrink-0 border-2 border-sky-200">
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">{employee.name}</h4>
            <p className="text-sm font-medium text-slate-500">{employee.designation}</p>
            <div className="mt-1">
              <StatusBadge status={employee.status} />
            </div>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Email Address</span>
            </div>
            <p className="font-semibold text-slate-800 break-all">{employee.email}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Phone Number</span>
            </div>
            <p className="font-semibold text-slate-800">{employee.phone}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Department</span>
            </div>
            <p className="font-semibold text-slate-800">{employee.department}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>Designation</span>
            </div>
            <p className="font-semibold text-slate-800">{employee.designation}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Joining Date</span>
            </div>
            <p className="font-semibold text-slate-800">{employee.joining_date}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span>Employee System ID</span>
            </div>
            <p className="font-semibold text-slate-800">#{employee.id}</p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
          <span>Created: {new Date(employee.created_at).toLocaleString()}</span>
          <span>Updated: {new Date(employee.updated_at).toLocaleString()}</span>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
            >
              Edit Details
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

