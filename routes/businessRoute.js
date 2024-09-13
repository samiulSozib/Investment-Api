const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

router.post('/', businessController.createBusiness);
router.get('/:id', businessController.getBusinessById);
router.get('/', businessController.getAllBusinesses);
router.put('/:id', businessController.updateBusiness);
router.delete('/:id', businessController.deleteBusiness);
router.get('/category/:category_id', businessController.getBusinessByCategory);


module.exports = router;
