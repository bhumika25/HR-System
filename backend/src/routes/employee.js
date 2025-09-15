const express = require('express');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const authenticateToken = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

const router = express.Router();

const validateEmployeeId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }
  
  const employeeId = parseInt(id);
  if (isNaN(employeeId) || employeeId <= 0) {
    return res.status(400).json({ error: 'Invalid employee ID format' });
  }
  
  req.employeeId = employeeId;
  next();
};

// All routes require authentication
router.use(authenticateToken);

// GET /api/employees 
router.get('/', async (req, res, next) => {
  try {
    await getAllEmployees(req, res);
  } catch (error) {
    next(error);
  }
});


// POST /api/employees - Create new employee (Admin only)
router.post('/', requireRole('ADMIN'), async (req, res, next) => {
  try {
    await createEmployee(req, res);
  } catch (error) {
    next(error);
  }
});

// PUT /api/employees/:id - Update employee (Admin only)
router.put('/:id', requireRole('ADMIN'), validateEmployeeId, async (req, res, next) => {
  try {
    await updateEmployee(req, res);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/employees/:id - Delete employee (Admin only)
router.delete('/:id', requireRole('ADMIN'), validateEmployeeId, async (req, res, next) => {
  try {
    await deleteEmployee(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;