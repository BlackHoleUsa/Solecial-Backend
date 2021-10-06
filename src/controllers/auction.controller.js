const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { auctionService } = require('../services');

const { AUCTION_FILTERS, AUCTION_STATUS, SALE_STATUS } = require('../utils/enums');

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
    whereQuery.initialPrice = { $gt: parseInt(min) };
  }
  if (max) {
    whereQuery.initialPrice = { $lt: parseInt(max) };
  }
  if (min && max) {
    whereQuery.initialPrice = { $lt: parseInt(max), $gt: parseInt(min) };
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

  whereQuery.status = AUCTION_STATUS.OPEN;
  const data = await auctionService.getOpenAuctions(page, perPage, sort, whereQuery);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', page, data });
});

const getSaleListing = catchAsync(async (req, res) => {
  const { page, perPage, min, max } = req.query;

  let sort = { createdAt: -1 };
  let whereQuery = {};

  if (min) {
    whereQuery.price = { $gt: parseInt(min) };
  }
  if (max) {
    whereQuery.price = { $lt: parseInt(max) };
  }
  if (min && max) {
    whereQuery.price = { $lt: parseInt(max), $gt: parseInt(min) };
  }

  whereQuery.status = SALE_STATUS.OPEN;
  const data = await auctionService.getOpenSales(page, perPage, sort, whereQuery);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', page, data });
});

const checkIt = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;

  let response = await auctionService.artworkExistsInAuction('6152be3c3030060da7a85236');
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: response });
});

module.exports = {
  getAuctionListing,
  getSaleListing,
  checkIt,
};
