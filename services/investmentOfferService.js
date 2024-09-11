// services/investmentOfferService.js

const db = require('../database/db');

// Create a new investment offer
const createInvestmentOffer = async ({ request_id, investor_id, offered_amount, proposed_share }) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Check if investment request exists
        const request = await db.InvestmentRequest.findByPk(request_id, { transaction });
        if (!request) {
            throw new Error('Investment request not found');
        }

        // Check if investor exists
        const investor = await db.User.findByPk(investor_id, { transaction });
        if (!investor) {
            throw new Error('Investor not found');
        }

        // Create the investment offer
        const newOffer = await db.InvestmentOffer.create({
            request_id,
            investor_id,
            offered_amount,
            proposed_share,
            status: 'pending',
        }, { transaction });

        await transaction.commit();
        return newOffer;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update an existing investment offer
const updateInvestmentOffer = async (offer_id, { offered_amount, proposed_share, status }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const offer = await db.InvestmentOffer.findByPk(offer_id, { transaction });
        if (!offer) {
            throw new Error('Investment offer not found');
        }

        // Update the offer details
        await db.investment_offer.update(
            { offered_amount, proposed_share, status },
            { where: { id: offer_id }, transaction }
        );

        const updatedOffer = await db.InvestmentOffer.findByPk(offer_id, { transaction });
        await transaction.commit();
        return updatedOffer;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete an investment offer
const deleteInvestmentOffer = async (offer_id) => {
    const transaction = await db.sequelize.transaction();

    try {
        const offer = await db.InvestmentOffer.findByPk(offer_id, { transaction });
        if (!offer) {
            throw new Error('Investment offer not found');
        }

        // Delete the offer
        await db.InvestmentOffer.destroy({ where: { id: offer_id }, transaction });

        await transaction.commit();
        return { message: 'Investment offer deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all investment offers
const getInvestmentOffers = async () => {
    try {
        const offers = await db.InvestmentOffer.findAll({
            include: [
                { model: db.InvestmentRequest, as: 'investmentRequest' },
                { model: db.User, as: 'investor' },
            ],
        });
        return offers;
    } catch (error) {
        throw error;
    }
};

// Get investment offers by Request ID
const getInvestmentOffersByRequestId = async (request_id) => {
    try {
        const offers = await db.InvestmentOffer.findAll({
            where: { request_id },
            include: [
                { model: db.InvestmentRequest, as: 'investmentRequest' },
                { model: db.User, as: 'investor' },
            ],
        });

        if (offers.length === 0) {
            throw new Error('No investment offers found for this request');
        }

        return offers;
    } catch (error) {
        throw error;
    }
};

// Get investment offer by ID
const getInvestmentOfferById = async (offer_id) => {
    try {
        const offer = await db.InvestmentOffer.findByPk(offer_id, {
            include: [
                { model: db.InvestmentRequest, as: 'investmentRequest' },
                { model: db.User, as: 'investor' },
            ],
        });

        if (!offer) {
            throw new Error('Investment offer not found');
        }

        return offer;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createInvestmentOffer,
    updateInvestmentOffer,
    deleteInvestmentOffer,
    getInvestmentOffers,
    getInvestmentOffersByRequestId,
    getInvestmentOfferById,
};
