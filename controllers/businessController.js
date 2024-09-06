// controllers/businessController.js
const businessService = require('../services/businessService');

// Create Business Controller
const createBusiness = async (req, res) => {
    const data = req.body;

    try {
        const newBusiness = await businessService.createBusiness(data);
        return res.status(201).json({
            status: true,
            message: 'Business created successfully',
            business: newBusiness,
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
            business,
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
            businesses,
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
    const data = req.body;

    try {
        const updatedBusiness = await businessService.updateBusiness(id, data);
        return res.status(200).json({
            status: true,
            message: 'Business updated successfully',
            business: updatedBusiness,
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
            businesses,
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            message: error.message || 'Businesses not found for this category',
        });
    }
};

// Get businesses by user ID
const getBusinessByUserId = async (req, res) => {
    const { user_id } = req.params;

    try {
        const businesses = await businessService.getBusinessByUserId(user_id);
        return res.status(200).json({
            status: true,
            businesses,
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            message: error.message || 'Businesses not found for this user',
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
    getBusinessByUserId
};
