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
    const page=parseInt(req.query.page)||null
    const item_per_page=parseInt(req.query.item_per_page)||null
    try {
        const records = await businessPerformanceService.getAllBusinessPerformances(page,item_per_page);
        const total_pages =item_per_page? Math.ceil(records.count / item_per_page):1;
        return res.status(200).json({
            status: true,
            data: records.rows,
            payload:{
                pagination:{
                    current_page:page||1,
                    per_page:item_per_page||records.count,
                    total_items:records.count,
                    total_pages:total_pages
                }
            }
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
