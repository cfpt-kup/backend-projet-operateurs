const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // Import your authentication middleware

// POST /api/users/signup to register a new user
router.post('/signup', userController.signup);

// POST /api/users/login to authenticate a user and return a token
router.post('/login', userController.login);

// POST /api/users/logout to logout a user
router.post('/logout', authMiddleware, userController.logout);

// GET /api/users/profile to fetch a user's profile
router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
