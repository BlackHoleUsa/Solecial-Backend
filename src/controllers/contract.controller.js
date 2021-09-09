const { User, Collection, Artwork, Auction } = require('../models');
const { getUserByAddress } = require('../services/user.service');

const updateCollectionAddress = async (collectionId, address) => {
  await Collection.findOneAndUpdate(
    { _id: collectionId },
    {
      collectionAddress: address,
    }
  );
  console.log('collection address updated successfully');
};

module.exports = {
  updateCollectionAddress,
};
