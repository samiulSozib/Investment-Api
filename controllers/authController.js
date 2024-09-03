const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        return res.status(201).json({ status: 'success', msg: 'User registered successfully', user });
    } catch (error) {
        const statusCode = error.message === 'User already exists' ? 409 : 400;
        return res.status(statusCode).json({ status: 'error', msg: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { token, user } = await authService.loginUser(req.body);
        return res.status(200).json({ status: 'success', msg: 'User logged in successfully', token, user });
    } catch (error) {
        const statusCode = error.message === 'Invalid email or password' ? 401 : 400;
        return res.status(statusCode).json({ status: 'error', msg: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;

        const updatedUser = await authService.updateUserProfile(userId, updatedData);
        return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    updateProfile
};
