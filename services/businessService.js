// services/businessService.js
const db = require('../database/db');
const { sequelize } = require('../database/db');
const { Op } = require('sequelize');

// Create Business
const createBusiness = async ({ name, category_id, min_investment, max_investment, min_investment_period, max_investment_period, profit_share_ratio, loss_share_ratio }) => {
    const transaction = await sequelize.transaction();

    try {
        // Create the new business
        const newBusiness = await db.Business.create({
            name,
            category_id,
            min_investment,
            max_investment,
            min_investment_period,
            max_investment_period,
            profit_share_ratio,
            loss_share_ratio,
            status: 'inactive'
        }, { transaction });

        await transaction.commit();
        return newBusiness;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update Business
const updateBusiness = async (id, { name, category_id, min_investment, max_investment, min_investment_period, max_investment_period, profit_share_ratio, loss_share_ratio }) => {
    const transaction = await sequelize.transaction();

    try {
        // Check if the business exists
        const existingBusiness = await db.Business.findByPk(id, { transaction });

        if (!existingBusiness) {
            throw new Error('Business not found');
        }

        // Update business details
        await db.business.update({
            name,
            category_id,
            min_investment,
            max_investment,
            min_investment_period,
            max_investment_period,
            profit_share_ratio,
            loss_share_ratio
        }, {
            where: { id },
            transaction
        });

        const updatedBusiness = await db.Business.findByPk(id, { transaction });
        await transaction.commit();
        return updatedBusiness;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Fetch Business By ID
const getBusinessById = async (id) => {
    try {
        const business = await db.Business.findByPk(id, {
            include: [{ model: db.BusinessCategory, as: 'category' }]
        });

        if (!business) {
            throw new Error('Business not found');
        }

        return business;
    } catch (error) {
        throw error;
    }
};

// Fetch All Businesses
const getAllBusinesses = async () => {
    try {
        const businesses = await db.Business.findAll({
            include: [{ model: db.BusinessCategory, as: 'category' }]
        });

        return businesses;
    } catch (error) {
        throw error;
    }
};

// Delete Business
const deleteBusiness = async (id) => {
    const transaction = await sequelize.transaction();

    try {
        // Check if the business exists
        const existingBusiness = await db.Business.findByPk(id, { transaction });

        if (!existingBusiness) {
            throw new Error('Business not found');
        }

        // Delete the business
        await db.Business.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get Business By Category
const getBusinessByCategory = async (category_id) => {
    try {
        const businesses = await db.Business.findAll({
            where: { category_id },
            include: [{ model: db.BusinessCategory, as: 'category' }]
        });

        if (businesses.length === 0) {
            throw new Error('No businesses found for this category');
        }

        return businesses;
    } catch (error) {
        throw error;
    }
};

// Get businesses by user ID
const getBusinessByUserId = async (user_id) => {
    try {
        const businesses = await db.Business.findAll({
            where: { user_id },
            include: [{ model: db.BusinessCategory, as: 'category' }]
        });

        if (businesses.length === 0) {
            throw new Error('No businesses found for this user');
        }

        return businesses;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBusiness,
    updateBusiness,
    getBusinessById,
    getAllBusinesses,
    deleteBusiness,
    getBusinessByCategory,
    getBusinessByUserId
};
