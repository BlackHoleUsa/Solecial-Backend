const { Bid } = require('../models');

const saveBid = async (params) => {
  const bid = await Bid.create(params);
  return bid.toObject();
};

const getAuctionBidsPopulated = async (auctionId, fieldsToPopulate) => {
  return await Bid.find({ auction: auctionId }).populate(fieldsToPopulate).lean();
};
const getBidder = async (bidId) => {
  return Bid.findOne({ bid: bidId }).populate('bid');
};
module.exports = {
  saveBid,
  getAuctionBidsPopulated,
  getBidder,
};
