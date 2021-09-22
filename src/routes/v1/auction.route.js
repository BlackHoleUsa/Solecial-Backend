const express = require('express');
const validate = require('../../middlewares/validate');
const auctionController = require('../../controllers/auction.controller');
const { auctionValidation } = require('../../validations');

const router = express.Router();

router.get('/getAuctionListing', [validate(auctionValidation.getOpenAuctionVS)], auctionController.getAuctionListing);

module.exports = router;
