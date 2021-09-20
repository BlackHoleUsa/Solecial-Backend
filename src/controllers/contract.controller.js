const { User, Collection, Artwork, Auction } = require('../models');
const { getUserByAddress } = require('../services/user.service');
const { AUCTION_CONTRACT_INSTANCE } = require('../config/contract.config');
const LISTENERS = require('../controllers/listeners.controller');
const { auctionService, bidService } = require('../services');
const EVENT = require('../triggers/custom-events').customEvent;

const updateCollectionAddress = async (CollectionAddress, owner, colName) => {
  const user = await User.findOne({ address: owner });

  const collection = await Collection.findOneAndUpdate(
    { owner: user._id, name: colName },
    {
      collectionAddress: CollectionAddress,
    }
  );

  await Artwork.findOneAndUpdate(
    { collectionId: collection._id },
    {
      tokenId: 1,
    }
  );
  console.log('collection address and artwork token id updated successfully');
};

const handleNewAuction = async (colAddress, tokenId, aucId) => {
  try {
    const collection = await Collection.findOne({ collectionAddress: colAddress });
    const artwork = await Artwork.findOne({ collectionId: collection._id, tokenId: tokenId });

    if (await auctionService.artworkExistsInAuction(artwork._id)) {
      console.log('Artwork is already on auction');
      return;
    }
    let auctionData = await AUCTION_CONTRACT_INSTANCE.methods.AuctionList(aucId).call();
    const { endTime, startPrice } = auctionData;
    const { owner, creater } = artwork;
    const params = {
      initialPrice: startPrice,
      artwork: artwork._id,
      endTime: new Date(endTime * 1000),
      owner,
      creater,
      contractAucId: aucId,
    };

    const auction = await Auction.create(params);
    LISTENERS.openArtworkAuction({ artworkId: artwork._id, auction: auction._id });
  } catch (err) {
    console.log(err);
  }
};

const handleNewBid = async (bid, bidder, aucId) => {
  let auctionData = await AUCTION_CONTRACT_INSTANCE.methods.AuctionList(aucId).call();
  const { colAddress, owner, tokenId } = auctionData;
  const dbBidder = await User.findOne({ address: bidder });
  const dbOwner = await User.findOne({ address: owner });
  const collection = await Collection.findOne({ collectionAddress: colAddress });
  const artwork = await Artwork.findOne({ collectionId: collection._id, tokenId: tokenId });
  const auction = await Auction.findOne({ artwork: artwork._id, contractAucId: aucId });

  const params = {
    bidder: dbBidder._id,
    artwork: artwork._id,
    bid_amount: bid,
    owner: dbOwner._id,
    auction: auction._id,
  };

  const bid = await bidService.saveBid(params);

  EVENT.emit('save-bid-in-artwork', {
    artworkId: artwork._id,
    bidId: bid._id,
    auctionId: auction._id,
  });

  EVENT.emit('update-artwork-history', {
    artwork: artwork._id,
    message: `Bid placed on artwork`,
    auction: auction._id,
    bid: bid._id,
  });
};

module.exports = {
  updateCollectionAddress,
  handleNewAuction,
  handleNewBid,
};
