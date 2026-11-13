export type EmployeeStatus = 'Active' | 'Inactive';

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joining_date: string;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joining_date: string;
  status: EmployeeStatus;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface DashboardStats {
  total_employees: number;
  active_employees: number;
  inactive_employees: number;
  department_counts: Record<string, number>;
}

