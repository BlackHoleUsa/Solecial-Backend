const { User, Collection, Artwork, Auction } = require('../models');
const { getUserByAddress } = require('../services/user.service');

const updateCollectionAddress = async (CollectionAddress, owner, colName) => {
  const user = await User.findOne({ address: owner });

  const collection = await Collection.findOneAndUpdate(
    { owner: user._id, name: colName },
    {
      collectionAddress: CollectionAddress,
    },
    { new: true }
  );

  await Artwork.findOneAndUpdate(
    { collectionId: collection._id },
    {
      tokenId: 1,
    },
    { new: true }
  );
  console.log('collection address and artwork token id updated successfully');
};

module.exports = {
  updateCollectionAddress,
};
