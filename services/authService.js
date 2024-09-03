const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User=require('../models/user')
const db=require('../database/db')

const registerUser = async ({ name, email, password, role }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const existingUser = await db.User.findOne({ where: { email }, transaction });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.User.create({
            name,
            email,
            password: hashedPassword,
            role
        }, { transaction });

        await transaction.commit(); 
        return user;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const loginUser = async ({ email, password }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email }, transaction });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        await transaction.commit(); 
        return { token, user };
    } catch (error) {
        await transaction.rollback(); 
        throw error;
    }
};

module.exports = {
    registerUser,
    loginUser
};
