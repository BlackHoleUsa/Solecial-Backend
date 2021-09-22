const { Bid, Auction, User } = require('../models');
const { AUCTION_STATUS } = require('../utils/enums');
const artworkService = require('./artwork.service');
const { AUCTION_CONTRACT_INSTANCE } = require('../config/contract.config');
const EVENT = require('../triggers/custom-events').customEvent;

const saveAuction = async (params) => {
  let res = await Auction.create(params);
  return res.toObject();
};

const artworkExistsInAuction = async (artworkId) => {
  let auction = await Auction.find({ artwork: artworkId, status: AUCTION_STATUS.OPEN });
  return auction.length > 0;
};

const getOpenAuctions = async (page, perPage, sort, whereQuery) => {
  const auctions = await Auction.find(whereQuery)
    .sort(sort)
    .populate('artwork owner creater bids')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();

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
      if (auction.bids.length > 0) {
        let aucData = await AUCTION_CONTRACT_INSTANCE.methods.AuctionList(auction.contractAucId).call();
        const { bidderAdd, latestBid, nftClaim, cancelled, ownerclaim } = aucData;
        let user = await User.findOne({ address: bidderAdd });
        let res = await Auction.findOneAndUpdate(
          { _id: auction._id },
          {
            auctionWinner: user._id,
            bidAmount: latestBid,
            nftClaim,
            cancelled,
            ownerclaim,
          }
        );
        console.log('DONE', res);
      }

      EVENT.emit('update-artwork-history', {
        artwork: auction.artwork,
        message: `auction closed`,
        auction: auction._id,
      });
    }
  }
};

const getClosedAuctions = async (userId, page, perPage) => {
  const auctions = await Auction.find({ auctionWinner: userId, status: AUCTION_STATUS.CLOSED, nftClaim: false })
    .populate('owner creater bids artwork')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();

  return auctions;
};

const getSoldAuctions = async (userId, page, perPage) => {
  const auctions = await Auction.find({ owner: userId, status: AUCTION_STATUS.CLOSED, ownerclaim: false })
    .populate('owner creater bids artwork')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();

  return auctions;
};
const getAuctionsWithBids = async (page, perPage) => {
  return await Auction.find({ 'bids.0': { $exists: true } })
    .populate('artwork owner creater bids')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();
};

module.exports = {
  saveAuction,
  artworkExistsInAuction,
  getOpenAuctions,
  checkAndCompleteAuctionStatus,
  getAuctionsWithBids,
  getClosedAuctions,
  getSoldAuctions,
};
