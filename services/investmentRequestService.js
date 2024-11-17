// services/investmentRequestService.js

const db = require('../database/db');
const { Op } = require('sequelize');

// Create a new investment request
const createInvestmentRequest = async ({ user_id, business_name, description, requested_amount, proposed_share,files }) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Check if user exists
        const user = await db.User.findByPk(user_id, { transaction });
        if (!user) {
            throw new Error('User not found');
        }

        // Check if user has the 'Entrepreneur' role
        const userRole = await db.UserRole.findOne({
            where: { user_id, role: 'entrepreneur' },
            transaction
        });

        // If user is not an Entrepreneur, add them to the 'user_roles' table
        if (!userRole) {
            await db.UserRole.create({
                user_id,
                role: 'entrepreneur'
            }, { transaction });
        }

        // Create the investment request
        const newRequest = await db.InvestmentRequest.create({
            user_id,
            business_name,
            description,
            requested_amount,
            proposed_share,
            status: 'pending',
        }, { transaction });

        // Save the images associated with the investment request
        if (files && files.length > 0) {
            const imageEntries = files.map(file => ({
                entry_type: 'investmentRequests',
                foreign_key_id: newRequest.id,
                image_url: `${process.env.base_url}/uploads/${file.filename}`
            }));
            //console.log(imageEntries)
            await db.Image.bulkCreate(imageEntries, { transaction });
        }

        // Return the investment request with associated images
        const createdRequest = await db.InvestmentRequest.findByPk(newRequest.id, {
            include: [{
                model: db.Image,
                as: 'investment_request_images',
                where: { entry_type: 'investmentRequests' },
                required: false // Left join to include images only if they exist
            }],
            transaction
        });

        await transaction.commit();
        return createdRequest;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update an existing investment request
const updateInvestmentRequest = async (request_id, { business_name, description, requested_amount, proposed_share, status,files }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const request = await db.InvestmentRequest.findByPk(request_id, { transaction });
        if (!request) {
            throw new Error('Investment request not found');
        }

        // Update the request details
        await db.InvestmentRequest.update(
            { business_name, description, requested_amount, proposed_share, status },
            { where: { id: request_id }, transaction }
        );

        if (existing_images) {
            // Delete images that are NOT in the existingImagesToKeep array
            await db.Image.destroy({
                where: {
                    entry_type: 'investmentRequests',
                    foreign_key_id: id,
                    image_url: { [db.Sequelize.Op.notIn]: JSON.parse(existing_images) }
                },
                transaction
            });
        } else {
            // No existing images to keep, delete all
            await db.Image.destroy({
                where: {
                    entry_type: 'investmentRequests',
                    foreign_key_id: request_id
                },
                transaction
            });
        }

        if (files && files.length > 0) {
            // Save new images
            const imageEntries = files.map(file => ({
                entry_type: 'investmentRequests',
                foreign_key_id: request_id,
                image_url: `${process.env.base_url}/uploads/${file.filename}`
            }));
            await db.Image.bulkCreate(imageEntries, { transaction });
        }


         const updatedRequest = await db.InvestmentRequest.findByPk(request_id, {
            include: [{
                model: db.Image,
                as: 'investment_request_images',
                where: { entry_type: 'investmentRequests' },
                required: false // Left join to include images only if they exist
            }],
            transaction
        });

        await transaction.commit();
        return updatedRequest;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete an investment request
const deleteInvestmentRequest = async (request_id) => {
    const transaction = await db.sequelize.transaction();

    try {
        const request = await db.InvestmentRequest.findByPk(request_id, { transaction });
        if (!request) {
            throw new Error('Investment request not found');
        }

        // Delete the request
        await db.InvestmentRequest.destroy({ where: { id: request_id }, transaction });

        await transaction.commit();
        return { message: 'Investment request deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all investment requests
const getInvestmentRequests = async (page, item_per_page) => {
    try {
        // Construct the base query options
        const options = {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    include: [{ model: db.UserRole, as: 'user_role', required: false }]
                },
                { model: db.InvestmentOffer, as: 'investmentOffers' },
                {
                    model: db.Image,
                    as: 'investment_request_images',
                    where: { entry_type: 'investmentRequests' },
                    required: false // Left join to include images only if they exist
                }
            ]
        };

        // If pagination is provided, add limit and offset
        if (page && item_per_page) {
            const offset = (Math.max(page, 1) - 1) * item_per_page;
            options.limit = item_per_page;
            options.offset = offset;
        }

        const requests = await db.InvestmentRequest.findAndCountAll(options);
        return requests;
    } catch (error) {
        console.error('Error fetching investment requests:', error); // Log error for debugging
        throw error;
    }
};


// Get investment requests by User ID
const getInvestmentRequestsByUserId = async (user_id, page, item_per_page) => {
    try {
        // Construct the base query options
        const options = {
            where: { user_id },
            include: [
                { model: db.InvestmentOffer, as: 'investmentOffers' },
                {
                    model: db.Image,
                    as: 'investment_request_images',
                    where: { entry_type: 'investmentRequests' },
                    required: false // Left join to include images only if they exist
                }
            ]
        };

        // If pagination is provided, add limit and offset
        if (page && item_per_page) {
            const offset = (Math.max(page, 1) - 1) * item_per_page;
            options.limit = item_per_page;
            options.offset = offset;
        }

        const requests = await db.InvestmentRequest.findAndCountAll(options);

        // Check if any requests were found
        if (requests.count === 0) {
            throw new Error('No investment requests found for this user');
        }

        return requests;
    } catch (error) {
        console.error('Error fetching investment requests by user ID:', error); // Log error for debugging
        throw error;
    }
};


// Get investment request by ID
const getInvestmentRequestById = async (request_id) => {
    try {
        const request = await db.InvestmentRequest.findByPk(request_id, {
            include: [
                { model: db.User, as: 'user' ,include:[{model:db.UserRole,as:'user_role',required:false}]},
                { model: db.InvestmentOffer, as: 'investmentOffers' },
                {
                    model: db.Image,
                    as: 'investment_request_images',
                    where: { entry_type: 'investmentRequests' },
                    required: false // Left join to include images only if they exist
                }
            ],
        });

        if (!request) {
            throw new Error('Investment request not found');
        }

        return request;
    } catch (error) {
        throw error;
    }
};

const changeInvestmentRequestStatus = async (request_id, newStatus) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Fetch the investment request
        const investmentRequest = await db.InvestmentRequest.findByPk(request_id, { transaction });

        if (!investmentRequest) {
            throw new Error('Investment request not found');
        }

        // Validate the new status
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status');
        }

        // Update the status
        investmentRequest.status = newStatus;
        await investmentRequest.save({ transaction });

        // Optionally, you can include associated images or other relations
        const updatedRequest = await db.InvestmentRequest.findByPk(request_id, {
            include: [
                {
                    model: db.Image,
                    as: 'investment_request_images',
                    where: { entry_type: 'investmentRequest' },
                    required: false
                },
                // Add other associations if needed
            ],
            transaction
        });

        await transaction.commit();
        return updatedRequest;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    createInvestmentRequest,
    updateInvestmentRequest,
    deleteInvestmentRequest,
    getInvestmentRequests,
    getInvestmentRequestsByUserId,
    getInvestmentRequestById,
    changeInvestmentRequestStatus
};
