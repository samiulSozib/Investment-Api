// services/businessService.js
const db = require('../database/db');
const { sequelize } = require('../database/db');
const { Op } = require('sequelize');

// Create Business
const createBusiness = async ({ name, category_id, min_investment, max_investment, min_investment_period, max_investment_period, profit_share_ratio, loss_share_ratio,files }) => {
    const transaction = await sequelize.transaction();

    try {
        // Create the new business
        const newBusiness = await db.Business.create({
            name,
            category_id,
            min_investment,
            max_investment,
            min_investment_period,
            max_investment_period,
            profit_share_ratio,
            loss_share_ratio,
            status: 'inactive'
        }, { transaction });

        if (files && files.length > 0) {
            //console.log(files.length)
            const imageEntries = files.map(file => ({
                entry_type: 'business',
                foreign_key_id: newBusiness.id,
                image_url: `${process.env.base_url}/uploads/${file.filename}`
            }));

            await db.Image.bulkCreate(imageEntries, { transaction });
        }

        const createdBusiness = await db.Business.findByPk(newBusiness.id, {
            include: [
                {
                    model:db.BusinessCategory,
                    as:'category',
                    required:false
                },
                {
                model: db.Image,
                as: 'business_images',
                where: { entry_type: 'business' },
                required: false // Left join to include images only if they exist
            }
        ],
            transaction
        });

        await transaction.commit();
        return createdBusiness;
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        throw error;
    }
};

// Update Business
const updateBusiness = async (id, { name, category_id, min_investment, max_investment, min_investment_period, max_investment_period, profit_share_ratio, loss_share_ratio,files,existing_images }) => {
    const transaction = await sequelize.transaction();

    try {
        // Check if the business exists
        const existingBusiness = await db.Business.findByPk(id, { transaction });

        if (!existingBusiness) {
            throw new Error('Business not found');
        }

        // Update business details
        await db.Business.update({
            name,
            category_id,
            min_investment,
            max_investment,
            min_investment_period,
            max_investment_period,
            profit_share_ratio,
            loss_share_ratio
        }, {
            where: { id },
            transaction
        });

        if (existing_images) {
            // Delete images that are NOT in the existingImagesToKeep array
            await db.Image.destroy({
                where: {
                    entry_type: 'business',
                    foreign_key_id: id,
                    image_url: { [db.Sequelize.Op.notIn]: JSON.parse(existing_images) }
                },
                transaction
            });
        } else {
            // No existing images to keep, delete all
            await db.Image.destroy({
                where: {
                    entry_type: 'business',
                    foreign_key_id: id
                },
                transaction
            });
        }

        // If new files are uploaded, handle the images
        if (files && files.length > 0) {
            // Save new images
            const imageEntries = files.map(file => ({
                entry_type: 'business',
                foreign_key_id: id,
                image_url: `${process.env.base_url}/uploads/${file.filename}`
            }));

            await db.Image.bulkCreate(imageEntries, { transaction });
        }

        const updatedBusiness = await db.Business.findByPk(id, {
            include: [
                {
                    model:db.BusinessCategory,
                    as:'category',
                    required:false
                },
                {
                model: db.Image,
                as: 'business_images',
                where: { entry_type: 'business' },
                required: false // Left join to include images only if they exist
                }
            ],
            transaction
        });


        await transaction.commit();
        return updatedBusiness;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Fetch Business By ID
const getBusinessById = async (id) => {
    const transaction = await db.sequelize.transaction();

    try {
        const business = await db.Business.findByPk(id, {
            include: [
                { model: db.BusinessCategory, as: 'category' },
                {
                    model:db.Investment, as:'investments',
                    include:[{model:db.User,required:false,include:[{model:db.UserRole,as:'user_role',required:false}]}]
                },
                {
                    model: db.Image,
                    as: 'business_images',
                    where: { entry_type: 'business' },
                    required: false // Left join to include images only if they exist
                }
            ],
            transaction
        });

        if (!business) {
            throw new Error('Business not found');
        }

        await transaction.commit(); // Commit the transaction on success
        return business;
    } catch (error) {
        await transaction.rollback(); // Rollback if there's an error
        throw error;
    }
};


// Fetch All Businesses
const getAllBusinesses = async (page, item_per_page) => {
    const transaction = await db.sequelize.transaction(); // Start transaction
    console.log(page,item_per_page)
    try {
        // If pagination is provided
        const options = {
            include: [
                {
                    model: db.BusinessCategory, as: 'category'
                },
                {
                    model: db.Investment, as: 'investments',
                    include: [
                        {
                            model: db.User,
                            required: false, // Left join
                            include: [{ model: db.UserRole, as: 'user_role', required: false }]
                        }
                    ]
                },
                {
                    model: db.Image,
                    as: 'business_images',
                    where: { entry_type: 'business' },
                    required: false // Left join to include images only if they exist
                }
            ],
            transaction // Execute within transaction
        };

        // Add pagination only if both page and item_per_page are provided
        if (page && item_per_page) {
            const offset = (Math.max(page, 1) - 1) * item_per_page;
            options.limit = item_per_page;
            options.offset = offset;
        }

        const businesses = await db.Business.findAndCountAll(options);

        await transaction.commit(); // Commit the transaction on success
        return businesses;
    } catch (error) {
        await transaction.rollback(); // Rollback on error
        console.error('Error fetching businesses:', error); // Log error for debugging
        throw error;
    }
};


// Delete Business
const deleteBusiness = async (id) => {
    const transaction = await sequelize.transaction();

    try {
        // Check if the business exists
        const existingBusiness = await db.Business.findByPk(id, { transaction });

        if (!existingBusiness) {
            throw new Error('Business not found');
        }

        // Delete the business
        await db.Business.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get Business By Category
const getBusinessByCategory = async (category_id,page,item_per_page) => {
    const offset=(page-1)*item_per_page
    const transaction = await sequelize.transaction();
    try {
        const businesses = await db.Business.findAndCountAll({
            where: { category_id },
            include: [
                { model: db.BusinessCategory, as: 'category' },
                {
                    model:db.Investment, as:'investments',
                    include:[{model:db.User,required:false,include:[{model:db.UserRole,as:'user_role',required:false}]}]
                },
                {
                    model: db.Image,
                    as: 'business_images',
                    where: { entry_type: 'business' },
                    required: false // Left join to include images only if they exist
                }
            ],
            limit:item_per_page,
            offset:offset
            ,transaction
        });

        if (businesses.length === 0) {
            throw new Error('No businesses found for this category');
        }
        await transaction.commit(); // Commit the transaction on success
        return businesses;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


const changeBusinessStatus = async (id, newStatus) => {
    const transaction = await db.sequelize.transaction();

    try {
        const business = await db.Business.findByPk(id, { transaction });

        if (!business) {
            throw new Error('Business not found');
        }

        // Validate the new status
        const validStatuses = ['active', 'inactive', 'closed'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status');
        }

        // Update the status
        business.status = newStatus;
        await business.save({ transaction });

        await transaction.commit();
        return business;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};



module.exports = {
    createBusiness,
    updateBusiness,
    getBusinessById,
    getAllBusinesses,
    deleteBusiness,
    getBusinessByCategory,
    changeBusinessStatus
};
