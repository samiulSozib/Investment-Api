const newsBlogService = require('../services/newsBlogService');

// Create a new blog
exports.createNewsBlog = async (req, res) => {
    const { title, content, author_id } = req.body;
    const files=req.files

    try {
        const newBlog = await newsBlogService.createNewsBlog({
            title,
            content,
            author_id,
            files
        });
        return res.status(201).json({
            status: true,
            message: 'News blog created successfully',
            data: newBlog
        });
    } catch (error) {
        
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Update a news blog by ID
exports.updateNewsBlog = async (req, res) => {
    const blogId = req.params.id;
    const { title, content,existing_images } = req.body;
    const files=req.files

    //console.log(existing_images)
    //console.log(files)

    try {
        const updatedBlog = await newsBlogService.updateNewsBlog(blogId, {
            title,
            content,
            existing_images,
            files
        });
        return res.status(200).json({
            status: true,
            message: 'News blog updated successfully',
            data: updatedBlog
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Delete a news blog by ID
exports.deleteNewsBlog = async (req, res) => {
    const blogId = req.params.id;

    try {
        await newsBlogService.deleteNewsBlog(blogId);
        return res.status(200).json({
            status: true,
            message: 'News blog deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Get all news blogs
exports.getAllNewsBlogs = async (req, res) => {
    const page=parseInt(req.query.page)||1
    const item_per_page=parseInt(req.query.item_per_page)||10
    try {
        const blogs = await newsBlogService.getAllNewsBlogs(page,item_per_page);
        const total_pages = Math.ceil(blogs.count / item_per_page);
        return res.status(200).json({
            status: true,
            data: blogs.rows,
            payload:{
                pagination:{
                    current_page:page,
                    per_page:item_per_page,
                    total_items:blogs.count,
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

// Get news blog by ID
exports.getNewsBlogById = async (req, res) => {
    const blogId = req.params.id;

    try {
        const blog = await newsBlogService.getNewsBlogById(blogId);
        return res.status(200).json({
            status: true,
            data: blog
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
