const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const upload = require('../middlewares/upload');

router.post('/',upload.array('business_images'), businessController.createBusiness);
router.get('/:id', businessController.getBusinessById);
router.get('/', businessController.getAllBusinesses);
router.put('/:id',upload.array('business_images'), businessController.updateBusiness);
router.delete('/:id', businessController.deleteBusiness);
router.get('/category/:category_id', businessController.getBusinessByCategory);
router.patch('/:id/status', businessController.changeStatus);


module.exports = router;
