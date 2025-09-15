// src/controllers/statsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllStats = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: { salary: true, department: true, position: true }
    });

    if (employees.length === 0) {
      return res.json({
        employeeStats: {
          totalEmployees: 0,
          averageSalary: 0,
          totalSalary: 0,
          totalDepartments: 0,
          highestSalary: 0,
          lowestSalary: 0
        },
      });
    }

    // Employee stats
    const salaries = employees.map(emp => emp.salary);
    const totalSalary = salaries.reduce((sum, s) => sum + Number(s), 0);
    const averageSalary = totalSalary / employees.length;
    const highestSalary = Math.max(...salaries);
    const lowestSalary = Math.min(...salaries);
    const departments = [...new Set(employees.map(emp => emp.department))];

    const employeeStats = {
      totalEmployees: employees.length,
      averageSalary: parseFloat(averageSalary.toFixed(2)),
      totalSalary: parseFloat(totalSalary.toFixed(2)),
      totalDepartments: departments.length,
      highestSalary,
      lowestSalary
    };

    res.json({
      employeeStats,
    });
  } catch (error) {
    console.error('Get all stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllStats };
