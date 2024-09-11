const db = require('../database/db');

// Create a new best performing business record
const createBestPerformingBusiness = async ({ business_id, performance_score }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const business = await db.Business.findByPk(business_id, { transaction });
        if (!business) {
            throw new Error('Business not found');
        }

        const newRecord = await db.BestPerformingBusiness.create({
            business_id,
            performance_score
        }, { transaction });

        await transaction.commit();
        return newRecord;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update the performance score for an existing business
const updateBestPerformingBusiness = async (id, { performance_score }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const record = await db.BestPerformingBusiness.findByPk(id, { transaction });
        if (!record) {
            throw new Error('Best Performing Business not found');
        }

        await db.BestPerformingBusiness.update({
            performance_score
        }, {
            where: { id },
            transaction
        });

        const updatedRecord = await db.BestPerformingBusiness.findByPk(id, { transaction });
        await transaction.commit();
        return updatedRecord;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete a best performing business record
const deleteBestPerformingBusiness = async (id) => {
    const transaction = await db.sequelize.transaction();
    try {
        const record = await db.BestPerformingBusiness.findByPk(id, { transaction });
        if (!record) {
            throw new Error('Best Performing Business not found');
        }

        await db.BestPerformingBusiness.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
        return { message: 'Record deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all best performing businesses
const getAllBestPerformingBusinesses = async () => {
    try {
        return await db.BestPerformingBusiness.findAll({
            include: [{ model: db.Business, as: 'business' }]
        });
    } catch (error) {
        throw error;
    }
};

// Get best performing business by ID
const getBestPerformingBusinessById = async (id) => {
    try {
        const record = await db.BestPerformingBusiness.findByPk(id, {
            include: [{ model: db.Business, as: 'business' }]
        });

        if (!record) {
            throw new Error('Best Performing Business not found');
        }

        return record;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBestPerformingBusiness,
    updateBestPerformingBusiness,
    deleteBestPerformingBusiness,
    getAllBestPerformingBusinesses,
    getBestPerformingBusinessById
};
