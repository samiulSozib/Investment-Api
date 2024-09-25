const investmentService = require('../services/investmentService');

// Create a new investment
const createInvestment = async (req, res) => {
    const { user_id, business_id, amount, investment_date, investment_period, expected_return } = req.body;

    try {
        const newInvestment = await investmentService.createInvestment({
            user_id,
            business_id,
            amount,
            investment_date,
            investment_period,
            expected_return,
        });
        return res.status(201).json({
            status: true,
            message: 'Investment created successfully',
            data: newInvestment,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Update an existing investment
const updateInvestment = async (req, res) => {
    const investment_id = req.params.id;
    const { amount, investment_period, expected_return, status } = req.body;

    try {
        const updatedInvestment = await investmentService.updateInvestment(investment_id, {
            amount,
            investment_period,
            expected_return,
            status,
        });
        return res.status(200).json({
            status: true,
            message: 'Investment updated successfully',
            data: updatedInvestment,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Delete an investment
const deleteInvestment = async (req, res) => {
    const investment_id = req.params.id;

    try {
        await investmentService.deleteInvestment(investment_id);
        return res.status(200).json({
            status: true,
            message: 'Investment deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get all investments
const getInvestments = async (req, res) => {
    const page=parseInt(req.query.page)||1
    const item_per_page=parseInt(req.query.item_per_page)||10
    try {
        const investments = await investmentService.getInvestments(page,item_per_page);
        const total_pages = Math.ceil(investments.count / item_per_page);
        return res.status(200).json({
            status: true,
            data: investments.rows,
            payload:{
                pagination:{
                    current_page:page,
                    per_page:item_per_page,
                    total_items:investments.count,
                    total_pages:total_pages
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get investments by User ID
const getInvestmentsByUserId = async (req, res) => {
    const user_id = req.params.user_id;
    const page=parseInt(req.query.page)||1
    const item_per_page=parseInt(req.query.item_per_page)||10
    try {
        const investments = await investmentService.getInvestmentsByUserId(user_id,page,item_per_page);
        const total_pages = Math.ceil(investments.count / item_per_page);
        return res.status(200).json({
            status: true,
            data: investments.rows,
            payload:{
                pagination:{
                    current_page:page,
                    per_page:item_per_page,
                    total_items:investments.count,
                    total_pages:total_pages
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get investments by Business ID
const getInvestmentsByBusinessId = async (req, res) => {
    const page=parseInt(req.query.page)||1
    const item_per_page=parseInt(req.query.item_per_page)||10
    const business_id = req.params.business_id;

    try {
        const investments = await investmentService.getInvestmentsByBusinessId(business_id,page,item_per_page);
        const total_pages = Math.ceil(investments.count / item_per_page);
        return res.status(200).json({
            status: true,
            data: investments.rows,
            payload:{
                pagination:{
                    current_page:page,
                    per_page:item_per_page,
                    total_items:investments.count,
                    total_pages:total_pages
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const changeStatus = async (req, res) => {
    const { id } = req.params; // investment_id
    const { status } = req.body;

    try {
        const updatedInvestment = await investmentService.changeInvestmentStatus(id, status);
        return res.status(200).json({
            status: true,
            message: 'Investment status updated successfully',
            data: updatedInvestment,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message || 'Error updating investment status',
        });
    }
};

module.exports={
    createInvestment,
    updateInvestment,
    deleteInvestment,
    getInvestments,
    getInvestmentsByUserId,
    getInvestmentsByBusinessId,
    changeStatus
}
