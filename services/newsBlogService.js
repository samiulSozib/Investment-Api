const db = require('../database/db');

// Create a new news blog
const createNewsBlog = async ({ title, content, author_id,files }) => {
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

        //console.log(files)

        if (files && files.length > 0) {
            const imageEntries = files.map(file => ({
                entry_type: 'newsBlogs',
                foreign_key_id: newBlog.id,
                image_url: `${process.env.base_url}/uploads/${file.filename}`
            }));

            await db.Image.bulkCreate(imageEntries, { transaction });
        }

        const createdBlog = await db.NewsBlog.findByPk(newBlog.id, {
            include: [{
                model: db.Image,
                as: 'news_blogs_images',  // Use the same alias defined in the association
                where: { entry_type: 'newsBlogs' },
                required: false // Left join to include images only if they exist
            }],
            transaction
        });
        
        await transaction.commit();
        return createdBlog;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update an existing news blog
const updateNewsBlog = async (blogId, { title, content, files, existing_images }) => {
    const transaction = await db.sequelize.transaction();
    try {
        const blog = await db.NewsBlog.findByPk(blogId, { transaction });
        if (!blog) {
            throw new Error('News blog not found');
        }

        // Update blog title and content
        await db.NewsBlog.update({
            title,
            content
        }, {
            where: { id: blogId },
            transaction
        });

        if (existing_images) {
            // Delete images that are NOT in the existingImagesToKeep array
            await db.Image.destroy({
                where: {
                    entry_type: 'newsBlogs',
                    foreign_key_id: blogId,
                    image_url: { [db.Sequelize.Op.notIn]: JSON.parse(existing_images) }
                },
                transaction
            });
        } else {
            // No existing images to keep, delete all
            await db.Image.destroy({
                where: {
                    entry_type: 'newsBlogs',
                    foreign_key_id: blogId
                },
                transaction
            });
        }

        // Save new images (if any)
        if (files && files.length > 0) {
            const imageEntries = files.map(file => ({
                entry_type: 'newsBlogs',
                foreign_key_id: blogId,
                image_url: `${process.env.base_url}/uploads/${file.filename}`
            }));

            await db.Image.bulkCreate(imageEntries, { transaction });
        }

        // Fetch the updated blog with images
        const updatedBlog = await db.NewsBlog.findByPk(blogId, {
            include: [{
                model: db.Image,
                as: 'news_blogs_images',
                where: { entry_type: 'newsBlogs' },
                required: false
            }],
            transaction
        });

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
const getAllNewsBlogs = async (page,item_per_page) => {
    const offset=(page-1)*item_per_page
    try {
        return await db.NewsBlog.findAndCountAll({
            include: [
                { model: db.User, as: 'author' },
                {
                    model: db.Image,
                    as: 'news_blogs_images',  // Use the same alias defined in the association
                    where: { entry_type: 'newsBlogs' },
                    required: false // Left join to include images only if they exist
                }
            ],
            limit:item_per_page,
            offset:offset
        });
    } catch (error) {
        throw error;
    }
};

// Get a news blog by ID
const getNewsBlogById = async (blogId) => {
    try {
        const blog = await db.NewsBlog.findByPk(blogId, {
            include: [
                { model: db.User, as: 'author' },
                {
                    model: db.Image,
                    as: 'news_blogs_images',  // Use the same alias defined in the association
                    where: { entry_type: 'newsBlogs' },
                    required: false // Left join to include images only if they exist
                }
            ]
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
