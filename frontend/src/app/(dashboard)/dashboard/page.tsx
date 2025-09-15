'use client';

import React, { useEffect, useState } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { getAllEmployees, getAllStats } from '@/lib/api';
import { Employee, StatsResponse } from '@/types';

export default function DashboardPage() {

  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [error, setError] = useState('');

  const fetchRecentEmployees = async () => {
    try {
      const statsData = await getAllStats();
      setStats(statsData);

      const { employees } = await getAllEmployees({ page: 1, limit: 100 });
      setAllEmployees(employees)
      const recent = employees
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      setRecentEmployees(recent);
    } catch (err: any) {
      console.error('Failed to fetch employees:', err);
      setError(err?.error || 'Failed to fetch employees');
    }
  };


  useEffect(() => {
    fetchRecentEmployees();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your HR metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Employees"
          value={stats?.employeeStats.totalEmployees || 0}
          icon="👥"
        />
        <StatsCard
          title="Departments"
          value={stats?.employeeStats?.totalDepartments || 0}
          icon="🏢"
        />
        <StatsCard
          title="Average Salary"
          value={formatCurrency(stats?.employeeStats?.averageSalary || 0)}
          icon="💰"
        />
      </div>

      {/* Recent Employees */}
      {error ? <div> Error </div> :
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Hires</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(employee.salary)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>}


      {/* Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Department Distribution</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                allEmployees.reduce((acc, emp) => {
                  acc[emp.department] = (acc[emp.department] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-gray-700">{dept}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / allEmployees.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Salary Overview</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Highest Salary</span>
                <span className="font-medium">
                  {formatCurrency(Math.max(...allEmployees.map(emp => emp.salary)))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lowest Salary</span>
                <span className="font-medium">
                  {formatCurrency(Math.min(...allEmployees.map(emp => emp.salary)))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Salary</span>
                <span className="font-medium">
                  {formatCurrency(stats?.employeeStats?.averageSalary || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Payroll</span>
                <span className="font-medium">
                  {formatCurrency(allEmployees.reduce((sum, emp) => sum + Number(emp.salary), 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

