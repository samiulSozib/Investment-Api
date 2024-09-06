// services/categoryService.js

const db = require('../models'); // Adjust the path based on your project structure

// Create a new business category
const createCategory = async ({ name, description }) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Check if the category already exists
        const existingCategory = await db.business_category.findOne({
            where: { name },
            transaction,
        });

        if (existingCategory) {
            throw new Error('Category already exists');
        }

        // Create a new category
        const newCategory = await db.business_category.create(
            { name, description },
            { transaction }
        );

        await transaction.commit();
        return newCategory;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update an existing business category
const updateCategory = async (category_id, { name, description }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const category = await db.business_category.findByPk(category_id, {
            transaction,
        });

        if (!category) {
            throw new Error('Category not found');
        }

        // Update the category
        await db.business_category.update(
            { name, description },
            {
                where: { id: category_id },
                transaction,
            }
        );

        const updatedCategory = await db.business_category.findByPk(category_id, {
            transaction,
        });

        await transaction.commit();
        return updatedCategory;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete a category
const deleteCategory = async (category_id) => {
    const transaction = await db.sequelize.transaction();
    try {
        const category = await db.business_category.findByPk(category_id, {
            transaction,
        });

        if (!category) {
            throw new Error('Category not found');
        }

        await db.business_category.destroy({
            where: { id: category_id },
            transaction,
        });

        await transaction.commit();
        return { message: 'Category deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all categories
const getCategories = async () => {
    try {
        const categories = await db.business_category.findAll();
        return categories;
    } catch (error) {
        throw error;
    }
};



module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories
};
