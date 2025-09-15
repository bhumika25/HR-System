const { PrismaClient } = require('@prisma/client');
const { validateEmployee } = require('../utils.js/validation');

const prisma = new PrismaClient();
const getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.employee.count()
    ]);

    res.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    
    // Validate input
    const validationErrors = validateEmployee(employeeData);
    console.log('validation', validationErrors)
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: employeeData.email }
    });

    if (existingEmployee) {
      return res.status(409).json({ error: 'Employee with this email already exists' });
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        name: employeeData.name.trim(),
        email: employeeData.email.toLowerCase().trim(),
        position: employeeData.position.trim(),
        department: employeeData.department.trim(),
        salary: parseFloat(employeeData.salary),
        hireDate: new Date(employeeData.hireDate)
      }
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Employee with this email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeData = req.body;
    
    // Validate input
    const validationErrors = validateEmployee(employeeData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if email is being changed and if it conflicts with another employee
    if (employeeData.email !== existingEmployee.email) {
      const emailConflict = await prisma.employee.findUnique({
        where: { email: employeeData.email }
      });

      if (emailConflict) {
        return res.status(409).json({ error: 'Employee with this email already exists' });
      }
    }

    // Update employee
    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name: employeeData.name.trim(),
        email: employeeData.email.toLowerCase().trim(),
        position: employeeData.position.trim(),
        department: employeeData.department.trim(),
        salary: parseFloat(employeeData.salary),
        hireDate: new Date(employeeData.hireDate)
      }
    });

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Employee with this email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Delete employee
    await prisma.employee.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};