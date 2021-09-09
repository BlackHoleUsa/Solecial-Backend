const { Bid, Auction } = require('../models');
const { AUCTION_STATUS } = require('../utils/enums');
const artworkService = require('./artwork.service');

const saveAuction = async (params) => {
  return await Auction.create(params);
};

const artworkExistsInAuction = async (artworkId) => {
  const auction = await Auction.find({ artwork: artworkId });
  return auction.length > 0;
};

const getOpenAuctions = async (page, perPage) => {
  const auctions = await Auction.find({ status: 'open' })
    .populate('artwork owner creater bids')
    .limit(parseInt(perPage))
    .skip(page * perPage);

  return auctions;
};

const checkAndCompleteAuctionStatus = async () => {
  const auctions = await Auction.find({ status: 'open' });

  for (auction of auctions) {
    const currentDate = new Date();
    const closingDate = new Date(auction.endTime);
    if (currentDate > closingDate) {
      await Auction.findOneAndUpdate({ _id: auction._id }, { status: AUCTION_STATUS.CLOSED });
      await artworkService.closeArtworkAuction(auction.artwork);
    }
  }
};

module.exports = {
  saveAuction,
  artworkExistsInAuction,
  getOpenAuctions,
  checkAndCompleteAuctionStatus,
};
