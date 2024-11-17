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
    const page=parseInt(req.query.page)||null
    const item_per_page=parseInt(req.query.item_per_page)||null
    try {
        const contracts = await contractService.getContracts(page,item_per_page);
        
        const total_pages =item_per_page? Math.ceil(contracts.count / item_per_page):1;
        return res.status(200).json({
            status: true,
            data: contracts.rows,
            payload:{
                pagination:{
                    current_page:page||1,
                    per_page:item_per_page||contracts.count,
                    total_items:contracts.count,
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


exports.changeStatus = async (req, res) => {
    const { id } = req.params; // contract_id
    const { status } = req.body;

    try {
        const updatedContract = await contractService.changeContractStatus(id, status);
        return res.status(200).json({
            status: true,
            message: 'Contract status updated successfully',
            data: updatedContract,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message || 'Error updating contract status',
        });
    }
};