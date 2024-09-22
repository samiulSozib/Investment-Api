const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get all users
router.get('/', userController.getAllUsers);

// Route to get a user by ID
router.get('/:id', userController.getUserById);

// Route to delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;