const express = require('express');
const transController = require('../controllers/transaction');
const { protect } = require('../middleware/protect');
const {
  transactionValidator,
  transactionUpdateValidator,
} = require('./../middleware/validator');

const router = express.Router();

router
  .route('/transaction/:transId?')
  .get(protect, transController.getTrans)
  .post(protect, transactionValidator, transController.createTrans)
  .put(protect, transactionUpdateValidator, transController.updateTrans)
  .delete(protect, transController.deleteTrans);

module.exports = router;
