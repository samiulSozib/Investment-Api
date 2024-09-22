const express = require('express');
const router = express.Router();
const newsBlogController = require('../controllers/newsBlogController');
const upload=require('../middlewares/upload')


router.post('/',upload.array('news_blogs_images'), newsBlogController.createNewsBlog);
router.put('/:id',upload.array('news_blogs_images'), newsBlogController.updateNewsBlog);
router.delete('/:id', newsBlogController.deleteNewsBlog);
router.get('/', newsBlogController.getAllNewsBlogs);
router.get('/:id', newsBlogController.getNewsBlogById);

module.exports = router;
