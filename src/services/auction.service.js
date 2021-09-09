const { Bid, Auction } = require('../models');

const saveAuction = async (params) => {
  return await Auction.create(params);
};

const artworkExistsInAuction = async (artworkId) => {
  const auction = await Auction.find({ artwork: artworkId });
  return auction.length > 0;
};

module.exports = {
  saveAuction,
  artworkExistsInAuction,
};
