const db = require('../database/db');
const { Op } = require('sequelize');

// Create a new investment
const createInvestment = async ({ user_id, business_id, amount, investment_date, investment_period, expected_return }) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Check if business exists
        const business = await db.business.findByPk(business_id, { transaction });
        if (!business) {
            throw new Error('Business not found');
        }

        // Check if user exists
        const user = await db.user.findByPk(user_id, { transaction });
        if (!user) {
            throw new Error('User not found');
        }

        // Create the investment
        const newInvestment = await db.investment.create({
            user_id,
            business_id,
            amount,
            investment_date,
            investment_period,
            expected_return,
            status: 'inactive',
        }, { transaction });

        await transaction.commit();
        return newInvestment;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update an existing investment
const updateInvestment = async (investment_id, { amount, investment_period, expected_return, status }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const investment = await db.investment.findByPk(investment_id, { transaction });
        if (!investment) {
            throw new Error('Investment not found');
        }

        // Update the investment details
        await db.investment.update(
            { amount, investment_period, expected_return, status },
            { where: { id: investment_id }, transaction }
        );

        const updatedInvestment = await db.investment.findByPk(investment_id, { transaction });
        await transaction.commit();
        return updatedInvestment;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete an investment
const deleteInvestment = async (investment_id) => {
    const transaction = await db.sequelize.transaction();

    try {
        const investment = await db.investment.findByPk(investment_id, { transaction });
        if (!investment) {
            throw new Error('Investment not found');
        }

        // Delete the investment
        await db.investment.destroy({ where: { id: investment_id }, transaction });

        await transaction.commit();
        return { message: 'Investment deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all investments
const getInvestments = async () => {
    try {
        const investments = await db.investment.findAll({
            include: [
                { model: db.user, as: 'user' },
                { model: db.business, as: 'business' },
            ],
        });
        return investments;
    } catch (error) {
        throw error;
    }
};

// Get investments by User ID
const getInvestmentsByUserId = async (user_id) => {
    try {
        const investments = await db.investment.findAll({
            where: { user_id },
            include: [
                { model: db.business, as: 'business' },
            ],
        });

        if (investments.length === 0) {
            throw new Error('No investments found for this user');
        }

        return investments;
    } catch (error) {
        throw error;
    }
};

// Get investments by Business ID
const getInvestmentsByBusinessId = async (business_id) => {
    try {
        const investments = await db.investment.findAll({
            where: { business_id },
            include: [
                { model: db.user, as: 'user' },
            ],
        });

        if (investments.length === 0) {
            throw new Error('No investments found for this business');
        }

        return investments;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createInvestment,
    updateInvestment,
    deleteInvestment,
    getInvestments,
    getInvestmentsByUserId,
    getInvestmentsByBusinessId,
};
