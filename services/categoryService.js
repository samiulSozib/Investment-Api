// services/categoryService.js

const db = require('../database/db'); // Adjust the path based on your project structure

// Create a new business category
const createCategory = async ({ name, description }) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Check if the category already exists
        const existingCategory = await db.BusinessCategory.findOne({
            where: { name },
            transaction,
        });

        if (existingCategory) {
            throw new Error('Category already exists');
        }

        // Create a new category
        const newCategory = await db.BusinessCategory.create(
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
        const category = await db.BusinessCategory.findByPk(category_id, {
            transaction,
        });

        if (!category) {
            throw new Error('Category not found');
        }

        // Update the category
        await db.BusinessCategory.update(
            { name, description },
            {
                where: { id: category_id },
                transaction,
            }
        );

        const updatedCategory = await db.BusinessCategory.findByPk(category_id, {
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
        const category = await db.BusinessCategory.findByPk(category_id, {
            transaction,
        });

        if (!category) {
            throw new Error('Category not found');
        }

        await db.BusinessCategory.destroy({
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
const getCategories = async (page,item_per_page) => {
    try {
        const options = {
            
        };
        if (page && item_per_page) {
            const offset = (Math.max(page, 1) - 1) * item_per_page;
            options.limit = item_per_page;
            options.offset = offset;
        }

        const categories = await db.BusinessCategory.findAndCountAll(options);
        return categories;
    } catch (error) {
        console.log(error)
        throw error;
    }
};



module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories
};
