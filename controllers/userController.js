const userService = require('../services/userService');

// Get all users
exports.getAllUsers = async (req, res) => {
    const page=parseInt(req.query.page)||null
    const item_per_page=parseInt(req.query.item_per_page)||null
    try {
        const users = await userService.getAllUsers(page,item_per_page);
        const total_pages =item_per_page? Math.ceil(users.count / item_per_page):1;
        return res.status(200).json({
            status: true,
            data: users.rows,
            payload:{
                pagination:{
                    current_page:page||1,
                    per_page:item_per_page||users.count,
                    total_items:users.count,
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

// Get a user by ID and Role
exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    

    try {
        const user = await userService.getUserById(userId);
        return res.status(200).json({
            status: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


// Get a user dashboard data 
exports.getUserDashboardData = async (req, res) => {
    const userId = req.params.id;
    

    try {
        const {user,investmentSummaries,investmentOfferSummaries,InvestmentRequestSummaries} = await userService.getUserDashboardData(userId);
        return res.status(200).json({
            status: true,
            data: {user,investmentSummaries,investmentOfferSummaries,InvestmentRequestSummaries}
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await userService.deleteUser(userId);
        return res.status(200).json({
            status: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
