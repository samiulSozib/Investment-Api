const db = require('../database/db');

// Get all users
const getAllUsers = async () => {
    const transaction = await db.sequelize.transaction();
    try {
        // Fetch all users and conditionally include associations based on their role
        const users = await db.User.findAll({
            include: [
                {
                    model: db.Image,
                    as: 'profile_image',
                    where: {entry_type: 'user' },
                    required: false 
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
                    
                },
                {
                    model: db.NewsBlog,
                    as: 'newsBlogs',
                    required: false 
                },
                {
                    model:db.InvestmentOffer,
                    as:'invesmentOffers',
                    required:false
                }
            ],
            transaction
        });

        // Commit the transaction
        await transaction.commit();

        return users;
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        throw error;
    }
};



// Get a user by ID
const getUserById = async (userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Begin the transaction
        const user = await db.User.findByPk(userId, { transaction });
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
    deleteUser
};
