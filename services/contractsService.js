// services/contractService.js

const db = require('../database/db');

// Create a new contract
const createContract = async ({ investment_id, terms, start_date, end_date, status }) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Ensure investment exists
        const investment = await db.Investment.findByPk(investment_id, { transaction });
        if (!investment) {
            throw new Error('Investment not found');
        }

        // Create contract
        const newContract = await db.Contract.create({
            investment_id,
            terms,
            start_date,
            end_date,
            status: status || 'active'
        }, { transaction });

        await transaction.commit();
        return newContract;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update a contract
const updateContract = async (contract_id, { terms, start_date, end_date, status }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const contract = await db.Contract.findByPk(contract_id, { transaction });
        if (!contract) {
            throw new Error('Contract not found');
        }

        // Update contract
        await db.Contract.update({
            terms,
            start_date,
            end_date,
            status
        }, {
            where: { id: contract_id },
            transaction
        });

        const updatedContract = await db.Contract.findByPk(contract_id, { transaction });
        await transaction.commit();
        return updatedContract;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete a contract
const deleteContract = async (contract_id) => {
    const transaction = await db.sequelize.transaction();
    try {
        const contract = await db.Contract.findByPk(contract_id, { transaction });
        if (!contract) {
            throw new Error('Contract not found');
        }

        // Delete contract
        await db.Contract.destroy({
            where: { id: contract_id },
            transaction
        });

        await transaction.commit();
        return { message: 'Contract deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all contracts
const getContracts = async (page, item_per_page) => {
    try {
        // Construct the base query options
        const options = {
            include: [{ model: db.Investment, as: 'investment' }]
        };

        // If pagination is provided, add limit and offset
        if (page && item_per_page) {
            const offset = (Math.max(page, 1) - 1) * item_per_page;
            options.limit = item_per_page;
            options.offset = offset;
        }

        return await db.Contract.findAndCountAll(options);
    } catch (error) {
        console.error('Error fetching contracts:', error); // Log error for debugging
        throw error;
    }
};


// Get contract by ID
const getContractById = async (contract_id) => {
    try {
        const contract = await db.Contract.findByPk(contract_id, {
            include: [{ model: db.Investment, as: 'investment' }]
        });

        if (!contract) {
            throw new Error('Contract not found');
        }

        return contract;
    } catch (error) {
        throw error;
    }
};

const changeContractStatus = async (contract_id, newStatus) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Fetch the contract
        const contract = await db.Contract.findByPk(contract_id, { transaction });

        if (!contract) {
            throw new Error('Contract not found');
        }

        // Validate the new status
        const validStatuses = ['active', 'terminated', 'completed'];
        if (!validStatuses.includes(newStatus.toLowerCase())) {
            throw new Error('Invalid status');
        }

        // Update the status
        contract.status = newStatus.toLowerCase();
        await contract.save({ transaction });

        // Optionally, include associated models
        const updatedContract = await db.Contract.findByPk(contract_id, {
            include: [
                { model: db.Investment, as: 'investment' },
                // Add other associations if needed
            ],
            transaction
        });

        await transaction.commit();
        return updatedContract;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    createContract,
    updateContract,
    deleteContract,
    getContracts,
    getContractById,
    changeContractStatus
};
