const express = require('express');
const { generalController } = require('../../controllers');
const validate = require('../../middlewares/validate');
// const auctionController = require('../../controllers/auction.controller');
const { auctionValidation } = require('../../validations');

const router = express.Router();

router.get('/search', generalController.handleSearch);

module.exports = router;
