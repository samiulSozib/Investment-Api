// services/investmentRequestService.js

const db = require('../database/db');
const { Op } = require('sequelize');

// Create a new investment request
const createInvestmentRequest = async ({ user_id, business_name, description, requested_amount, proposed_share }) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Check if user exists
        const user = await db.user.findByPk(user_id, { transaction });
        if (!user) {
            throw new Error('User not found');
        }

        // Create the investment request
        const newRequest = await db.investment_request.create({
            user_id,
            business_name,
            description,
            requested_amount,
            proposed_share,
            status: 'pending',
        }, { transaction });

        await transaction.commit();
        return newRequest;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update an existing investment request
const updateInvestmentRequest = async (request_id, { business_name, description, requested_amount, proposed_share, status }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const request = await db.investment_request.findByPk(request_id, { transaction });
        if (!request) {
            throw new Error('Investment request not found');
        }

        // Update the request details
        await db.investment_request.update(
            { business_name, description, requested_amount, proposed_share, status },
            { where: { id: request_id }, transaction }
        );

        const updatedRequest = await db.investment_request.findByPk(request_id, { transaction });
        await transaction.commit();
        return updatedRequest;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete an investment request
const deleteInvestmentRequest = async (request_id) => {
    const transaction = await db.sequelize.transaction();

    try {
        const request = await db.investment_request.findByPk(request_id, { transaction });
        if (!request) {
            throw new Error('Investment request not found');
        }

        // Delete the request
        await db.investment_request.destroy({ where: { id: request_id }, transaction });

        await transaction.commit();
        return { message: 'Investment request deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all investment requests
const getInvestmentRequests = async () => {
    try {
        const requests = await db.investment_request.findAll({
            include: [
                { model: db.user, as: 'user' },
                { model: db.investment_offer, as: 'investmentOffers' },
            ],
        });
        return requests;
    } catch (error) {
        throw error;
    }
};

// Get investment requests by User ID
const getInvestmentRequestsByUserId = async (user_id) => {
    try {
        const requests = await db.investment_request.findAll({
            where: { user_id },
            include: [
                { model: db.investment_offer, as: 'investmentOffers' },
            ],
        });

        if (requests.length === 0) {
            throw new Error('No investment requests found for this user');
        }

        return requests;
    } catch (error) {
        throw error;
    }
};

// Get investment request by ID
const getInvestmentRequestById = async (request_id) => {
    try {
        const request = await db.investment_request.findByPk(request_id, {
            include: [
                { model: db.user, as: 'user' },
                { model: db.investment_offer, as: 'investmentOffers' },
            ],
        });

        if (!request) {
            throw new Error('Investment request not found');
        }

        return request;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createInvestmentRequest,
    updateInvestmentRequest,
    deleteInvestmentRequest,
    getInvestmentRequests,
    getInvestmentRequestsByUserId,
    getInvestmentRequestById,
};
