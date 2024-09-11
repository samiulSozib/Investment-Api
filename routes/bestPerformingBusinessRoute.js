const express = require('express');
const router = express.Router();
const bestPerformingBusinessController = require('../controllers/bestPerformingBusinessController');


router.post('/', bestPerformingBusinessController.createBestPerformingBusiness);
router.put('/:id', bestPerformingBusinessController.updateBestPerformingBusiness);
router.delete('/:id', bestPerformingBusinessController.deleteBestPerformingBusiness);
router.get('/', bestPerformingBusinessController.getAllBestPerformingBusinesses);
router.get('/:id', bestPerformingBusinessController.getBestPerformingBusinessById);

module.exports = router;
