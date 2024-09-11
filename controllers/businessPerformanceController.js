// controllers/businessPerformanceController.js

const businessPerformanceService = require('../services/businessPerformanceService');

// Create a new business performance record
exports.createBusinessPerformance = async (req, res) => {
    const { business_id, date, profit, loss } = req.body;

    try {
        const newRecord = await businessPerformanceService.createBusinessPerformance({
            business_id,
            date,
            profit,
            loss
        });
        return res.status(201).json({
            status: true,
            message: 'Business performance record created successfully',
            data: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Update a business performance record
exports.updateBusinessPerformance = async (req, res) => {
    const id = req.params.id;
    const { date, profit, loss } = req.body;

    try {
        const updatedRecord = await businessPerformanceService.updateBusinessPerformance(id, {
            date,
            profit,
            loss
        });
        return res.status(200).json({
            status: true,
            message: 'Business performance record updated successfully',
            data: updatedRecord
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Delete a business performance record
exports.deleteBusinessPerformance = async (req, res) => {
    const id = req.params.id;

    try {
        await businessPerformanceService.deleteBusinessPerformance(id);
        return res.status(200).json({
            status: true,
            message: 'Business performance record deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get all business performance records
exports.getAllBusinessPerformances = async (req, res) => {
    try {
        const records = await businessPerformanceService.getAllBusinessPerformances();
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

// Get business performance by ID
exports.getBusinessPerformanceById = async (req, res) => {
    const id = req.params.id;

    try {
        const record = await businessPerformanceService.getBusinessPerformanceById(id);
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
