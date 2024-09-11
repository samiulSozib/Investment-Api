// services/bestPerformingInvestorService.js

const db = require('../database/db');

// Create a new best performing investor record
const createBestPerformingInvestor = async ({ user_id, performance_score }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findByPk(user_id, { transaction });
        if (!user) {
            throw new Error('User not found');
        }

        const newRecord = await db.BestPerformingInvestor.create({
            user_id,
            performance_score
        }, { transaction });

        await transaction.commit();
        return newRecord;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update the performance score for an existing investor
const updateBestPerformingInvestor = async (id, { performance_score }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const record = await db.BestPerformingInvestor.findByPk(id, { transaction });
        if (!record) {
            throw new Error('Best Performing Investor not found');
        }

        await db.BestPerformingInvestor.update({
            performance_score
        }, {
            where: { id },
            transaction
        });

        const updatedRecord = await db.BestPerformingInvestor.findByPk(id, { transaction });
        await transaction.commit();
        return updatedRecord;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete a best performing investor record
const deleteBestPerformingInvestor = async (id) => {
    const transaction = await db.sequelize.transaction();
    try {
        const record = await db.BestPerformingInvestor.findByPk(id, { transaction });
        if (!record) {
            throw new Error('Best Performing Investor not found');
        }

        await db.BestPerformingInvestor.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
        return { message: 'Record deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all best performing investors
const getAllBestPerformingInvestors = async () => {
    try {
        return await db.BestPerformingInvestor.findAll({
            include: [{ model: db.User, as: 'user' }]
        });
    } catch (error) {
        throw error;
    }
};

// Get best performing investor by ID
const getBestPerformingInvestorById = async (id) => {
    try {
        const record = await db.BestPerformingInvestor.findByPk(id, {
            include: [{ model: db.User, as: 'user' }]
        });

        if (!record) {
            throw new Error('Best Performing Investor not found');
        }

        return record;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBestPerformingInvestor,
    updateBestPerformingInvestor,
    deleteBestPerformingInvestor,
    getAllBestPerformingInvestors,
    getBestPerformingInvestorById
};
