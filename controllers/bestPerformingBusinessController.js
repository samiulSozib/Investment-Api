// controllers/bestPerformingBusinessController.js

const bestPerformingBusinessService = require('../services/bestPerformingBusinessService');

// Create a new best performing business record
exports.createBestPerformingBusiness = async (req, res) => {
    const { business_id, performance_score } = req.body;

    try {
        const newRecord = await bestPerformingBusinessService.createBestPerformingBusiness({
            business_id,
            performance_score
        });
        return res.status(201).json({
            status: true,
            message: 'Best performing business record created successfully',
            data: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Update a best performing business record
exports.updateBestPerformingBusiness = async (req, res) => {
    const id = req.params.id;
    const { performance_score } = req.body;

    try {
        const updatedRecord = await bestPerformingBusinessService.updateBestPerformingBusiness(id, {
            performance_score
        });
        return res.status(200).json({
            status: true,
            message: 'Best performing business record updated successfully',
            data: updatedRecord
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Delete a best performing business record
exports.deleteBestPerformingBusiness = async (req, res) => {
    const id = req.params.id;

    try {
        await bestPerformingBusinessService.deleteBestPerformingBusiness(id);
        return res.status(200).json({
            status: true,
            message: 'Best performing business record deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get all best performing businesses
exports.getAllBestPerformingBusinesses = async (req, res) => {
    try {
        const records = await bestPerformingBusinessService.getAllBestPerformingBusinesses();
        return res.status(200).json({
            status: true,
            data: records
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get best performing business by ID
exports.getBestPerformingBusinessById = async (req, res) => {
    const id = req.params.id;

    try {
        const record = await bestPerformingBusinessService.getBestPerformingBusinessById(id);
        return res.status(200).json({
            status: true,
            data: record
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
