const express = require('express');
const { generalController } = require('../../controllers');
const validate = require('../../middlewares/validate');
// const auctionController = require('../../controllers/auction.controller');
const { auctionValidation, generalValidation } = require('../../validations');

const router = express.Router();

router.get('/search', generalController.handleSearch);
router.get('/getAppActivity', validate(generalValidation.getActivityVS), generalController.getAppActivity);

module.exports = router;
