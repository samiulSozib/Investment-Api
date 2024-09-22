const express = require('express');
const router = express.Router();
const investmentRequestController = require('../controllers/investmentRequestController');
const upload=require('../middlewares/upload')


router.post('/',upload.array('investment_request_images'), investmentRequestController.createInvestmentRequest);
router.put('/:id',upload.array('investment_request_images'), investmentRequestController.updateInvestmentRequest);
router.delete('/:id', investmentRequestController.deleteInvestmentRequest);
router.get('/', investmentRequestController.getInvestmentRequests);
router.get('/user/:user_id', investmentRequestController.getInvestmentRequestsByUserId);
router.get('/:id', investmentRequestController.getInvestmentRequestById);
router.patch('/:id/status', investmentRequestController.changeStatus);


module.exports = router;
