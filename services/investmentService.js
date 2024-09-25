const db = require('../database/db');
const { Op, literal } = require('sequelize');
const { sequelize } = require('../database/db');

// Create a new investment
const createInvestment = async ({ user_id, business_id, amount, investment_date, investment_period, expected_return }) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Check if business exists
        const business = await db.Business.findByPk(business_id, { transaction });
        if (!business) {
            throw new Error('Business not found');
        }

        // Check if user exists
        const user = await db.User.findByPk(user_id, { transaction });
        if (!user) {
            throw new Error('User not found');
        }

        // Create the investment
        const newInvestment = await db.Investment.create({
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
        const investment = await db.Investment.findByPk(investment_id, { transaction });
        if (!investment) {
            throw new Error('Investment not found');
        }

        // Update the investment details
        await db.Investment.update(
            { amount, investment_period, expected_return, status },
            { where: { id: investment_id }, transaction }
        );

        const updatedInvestment = await db.Investment.findByPk(investment_id, { transaction });
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
        const investment = await db.Investment.findByPk(investment_id, { transaction });
        if (!investment) {
            throw new Error('Investment not found');
        }

        // Delete the investment
        await db.Investment.destroy({ where: { id: investment_id }, transaction });

        await transaction.commit();
        return { message: 'Investment deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all investments
const getInvestments = async (page,item_per_page) => {
    const offset=(page-1)*item_per_page
    try {
        const investments = await db.Investment.findAndCountAll({
            include: [
                { model: db.User, as: 'user' },
                { model: db.Business, as: 'business' },
            ],
            limit:item_per_page,
            offset:offset
        });
        return investments;
    } catch (error) {
        throw error;
    }
};

// Get investments by User ID
const getInvestmentsByUserId = async (user_id,page,item_per_page) => {
    const offset=(page-1)*item_per_page
    try {
        const investments = await db.Investment.findAndCountAll({
            where: { user_id },
            include: [
                { model: db.Business, as: 'business' },
            ],
            limit:item_per_page,
            offset:offset
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
const getInvestmentsByBusinessId = async (business_id,page,item_per_page) => {
    const offset=(page-1)*item_per_page
    try {
        const investments = await db.Investment.findAndCountAll({
            where: { business_id },
            include: [
                { model: db.User, as: 'user' },
            ],
            limit:item_per_page,
            offset:offset
        });

        if (investments.length === 0) {
            throw new Error('No investments found for this business');
        }

        return investments;
    } catch (error) {
        throw error;
    }
};

const changeInvestmentStatus = async (investment_id, newStatus) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Fetch the investment
        const investment = await db.Investment.findByPk(investment_id, { transaction });

        if (!investment) {
            throw new Error('Investment not found');
        }

        // Validate the new status
        const validStatuses = ['active', 'inactive', 'terminated', 'completed'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status');
        }

        // Update the status
        investment.status = newStatus;
        await investment.save({ transaction });

        await transaction.commit();
        return investment;
    } catch (error) {
        await transaction.rollback();
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
    changeInvestmentStatus
};
