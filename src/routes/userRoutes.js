const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Import your authentication middleware

// POST /api/users/signup to register a new user
router.post('/signup', userController.signup);

// POST /api/users/login to authenticate a user and return a token
router.post('/login', userController.login);

// Logout route
router.post('/logout', auth, userController.logout);

module.exports = router;
