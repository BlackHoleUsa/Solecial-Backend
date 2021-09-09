const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, collectionService, auctionService } = require('../services');
const { User } = require('../models');
const helpers = require('../utils/helpers');
const EVENT = require('../triggers/custom-events').customEvent;
const ApiError = require('../utils/apiError');

const getAuctionListing = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;
  const data = await auctionService.getOpenAuctions(page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', page, data });
});

module.exports = {
  getAuctionListing,
};
