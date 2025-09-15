// src/routes/auth.js
const express = require('express');
const { login, logout} = require('../controllers/authController');
const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;