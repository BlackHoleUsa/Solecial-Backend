const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { auctionService } = require('../services');

const { AUCTION_FILTERS } = require('../utils/enums');

const getAuctionListing = catchAsync(async (req, res) => {
  const { page, perPage, filter, min, max } = req.query;

  let sort = { createdAt: -1 };
  let whereQuery = {};

  switch (filter) {
    case AUCTION_FILTERS.NEW:
      sort = { createdAt: -1 };
      break;

    case AUCTION_FILTERS.HAS_OFFER:
      whereQuery = { 'bids.0': { $exists: true } };
  }

  if (min) {
    whereQuery = { initialPrice: { $gt: parseInt(min) } };
  }
  if (max) {
    whereQuery = { initialPrice: { $lt: parseInt(max) } };
  }
  if (min && max) {
    whereQuery = { initialPrice: { $lt: parseInt(max), $gt: parseInt(min) } };
  }
  if (min && max && filter == AUCTION_FILTERS.HAS_OFFER) {
    whereQuery = { initialPrice: { $lt: parseInt(max), $gt: parseInt(min) }, 'bids.0': { $exists: true } };
  }
  if (min && filter == AUCTION_FILTERS.HAS_OFFER) {
    whereQuery = { initialPrice: { $gt: parseInt(min) }, 'bids.0': { $exists: true } };
  }
  if (max && filter == AUCTION_FILTERS.HAS_OFFER) {
    whereQuery = { initialPrice: { $lt: parseInt(min) }, 'bids.0': { $exists: true } };
  }

  const data = await auctionService.getOpenAuctions(page, perPage, sort, whereQuery);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', page, data });
});

module.exports = {
  getAuctionListing,
};
