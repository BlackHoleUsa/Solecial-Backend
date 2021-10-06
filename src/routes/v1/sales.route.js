const express = require('express');
const validate = require('../../middlewares/validate');
const salesController = require('../../controllers/sales.controller');
const { auctionValidation } = require('../../validations');

const router = express.Router();

router.get('/getSaleListing', [validate(auctionValidation.getOpenSalesVS)], salesController.getSaleListing);

router.get('/getSaleDetails', [validate(auctionValidation.getSaleDetailsVs)], salesController.getSaleDetails);


module.exports = router;
