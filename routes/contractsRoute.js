const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractsController');

router.post('/', contractController.createContract);
router.put('/:id', contractController.updateContract);
router.delete('/:id', contractController.deleteContract);
router.get('/', contractController.getContracts);
router.get('/:id', contractController.getContractById);
router.patch('/:id/status', contractController.changeStatus);


module.exports = router;
