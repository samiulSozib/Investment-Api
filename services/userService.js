const db = require('../database/db');

// Get all users
const getAllUsers = async (page, item_per_page) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Construct the base query options
        const options = {
            include: [
                {
                    model: db.Image,
                    as: 'profile_image',
                    where: { entry_type: 'user' },
                    required: false
                },
                {
                    model: db.UserRole,
                    as: 'user_role',
                    required: false
                },
                {
                    model: db.Investment,
                    as: 'investments',
                    required: false
                },
                {
                    model: db.InvestmentRequest,
                    as: 'investmentRequests',
                    required: false
                },
                {
                    model: db.InvestmentOffer,
                    as: 'investmentOffers',
                    required: false
                },
                {
                    model: db.NewsBlog,
                    as: 'newsBlogs',
                    required: false
                }
            ]
        };

        // If pagination is provided, add limit and offset
        if (page && item_per_page) {
            const offset = (Math.max(page, 1) - 1) * item_per_page; // Ensure page is at least 1
            options.limit = item_per_page;
            options.offset = offset;
        }

        // Fetch all users with the specified options
        const users = await db.User.findAndCountAll(options);

        // Commit the transaction
        await transaction.commit();

        return users;
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error('Error fetching users:', error); // Log error for debugging
        throw error;
    }
};



// Get a user by ID
const getUserById = async (userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Begin the transaction
        const user = await db.User.findByPk(userId, {
            include: [
            {
                model: db.Image,
                as: 'profile_image',
                where: {entry_type: 'user' },
                required: false 
            },
            {
                model:db.UserRole,
                as:'user_role',
                required:false
            },
            {
                model: db.Investment,
                as: 'investments',
                required: false, 
            },
            {
                model: db.InvestmentRequest,
                as: 'investmentRequests',
                required: false, 
                include:[
                    {
                        model:db.InvestmentOffer,
                        as:'investmentOffers',
                        required:false
                    }
                ]
                
            },
            {
                model:db.InvestmentOffer,
                as:'investmentOffers',
                required:false
            },
            {
                model: db.NewsBlog,
                as: 'newsBlogs',
                required: false 
            },
        ], transaction 
        });
        
        if (!user) {
            throw new Error('User not found');
        }

        // Commit the transaction
        await transaction.commit();

        return user;
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        throw error;
    }
};

// get user dashboard data 

const getUserDashboardData = async (userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Begin the transaction
        const user = await db.User.findByPk(userId, {
            include: [
            {
                model: db.Image,
                as: 'profile_image',
                where: {entry_type: 'user' },
                required: false 
            },
            {
                model:db.UserRole,
                as:'user_role',
                required:false
            }
            
        ], transaction 
        });
        
        if (!user) {
            throw new Error('User not found');
        }

        // Calculate the total investment amount by status
        const investmentSummaries = await db.Investment.calculateInvestmentSummaryByStatus(userId);


        // Calculate total offered amount by status for the investor
        const investmentOfferSummaries = await db.InvestmentOffer.calculateTotalOfferedByStatus(userId);

        // Calculate requested amount by status for the user
        const InvestmentRequestSummaries = await db.InvestmentRequest.calculateRequestedAmountByStatus(userId);




        // Commit the transaction
        await transaction.commit();

        return {user,investmentSummaries,investmentOfferSummaries,InvestmentRequestSummaries};
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        throw error;
    }
};

// Delete a user
const deleteUser = async (userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findByPk(userId, { transaction });
        if (!user) {
            throw new Error('User not found');
        }

        await db.User.destroy({
            where: { id: userId },
            transaction
        });

        await transaction.commit();
        return { message: 'User deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    getUserDashboardData
};
