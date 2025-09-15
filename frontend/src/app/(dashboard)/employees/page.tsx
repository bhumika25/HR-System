'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { Modal } from '@/components/ui/Modal';
import { Employee } from '@/types';
import { createEmployee, deleteEmployee, getAllEmployees, updateEmployee } from '@/lib/api';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEmployees = async () => {
    try {
      const { employees, pagination } = await getAllEmployees({ page: currentPage, limit: 6 });
      setEmployees(employees);
      setTotalPages(pagination.pages);
    } catch (err: any) {
      console.error('Failed to fetch employees:', err);
      setError(err?.error || 'Failed to fetch employees');
    }
  };

  const handleAddEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
    try {
      const response = await createEmployee(employeeData);
      const newEmployee: Employee = 'employee' in response ? response.employee : response;
      setEmployees(prev => [...prev, newEmployee]);
      alert('Employee added successfully');
    } catch (err: any) {
      console.error('Failed to add employee:', err);
      alert(err?.error || 'Failed to add employee');
    }
  };


  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (
    employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!editingEmployee) return;

    try {

      const response = await updateEmployee(editingEmployee.id, employeeData);
      const updatedEmployee: Employee = 'employee' in response ? response.employee : response;

      setEmployees(prev =>
        prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
      );

      // Close modal
      setEditingEmployee(null);
      setIsEditModalOpen(false);

      alert('Employee updated successfully');
    } catch (err: any) {
      console.error('Failed to update employee:', err);
      alert(err?.error || 'Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await deleteEmployee(id);

      setEmployees(prev => prev.filter(emp => emp.id !== id));
      alert('Employee deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete employee:', err);
      alert(err?.error || 'Failed to delete employee');
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    fetchEmployees()
  }, [currentPage])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        <p className="mt-2 text-gray-600">Manage your company's employees</p>
      </div>

      {/* Add Employee Form */}
      <EmployeeForm onSubmit={handleAddEmployee} />

      {/* Employees Table */}
      {
        !error && <div>
          <h2 className="text-xl font-semibold mb-4">All Employees</h2>
          <EmployeeTable
            employees={employees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      }

      {/* Edit Modal */}
      {isEditModalOpen && editingEmployee && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCancelEdit}
          title="Edit Employee"
        >

          <EmployeeForm
            employee={editingEmployee}
            onSubmit={handleUpdateEmployee}
            onCancel={handleCancelEdit}
          />
        </Modal>
      )}
    </div>
  );
}
