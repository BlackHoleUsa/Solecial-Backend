const { Bid } = require('../models');

const saveBid = async (params) => {
  return await Bid.create(params);
};

const getAuctionBidsPopulated = async (auctionId, fieldsToPopulate) => {
  return await Bid.find({ auction: auctionId }).populate(fieldsToPopulate).lean();
};

module.exports = {
  saveBid,
  getAuctionBidsPopulated,
};
