const express = require('express');
const router = express.Router();
const { validateRegister, validateLogin, validate } = require('../validators/authValidator');
const authController = require('../controllers/authController');

// Registration route
router.post('/sign-up', validateRegister, validate, authController.register);

// Login route
router.post('/sign-in', validateLogin, validate, authController.login);

// Update user 
router.put('/update-user/:id',authController.updateProfile)

module.exports = router;
