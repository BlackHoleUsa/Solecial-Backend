const { Bid, Auction } = require('../models');

const saveAuction = async (params) => {
  return await Auction.create(params);
};

module.exports = {
  saveAuction,
};
