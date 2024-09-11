const express = require('express');
const router = express.Router();
const businessPerformanceController = require('../controllers/businessPerformanceController');


router.post('/', businessPerformanceController.createBusinessPerformance);
router.put('/:id', businessPerformanceController.updateBusinessPerformance);
router.delete('/:id', businessPerformanceController.deleteBusinessPerformance);
router.get('/', businessPerformanceController.getAllBusinessPerformances);
router.get('/:id', businessPerformanceController.getBusinessPerformanceById);

module.exports = router;
