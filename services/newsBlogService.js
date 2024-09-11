const db = require('../database/db');

// Create a new news blog
const createNewsBlog = async ({ title, content, author_id }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const author = await db.User.findByPk(author_id, { transaction });
        if (!author) {
            throw new Error('Author not found');
        }

        const newBlog = await db.NewsBlog.create({
            title,
            content,
            author_id
        }, { transaction });

        await transaction.commit();
        return newBlog;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update an existing news blog
const updateNewsBlog = async (blogId, { title, content }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const blog = await db.NewsBlog.findByPk(blogId, { transaction });
        if (!blog) {
            throw new Error('News blog not found');
        }

        await db.NewsBlog.update({
            title,
            content
        }, {
            where: { id: blogId },
            transaction
        });

        const updatedBlog = await db.NewsBlog.findByPk(blogId, { transaction });
        await transaction.commit();
        return updatedBlog;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete a news blog
const deleteNewsBlog = async (blogId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const blog = await db.NewsBlog.findByPk(blogId, { transaction });
        if (!blog) {
            throw new Error('News blog not found');
        }

        await db.NewsBlog.destroy({
            where: { id: blogId },
            transaction
        });

        await transaction.commit();
        return { message: 'News blog deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Get all news blogs
const getAllNewsBlogs = async () => {
    try {
        return await db.NewsBlog.findAll({
            include: [{ model: db.User, as: 'author' }]
        });
    } catch (error) {
        throw error;
    }
};

// Get a news blog by ID
const getNewsBlogById = async (blogId) => {
    try {
        const blog = await db.NewsBlog.findByPk(blogId, {
            include: [{ model: db.User, as: 'author' }]
        });

        if (!blog) {
            throw new Error('News blog not found');
        }

        return blog;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createNewsBlog,
    updateNewsBlog,
    deleteNewsBlog,
    getAllNewsBlogs,
    getNewsBlogById
};
