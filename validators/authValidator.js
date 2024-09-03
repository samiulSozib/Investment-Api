const { check, validationResult } = require('express-validator');

// Registration validation  
const validateRegister = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),
    
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    check('role')
        .isIn(['entrepreneur', 'investor'])
        .withMessage('Role must be one of the following: entrepreneur, investor'),
];

// Login validation
const validateLogin = [
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email'),

    check('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(error => ({
            [error.path]: error.msg
        }));
        return res.status(400).json({ errors: errorDetails });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validate
};
