const { User, Collection, Artwork, Auction } = require('../models');
const { getUserByAddress } = require('../services/user.service');

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
  const collection = await Collection.findOne({ collectionAddress: colAddress });
  const artwork = await Artwork.findOne({ collectionId: collection._id, tokenId: tokenId });

  if (await auctionService.artworkExistsInAuction(artwork._id)) {
    console.log('Artwork is already on auction');
    return;
  }
};

module.exports = {
  updateCollectionAddress,
  handleNewAuction,
};
