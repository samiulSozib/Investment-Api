const express = require('express');
const router = express.Router();
const newsBlogController = require('../controllers/newsBlogController');


router.post('/', newsBlogController.createNewsBlog);
router.put('/:id', newsBlogController.updateNewsBlog);
router.delete('/:id', newsBlogController.deleteNewsBlog);
router.get('/', newsBlogController.getAllNewsBlogs);
router.get('/:id', newsBlogController.getNewsBlogById);

module.exports = router;
