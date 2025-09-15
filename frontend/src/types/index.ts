export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  createdAt: string;
  hireDate: string;
}

export interface EmployeesResponse {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginResponse {
  message: string;
  user: User & { employee?: Employee };
  token: string;
}

export interface ProfileResponse {
  user: User & { employee?: Employee };
}

export interface StatsResponse {
  employeeStats: {
    totalEmployees: number;
    averageSalary: number;
    totalSalary: number;
    totalDepartments: number;
    highestSalary: number;
    lowestSalary: number;
  };
}
