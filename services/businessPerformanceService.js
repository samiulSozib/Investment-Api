// services/businessPerformanceService.js

const db = require('../database/db');

// Create a new business performance record
const createBusinessPerformance = async ({ business_id, date, profit, loss }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const business = await db.Business.findByPk(business_id, { transaction });
        if (!business) {
            throw new Error('Business not found');
        }

        const newRecord = await db.BusinessPerformance.create({
            business_id,
            date,
            profit,
            loss
        }, { transaction });

        await transaction.commit();
        return newRecord;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update a business performance record
const updateBusinessPerformance = async (id, { date, profit, loss }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const record = await db.BusinessPerformance.findByPk(id, { transaction });
        if (!record) {
            throw new Error('Business Performance record not found');
        }

        await db.BusinessPerformance.update({
            date,
            profit,
            loss
        }, {
            where: { id },
            transaction
        });

        const updatedRecord = await db.BusinessPerformance.findByPk(id, { transaction });
        await transaction.commit();
        return updatedRecord;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete a business performance record
const deleteBusinessPerformance = async (id) => {
    const transaction = await db.sequelize.transaction();
    try {
        const record = await db.BusinessPerformance.findByPk(id, { transaction });
        if (!record) {
            throw new Error('Business Performance record not found');
        }

        await db.BusinessPerformance.destroy({
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

// Get all business performance records
const getAllBusinessPerformances = async () => {
    try {
        return await db.BusinessPerformance.findAll({
            include: [{ model: db.Business, as: 'business' }]
        });
    } catch (error) {
        throw error;
    }
};

// Get business performance by ID
const getBusinessPerformanceById = async (id) => {
    try {
        const record = await db.BusinessPerformance.findByPk(id, {
            include: [{ model: db.Business, as: 'business' }]
        });

        if (!record) {
            throw new Error('Business Performance record not found');
        }

        return record;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBusinessPerformance,
    updateBusinessPerformance,
    deleteBusinessPerformance,
    getAllBusinessPerformances,
    getBusinessPerformanceById
};
