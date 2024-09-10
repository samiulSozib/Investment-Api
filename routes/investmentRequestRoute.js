const express = require('express');
const router = express.Router();
const investmentRequestController = require('../controllers/investmentRequestController');


router.post('/', investmentRequestController.createInvestmentRequest);
router.put('/:id', investmentRequestController.updateInvestmentRequest);
router.delete('/:id', investmentRequestController.deleteInvestmentRequest);
router.get('/', investmentRequestController.getInvestmentRequests);
router.get('/user/:user_id', investmentRequestController.getInvestmentRequestsByUserId);
router.get('/:id', investmentRequestController.getInvestmentRequestById);

module.exports = router;
