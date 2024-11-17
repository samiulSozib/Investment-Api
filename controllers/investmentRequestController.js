// controllers/investmentRequestController.js

const investmentRequestService = require('../services/investmentRequestService');

// Create a new investment request
const createInvestmentRequest = async (req, res) => {
    const { user_id, business_name, description, requested_amount, proposed_share } = req.body;
    const files=req.files

    try {
        const newRequest = await investmentRequestService.createInvestmentRequest({
            user_id,
            business_name,
            description,
            requested_amount,
            proposed_share,
            files
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
    const { business_name, description, requested_amount, proposed_share, status,existing_images } = req.body;
    const files=req.files

    try {
        const updatedRequest = await investmentRequestService.updateInvestmentRequest(request_id, {
            business_name,
            description,
            requested_amount,
            proposed_share,
            status,
            files,
            existing_images
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
    const page=parseInt(req.query.page)||null
    const item_per_page=parseInt(req.query.item_per_page)||null
    try {
        const requests = await investmentRequestService.getInvestmentRequests(page,item_per_page);
        const total_pages =item_per_page? Math.ceil(requests.count / item_per_page):1;
        return res.status(200).json({
            status: true,
            data: requests.rows,
            payload:{
                pagination:{
                    current_page:page||1,
                    per_page:item_per_page||requests.count,
                    total_items:requests.count,
                    total_pages:total_pages
                }
            }
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
    const page=parseInt(req.query.page)||null
    const item_per_page=parseInt(req.query.item_per_page)||null
    try {
        const requests = await investmentRequestService.getInvestmentRequestsByUserId(user_id,page,item_per_page);
        const total_pages =item_per_page? Math.ceil(requests.count / item_per_page):1;
        return res.status(200).json({
            status: true,
            data: requests.rows,
            payload:{
                pagination:{
                    current_page:page||1,
                    per_page:item_per_page||requests.count,
                    total_items:requests.count,
                    total_pages:total_pages
                }
            }
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

const changeStatus = async (req, res) => {
    const { id } = req.params; // investment_request_id
    const { status } = req.body;

    try {
        const updatedRequest = await investmentRequestService.changeInvestmentRequestStatus(id, status);
        return res.status(200).json({
            status: true,
            message: 'Investment request status updated successfully',
            data: updatedRequest,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message || 'Error updating investment request status',
        });
    }
};

module.exports={
    createInvestmentRequest,
    updateInvestmentRequest,
    deleteInvestmentRequest,
    getInvestmentRequests,
    getInvestmentRequestsByUserId,
    getInvestmentRequestById,
    changeStatus
}
