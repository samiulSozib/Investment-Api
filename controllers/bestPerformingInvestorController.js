const bestPerformingInvestorService = require('../services/bestPerformingInvestorService');

// Create a new best performing investor record
exports.createBestPerformingInvestor = async (req, res) => {
    const { user_id, performance_score } = req.body;

    try {
        const newRecord = await bestPerformingInvestorService.createBestPerformingInvestor({
            user_id,
            performance_score
        });
        return res.status(201).json({
            status: true,
            message: 'Best performing investor record created successfully',
            data: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Update a best performing investor record
exports.updateBestPerformingInvestor = async (req, res) => {
    const id = req.params.id;
    const { performance_score } = req.body;

    try {
        const updatedRecord = await bestPerformingInvestorService.updateBestPerformingInvestor(id, {
            performance_score
        });
        return res.status(200).json({
            status: true,
            message: 'Best performing investor record updated successfully',
            data: updatedRecord
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Delete a best performing investor record
exports.deleteBestPerformingInvestor = async (req, res) => {
    const id = req.params.id;

    try {
        await bestPerformingInvestorService.deleteBestPerformingInvestor(id);
        return res.status(200).json({
            status: true,
            message: 'Best performing investor record deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get all best performing investors
exports.getAllBestPerformingInvestors = async (req, res) => {
    try {
        const records = await bestPerformingInvestorService.getAllBestPerformingInvestors();
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

// Get best performing investor by ID
exports.getBestPerformingInvestorById = async (req, res) => {
    const id = req.params.id;

    try {
        const record = await bestPerformingInvestorService.getBestPerformingInvestorById(id);
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
