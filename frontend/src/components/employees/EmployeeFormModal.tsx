'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Employee, EmployeeFormData, EmployeeStatus } from '@/lib/types';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Employee | null;
  departments: string[];
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  departments,
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    phone: '',
    department: departments[0] || 'Engineering',
    designation: '',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        department: initialData.department,
        designation: initialData.designation,
        joining_date: initialData.joining_date,
        status: initialData.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: departments[0] || 'Engineering',
        designation: '',
        joining_date: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
    }
    setErrors({});
    setServerError(null);
  }, [initialData, isOpen, departments]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Employee name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    // Phone validation (digits, +, -, parentheses, 7 to 20 chars)
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,20}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number (at least 7 digits)';
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    // Designation validation
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    // Joining Date validation
    if (!formData.joining_date) {
      newErrors.joining_date = 'Joining date is required';
    } else {
      const dateVal = new Date(formData.joining_date);
      if (isNaN(dateVal.getTime())) {
        newErrors.joining_date = 'Invalid date format';
      }
    }

    // Status validation
    if (!['Active', 'Inactive'].includes(formData.status)) {
      newErrors.status = 'Status must be either Active or Inactive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      const message = err.message || 'Failed to save employee. Please try again.';
      setServerError(message);
      if (message.toLowerCase().includes('email') && message.toLowerCase().includes('already exists')) {
        setErrors((prev) => ({ ...prev, email: message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Employee Details' : 'Add New Employee'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Jane Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. jane.doe@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="e.g. +1-555-0199"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            required
          />

          <Input
            label="Joining Date"
            type="date"
            value={formData.joining_date}
            onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
            error={errors.joining_date}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <input
              list="department-options"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className={`block w-full rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 px-3.5 py-2.5 bg-white ${
                errors.department
                  ? 'border-rose-300 text-rose-900 focus:ring-rose-500'
                  : 'border-slate-300 text-slate-900 focus:ring-sky-500'
              }`}
              placeholder="Select or type department"
              required
            />
            <datalist id="department-options">
              {departments.map((dept) => (
                <option key={dept} value={dept} />
              ))}
            </datalist>
            {errors.department && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.department}</p>
            )}
          </div>

          <Input
            label="Designation / Role"
            placeholder="e.g. Senior Software Engineer"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            error={errors.designation}
            required
          />
        </div>

        <div>
          <Select
            label="Employment Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            error={errors.status}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

