const { User } = require('../models');

const addCollectionInUser = async (params) => {
  const { collectionId, userId } = params;
  await User.findOneAndUpdate(userId, {
    $push: { collections: collectionId },
  });
  console.log('collection added in user successfully');
};

module.exports = {
  addCollectionInUser,
};
