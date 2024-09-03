const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ status: 'success', msg: 'User registered successfully', user });
    } catch (error) {
        const statusCode = error.message === 'User already exists' ? 409 : 400;
        res.status(statusCode).json({ status: 'error', msg: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { token, user } = await authService.loginUser(req.body);
        res.status(200).json({ status: 'success', msg: 'User logged in successfully', token, user });
    } catch (error) {
        const statusCode = error.message === 'Invalid email or password' ? 401 : 400;
        res.status(statusCode).json({ status: 'error', msg: error.message });
    }
};

module.exports = {
    register,
    login
};
