const { User, Collection, Artwork, Auction, History, Notification } = require('../models');
const { MINT_STATUS } = require('../utils/enums');

const addCollectionInUser = async (params) => {
  const { collectionId, userId } = params;
  await User.findOneAndUpdate(userId, {
    $push: { collections: collectionId },
  });
  console.log('collection added in user successfully');
};

const addArtworkInUser = async (params) => {
  const { artworkId, userId } = params;
  await User.findOneAndUpdate(userId, {
    $push: { artworks: artworkId },
  });
  console.log('artwork added in user successfully');
};

const addArtworkInCollection = async (params) => {
  const { artworkId, collectionId } = params;
  await Collection.findOneAndUpdate(
    { _id: collectionId },
    {
      $push: { artworks: artworkId },
    }
  );
  console.log('artwork added in collection successfully');
};

const saveBidInArtwork = async (params) => {
  const { artworkId, bidId, auctionId } = params;
  await Artwork.findOneAndUpdate(
    { _id: artworkId },
    {
      $push: { bids: bidId },
    }
  );

  await Auction.findOneAndUpdate(
    { _id: auctionId },
    {
      $push: { bids: bidId },
    }
  );

  console.log('bid saved in artwork successfully');
};

const openArtworkAuction = async (params) => {
  const { artworkId, auction } = params;
  await Artwork.findOneAndUpdate(
    { _id: artworkId },
    {
      auction: auction,
      isAuctionOpen: true,
      auctionMintStatus: MINT_STATUS.COMPLETE,
    }
  );
  console.log('auction opened for artwork successfully');
};

const updateArtworkHistory = async (params) => {
  await History.create(params);
};

const createNotification = async (params) => {
  await Notification.create(params);
};

module.exports = {
  addCollectionInUser,
  addArtworkInUser,
  addArtworkInCollection,
  saveBidInArtwork,
  openArtworkAuction,
  updateArtworkHistory,
  createNotification,
};
