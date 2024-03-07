const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/signup to register a new user
router.post('/signup', userController.signup);

module.exports = router;
