const userService = require('../services/userService');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({
            status: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await userService.getUserById(userId);
        return res.status(200).json({
            status: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await userService.deleteUser(userId);
        return res.status(200).json({
            status: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
