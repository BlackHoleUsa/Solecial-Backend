const { User, Collection, Artwork, Auction } = require('../models');
const { getUserByAddress } = require('../services/user.service');

const updateCollectionAddress = async (CollectionAddress, owner, colName) => {
  const user = await User.findOne({ address: owner });

  await Collection.findOneAndUpdate(
    { owner: user._id, name: colName },
    {
      collectionAddress: CollectionAddress,
    }
  );
  console.log('collection address updated successfully');
};

module.exports = {
  updateCollectionAddress,
};
