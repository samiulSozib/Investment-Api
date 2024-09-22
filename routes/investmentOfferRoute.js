// routes/investmentOfferRoutes.js

const express = require('express');
const router = express.Router();
const investmentOfferController = require('../controllers/investmentOfferController');

router.post('/', investmentOfferController.createInvestmentOffer);
router.put('/:id', investmentOfferController.updateInvestmentOffer);
router.delete('/:id', investmentOfferController.deleteInvestmentOffer);
router.get('/', investmentOfferController.getInvestmentOffers);
router.get('/request/:request_id', investmentOfferController.getInvestmentOffersByRequestId);
router.get('/:id', investmentOfferController.getInvestmentOfferById);
router.patch('/:id/status', investmentOfferController.changeStatus);


module.exports = router;
