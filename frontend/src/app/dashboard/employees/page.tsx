'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import { Employee, PaginatedResponse, EmployeeFormData } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { EmployeeFilters } from '@/components/employees/EmployeeFilters';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { EmployeeFormModal } from '@/components/employees/EmployeeFormModal';
import { EmployeeViewModal } from '@/components/employees/EmployeeViewModal';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { UserPlus, RefreshCw } from 'lucide-react';

const DEFAULT_DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Product',
];

export default function EmployeesPage() {
  const { success, error } = useToast();

  // Employee data & pagination state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter state
  const [search, setSearch] = useState<string>('');
  const [department, setDepartment] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  // Available departments list (dynamically extended if new ones appear)
  const [departments, setDepartments] = useState<string[]>(DEFAULT_DEPARTMENTS);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch employees from API with server-side query params
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {
        page: currentPage,
        limit: pageSize,
      };

      if (search.trim()) {
        params.search = search.trim();
      }
      if (department && department !== 'all') {
        params.department = department;
      }
      if (status && status !== 'all') {
        params.status = status;
      }

      const data = await apiRequest<PaginatedResponse<Employee>>('/employees', { params });
      setEmployees(data.items);
      setTotalItems(data.total);
      setTotalPages(data.total_pages || 1);

      // Extract unique departments to populate filter options
      const fetchedDepts = data.items.map((e) => e.department).filter(Boolean);
      setDepartments((prev) => Array.from(new Set([...prev, ...fetchedDepts])));
    } catch (err: any) {
      error(err.message || 'Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, search, department, status, error]);

  // Refetch when filters or pagination change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle Search input (reset to page 1)
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  // Handle Department filter (reset to page 1)
  const handleDepartmentChange = (val: string) => {
    setDepartment(val);
    setCurrentPage(1);
  };

  // Handle Status filter (reset to page 1)
  const handleStatusChange = (val: string) => {
    setStatus(val);
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setDepartment('all');
    setStatus('all');
    setCurrentPage(1);
  };

  // Handle Page Size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Actions
  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsFormModalOpen(true);
  };

  const handleOpenView = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDeleteDialogOpen(true);
  };

  // Submit Add or Edit Form
  const handleFormSubmit = async (formData: EmployeeFormData) => {
    if (selectedEmployee) {
      // Edit mode (PUT)
      await apiRequest<Employee>(`/employees/${selectedEmployee.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      success(`Employee "${formData.name}" updated successfully.`);
    } else {
      // Create mode (POST)
      await apiRequest<Employee>('/employees', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      success(`Employee "${formData.name}" created successfully.`);
    }
    fetchEmployees();
  };

  // Confirm Deletion (DELETE)
  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;

    setIsDeleting(true);
    try {
      await apiRequest(`/employees/${selectedEmployee.id}`, {
        method: 'DELETE',
      });
      success(`Employee "${selectedEmployee.name}" deleted successfully.`);
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      // If we deleted the only item on the current page, step back
      if (employees.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchEmployees();
      }
    } catch (err: any) {
      error(err.message || 'Failed to delete employee.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Employee Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            View, search, filter, and manage employee records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEmployees}
            title="Refresh employee data"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <EmployeeFilters
        search={search}
        department={department}
        status={status}
        departments={departments}
        onSearchChange={handleSearchChange}
        onDepartmentChange={handleDepartmentChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
      />

      {/* Employee List Table */}
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Server-side Pagination */}
      {!isLoading && employees.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Add / Edit Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedEmployee}
        departments={departments}
      />

      {/* View Modal */}
      <EmployeeViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onEdit={(emp) => {
          setIsViewModalOpen(false);
          handleOpenEdit(emp);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Employee Record"
        message={`Are you sure you want to delete employee "${selectedEmployee?.name}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        isConfirming={isDeleting}
      />
    </div>
  );
}

