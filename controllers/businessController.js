// controllers/businessController.js
const businessService = require('../services/businessService');

// Create Business Controller
const createBusiness = async (req, res) => {
    const { name, category_id, min_investment, max_investment, min_investment_period, max_investment_period, profit_share_ratio, loss_share_ratio} = req.body;
    const files=req.files

    try {
        const newBusiness = await businessService.createBusiness({ name, category_id, min_investment, max_investment, min_investment_period, max_investment_period, profit_share_ratio, loss_share_ratio,files});
        return res.status(201).json({
            status: true,
            message: 'Business created successfully',
            data: newBusiness,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message || 'Error creating business',
        });
    }
};

// Get Business By ID Controller
const getBusinessById = async (req, res) => {
    const { id } = req.params;

    try {
        const business = await businessService.getBusinessById(id);
        return res.status(200).json({
            status: true,
            data:business,
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            message: error.message || 'Business not found',
        });
    }
};

// Get All Businesses Controller
const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await businessService.getAllBusinesses();
        return res.status(200).json({
            status: true,
            data:businesses,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Error fetching businesses',
        });
    }
};

// Update Business Controller
const updateBusiness = async (req, res) => {
    const { id } = req.params;
    const {name, category_id, min_investment, max_investment, min_investment_period, max_investment_period, profit_share_ratio, loss_share_ratio,existing_images} = req.body;
    const files=req.files

    try {
        const updatedBusiness = await businessService.updateBusiness(id, {name, category_id, min_investment, max_investment, min_investment_period, max_investment_period, profit_share_ratio, loss_share_ratio,files,existing_images});
        return res.status(200).json({
            status: true,
            message: 'Business updated successfully',
            data: updatedBusiness,
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            message: error.message || 'Error updating business',
        });
    }
};

// Delete Business Controller
const deleteBusiness = async (req, res) => {
    const { id } = req.params;

    try {
        await businessService.deleteBusiness(id);
        return res.status(200).json({
            status: true,
            message: 'Business deleted successfully',
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            message: error.message || 'Error deleting business',
        });
    }
};

// Get businesses by category
const getBusinessByCategory = async (req, res) => {
    const { category_id } = req.params;

    try {
        const businesses = await businessService.getBusinessByCategory(category_id);
        return res.status(200).json({
            status: true,
            data:businesses,
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            message: error.message || 'Businesses not found for this category',
        });
    }
};

const changeStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedBusiness = await businessService.changeBusinessStatus(id, status);
        return res.status(200).json({
            status: true,
            message: 'Business status updated successfully',
            data: updatedBusiness,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message || 'Error updating business status',
        });
    }
};



module.exports = {
    createBusiness,
    getBusinessById,
    getAllBusinesses,
    updateBusiness,
    deleteBusiness,
    getBusinessByCategory,
    changeStatus
};
