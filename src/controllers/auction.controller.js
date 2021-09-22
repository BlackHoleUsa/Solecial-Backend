const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, collectionService, auctionService } = require('../services');
const { User } = require('../models');
const helpers = require('../utils/helpers');
const EVENT = require('../triggers/custom-events').customEvent;
const ApiError = require('../utils/ApiError');
const { AUCTION_FILTERS } = require('../utils/enums');

const getAuctionListing = catchAsync(async (req, res) => {
  const { page, perPage, filter } = req.query;

  let sort = { createdAt: -1 };

  switch (filter) {
    case AUCTION_FILTERS.NEW:
      const data = await auctionService.getOpenAuctions(page, perPage, { createdAt: -1 });
      return res.status(httpStatus.OK).send({ status: true, message: 'successfull', page, data });
      break;
    case AUCTION_FILTERS.HAS_OFFER:
      const bidAuctions = await auctionService.getAuctionsWithBids(page, perPage);
      return res.status(httpStatus.OK).send({ status: true, message: 'successfull', page, data: bidAuctions });
      break;
  }

  const data = await auctionService.getOpenAuctions(page, perPage, sort);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', page, data });
});

module.exports = {
  getAuctionListing,
};
