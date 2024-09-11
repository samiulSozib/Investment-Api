const express = require('express');
const router = express.Router();
const bestPerformingInvestorController = require('../controllers/bestPerformingInvestorController');


router.post('/', bestPerformingInvestorController.createBestPerformingInvestor);
router.put('/:id', bestPerformingInvestorController.updateBestPerformingInvestor);
router.delete('/:id', bestPerformingInvestorController.deleteBestPerformingInvestor);
router.get('/', bestPerformingInvestorController.getAllBestPerformingInvestors);
router.get('/:id', bestPerformingInvestorController.getBestPerformingInvestorById);

module.exports = router;
