const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { auctionService } = require('../services');
const { SALE_STATUS } = require('../utils/enums');

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

const getSaleDetails = catchAsync(async (req, res) => {
  const { saleId } = req.query;

  const data = await auctionService.getSaleDetails(saleId);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', data });
});


module.exports = {
  getSaleListing,
  getSaleDetails
};