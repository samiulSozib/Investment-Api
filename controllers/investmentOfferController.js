// controllers/investmentOfferController.js

const investmentOfferService = require('../services/investmentOfferService');

// Create a new investment offer
exports.createInvestmentOffer = async (req, res) => {
    const { request_id, investor_id, offered_amount, proposed_share } = req.body;

    try {
        const newOffer = await investmentOfferService.createInvestmentOffer({
            request_id,
            investor_id,
            offered_amount,
            proposed_share,
        });
        return res.status(201).json({
            status: true,
            message: 'Investment offer created successfully',
            data: newOffer,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Update an investment offer
exports.updateInvestmentOffer = async (req, res) => {
    const offer_id = req.params.id;
    const { offered_amount, proposed_share, status } = req.body;

    try {
        const updatedOffer = await investmentOfferService.updateInvestmentOffer(offer_id, {
            offered_amount,
            proposed_share,
            status,
        });
        return res.status(200).json({
            status: true,
            message: 'Investment offer updated successfully',
            data: updatedOffer,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Delete an investment offer
exports.deleteInvestmentOffer = async (req, res) => {
    const offer_id = req.params.id;

    try {
        await investmentOfferService.deleteInvestmentOffer(offer_id);
        return res.status(200).json({
            status: true,
            message: 'Investment offer deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get all investment offers
exports.getInvestmentOffers = async (req, res) => {
    try {
        const offers = await investmentOfferService.getInvestmentOffers();
        return res.status(200).json({
            status: true,
            data: offers,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get investment offers by Request ID
exports.getInvestmentOffersByRequestId = async (req, res) => {
    const request_id = req.params.request_id;

    try {
        const offers = await investmentOfferService.getInvestmentOffersByRequestId(request_id);
        return res.status(200).json({
            status: true,
            data: offers,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get investment offer by ID
exports.getInvestmentOfferById = async (req, res) => {
    const offer_id = req.params.id;

    try {
        const offer = await investmentOfferService.getInvestmentOfferById(offer_id);
        return res.status(200).json({
            status: true,
            data: offer,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};
