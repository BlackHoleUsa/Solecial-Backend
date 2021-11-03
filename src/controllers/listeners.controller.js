const { User, Collection, Artwork, Auction, History, Notification, Transaction, Stats } = require('../models');
const { MINT_STATUS, STATS_UPDATE_TYPE } = require('../utils/enums');

const addCollectionInUser = async (params) => {
  const { collectionId, userId } = params;
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: { collections: collectionId },
    }
  );
  console.log('collection added in user successfully');
};

const addArtworkInUser = async (params) => {
  const { artworkId, userId } = params;
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: { artworks: artworkId },
    }
  );
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

const createTransaction = async (params) => {
  const transact = await Transaction.create(params);
  console.log('--transaction created successfully--:', transact);
};

const createStats = async (params) => {
  let stats = await Stats.create({
    user: params.userId,
    ownedArts: 0,
    purchasedArts: 0,
    soldArts: 0,
    totalPurchasesAmount: 0,
    totalSoldAmount: 0
  });
  let sts = stats.toObject()
  console.log(stats);
  await User.findOneAndUpdate({ _id: params.userId }, {
    stats: stats._id
  });
  console.log('stats updated successfully');
}

const userStatsUpdate = async (params) => {
  const { userId, type } = params;
  if (type === STATS_UPDATE_TYPE.ownedArts)
    await Stats.findOneAndUpdate({
      user: userId
    }, {
      $inc: { ownedArts: 1 }
    });

  console.log('STATS done');
}

module.exports = {
  addCollectionInUser,
  addArtworkInUser,
  addArtworkInCollection,
  saveBidInArtwork,
  openArtworkAuction,
  updateArtworkHistory,
  createNotification,
  createTransaction,
  createStats,
  userStatsUpdate
};
