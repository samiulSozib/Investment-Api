// controllers/investmentRequestController.js

const investmentRequestService = require('../services/investmentRequestService');

// Create a new investment request
const createInvestmentRequest = async (req, res) => {
    const { user_id, business_name, description, requested_amount, proposed_share } = req.body;

    try {
        const newRequest = await investmentRequestService.createInvestmentRequest({
            user_id,
            business_name,
            description,
            requested_amount,
            proposed_share,
        });
        return res.status(201).json({
            status: true,
            message: 'Investment request created successfully',
            data: newRequest,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Update an investment request
const updateInvestmentRequest = async (req, res) => {
    const request_id = req.params.id;
    const { business_name, description, requested_amount, proposed_share, status } = req.body;

    try {
        const updatedRequest = await investmentRequestService.updateInvestmentRequest(request_id, {
            business_name,
            description,
            requested_amount,
            proposed_share,
            status,
        });
        return res.status(200).json({
            status: true,
            message: 'Investment request updated successfully',
            data: updatedRequest,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Delete an investment request
const deleteInvestmentRequest = async (req, res) => {
    const request_id = req.params.id;

    try {
        await investmentRequestService.deleteInvestmentRequest(request_id);
        return res.status(200).json({
            status: true,
            message: 'Investment request deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get all investment requests
const getInvestmentRequests = async (req, res) => {
    try {
        const requests = await investmentRequestService.getInvestmentRequests();
        return res.status(200).json({
            status: true,
            data: requests,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get investment requests by User ID
const getInvestmentRequestsByUserId = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const requests = await investmentRequestService.getInvestmentRequestsByUserId(user_id);
        return res.status(200).json({
            status: true,
            data: requests,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get investment request by ID
const getInvestmentRequestById = async (req, res) => {
    const request_id = req.params.id;

    try {
        const request = await investmentRequestService.getInvestmentRequestById(request_id);
        return res.status(200).json({
            status: true,
            data: request,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

module.exports={
    createInvestmentRequest,
    updateInvestmentRequest,
    deleteInvestmentRequest,
    getInvestmentRequests,
    getInvestmentRequestsByUserId,
    getInvestmentRequestById
}
