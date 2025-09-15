// src/routes/stats.js
const express = require('express');
const {
  getAllStats
} = require('../controllers/statsController');
const authenticateToken = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('ADMIN'));

// GET /api/stats/employees - Get employee statistics
router.get('/', getAllStats);



module.exports = router;