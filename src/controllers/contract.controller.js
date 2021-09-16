const { User, Collection, Artwork, Auction } = require('../models');
const { getUserByAddress } = require('../services/user.service');
const { AUCTION_CONTRACT_INSTANCE } = require('../config/contract.config');
const LISTENERS = require('../controllers/listeners.controller');
const { auctionService } = require('../services');

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
      endTime,
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

module.exports = {
  updateCollectionAddress,
  handleNewAuction,
};
