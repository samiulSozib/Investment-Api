// controllers/contractController.js

const contractService = require('../services/contractsService');

// Create a new contract
exports.createContract = async (req, res) => {
    const { investment_id, terms, start_date, end_date, status } = req.body;

    try {
        const newContract = await contractService.createContract({
            investment_id,
            terms,
            start_date,
            end_date,
            status
        });
        return res.status(201).json({
            status: true,
            message: 'Contract created successfully',
            data: newContract
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Update a contract
exports.updateContract = async (req, res) => {
    const contract_id = req.params.id;
    const { terms, start_date, end_date, status } = req.body;

    try {
        const updatedContract = await contractService.updateContract(contract_id, {
            terms,
            start_date,
            end_date,
            status
        });
        return res.status(200).json({
            status: true,
            message: 'Contract updated successfully',
            data: updatedContract
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Delete a contract
exports.deleteContract = async (req, res) => {
    const contract_id = req.params.id;

    try {
        await contractService.deleteContract(contract_id);
        return res.status(200).json({
            status: true,
            message: 'Contract deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get all contracts
exports.getContracts = async (req, res) => {
    try {
        const contracts = await contractService.getContracts();
        return res.status(200).json({
            status: true,
            data: contracts
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get contract by ID
exports.getContractById = async (req, res) => {
    const contract_id = req.params.id;

    try {
        const contract = await contractService.getContractById(contract_id);
        return res.status(200).json({
            status: true,
            data: contract
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
