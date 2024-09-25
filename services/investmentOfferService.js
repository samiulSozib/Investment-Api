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
        await db.InvestmentOffer.update(
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
const getInvestmentOffers = async (page,item_per_page) => {
    const offset=(page-1)*item_per_page
    try {
        const offers = await db.InvestmentOffer.findAndCountAll({
            include: [
                { model: db.InvestmentRequest, as: 'investmentRequest' },
                { model: db.User, as: 'investor' },
            ],
            limit:item_per_page,
            offset:offset
        });
        return offers;
    } catch (error) {
        throw error;
    }
};

// Get investment offers by Request ID
const getInvestmentOffersByRequestId = async (request_id,page,item_per_page) => {
    const offset=(page-1)*item_per_page
    try {
        const offers = await db.InvestmentOffer.findAndCountAll({
            where: { request_id },
            include: [
                { model: db.InvestmentRequest, as: 'investmentRequest' },
                { model: db.User, as: 'investor' },
            ],
            limit:item_per_page,
            offset:offset
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

const changeInvestmentOfferStatus = async (offer_id, newStatus) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Fetch the investment offer
        const investmentOffer = await db.InvestmentOffer.findByPk(offer_id, { transaction });

        if (!investmentOffer) {
            throw new Error('Investment offer not found');
        }

        // Validate the new status
        const validStatuses = ['pending', 'accepted', 'rejected'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status');
        }

        // Update the status
        investmentOffer.status = newStatus;
        await investmentOffer.save({ transaction });

        // Optionally, include associated models
        const updatedOffer = await db.InvestmentOffer.findByPk(offer_id, {
            include: [
                { model: db.InvestmentRequest, as: 'investmentRequest' },
                { model: db.User, as: 'investor' },
            ],
            transaction
        });

        await transaction.commit();
        return updatedOffer;
    } catch (error) {
        await transaction.rollback();
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
    changeInvestmentOfferStatus
};
