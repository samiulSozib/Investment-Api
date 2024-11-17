// controllers/categoryController.js

const categoryService = require('../services/categoryService');

// Create a new category
const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newCategory = await categoryService.createCategory({ name, description });
        return res.status(201).json({
            status: true,
            message: 'Category created successfully',
            data: newCategory,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Update an existing category
const updateCategory = async (req, res) => {
    const category_id = req.params.id;
    const { name, description } = req.body;

    try {
        const updatedCategory = await categoryService.updateCategory(category_id, { name, description });
        return res.status(200).json({
            status: true,
            message: 'Category updated successfully',
            data: updatedCategory,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    const category_id = req.params.id;

    try {
        await categoryService.deleteCategory(category_id);
        return res.status(200).json({
            status: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    const page=parseInt(req.query.page)||null
    const item_per_page=parseInt(req.query.item_per_page)||null
    try {
        const categories = await categoryService.getCategories(page,item_per_page);
        const total_pages =item_per_page? Math.ceil(categories.count / item_per_page):1;
        return res.status(200).json({
            status: true,
            data: categories.rows,
            payload:{
                pagination:{
                    current_page:page||1,
                    per_page:item_per_page||categories.count,
                    total_items:categories.count,
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

module.exports={
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories
}