const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');


router.post('/', investmentController.createInvestment);
router.put('/:id', investmentController.updateInvestment);
router.delete('/:id', investmentController.deleteInvestment);
router.get('/', investmentController.getInvestments);
router.get('/user/:user_id', investmentController.getInvestmentsByUserId);
router.get('/business/:business_id', investmentController.getInvestmentsByBusinessId);
router.patch('/:id/status',investmentController.changeStatus)

module.exports = router;
