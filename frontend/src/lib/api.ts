import { Employee, EmployeesResponse, LoginResponse, ProfileResponse, StatsResponse } from "@/types";
import { apiClient } from "./apiClient";

const AUTH_API_URL = 'http://localhost:3001/api/auth'; // adjust base URL if needed
const EMP_API_URL = 'http://localhost:3001/api/employees';
const STATS_API_URL = 'http://localhost:3001/api/stats'

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return apiClient<LoginResponse>(`${AUTH_API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

export const logout = async (): Promise<{ message: string }> => {
  return apiClient<{ message: string }>(`${AUTH_API_URL}/logout`, { method: 'POST' });
};

export const getProfile = async (): Promise<ProfileResponse> => {
  return apiClient<ProfileResponse>(`${AUTH_API_URL}/profile`);
};

export const getAllStats = async (): Promise<StatsResponse> => {
  return apiClient<StatsResponse>(STATS_API_URL);
};

export const getAllEmployees = async ({
  page = 1,
  limit = 10,
}: { page?: number; limit?: number }) => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  return apiClient<EmployeesResponse>(`${EMP_API_URL}?${params.toString()}`);
};

export const getEmployeeById = async (id: number) => {
  return apiClient<{ employee: Employee }>(`${EMP_API_URL}/${id}`);
};

export const createEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
  return apiClient<{ message: string; employee: Employee }>(EMP_API_URL, {
    method: 'POST',
    body: JSON.stringify(employeeData)
  });
};

export const updateEmployee = async (id: number, employeeData: Partial<Employee>) => {
  return apiClient<{
    id: number; message: string; employee: Employee 
}>(`${EMP_API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData)
  });
};

export const deleteEmployee = async (id: number) => {
  return apiClient<{ message: string }>(`${EMP_API_URL}/${id}`, {
    method: 'DELETE'
  });
};
