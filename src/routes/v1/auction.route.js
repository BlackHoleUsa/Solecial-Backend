const express = require('express');
const validate = require('../../middlewares/validate');
const auctionController = require('../../controllers/auction.controller');
const { auctionValidation } = require('../../validations');

const router = express.Router();

router.get('/getAuctionListing', [validate(auctionValidation.getOpenAuctionVS)], auctionController.getAuctionListing);

router.get('/getAuctionDetails', [validate(auctionValidation.getAuctionDetailsVs)], auctionController.getAuctionDetails);

router.get('/checkIt', [], auctionController.checkIt);

module.exports = router;
