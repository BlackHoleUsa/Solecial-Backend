const { User, Collection } = require('../models');

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
  await Collection.findOneAndUpdate(collectionId, {
    $push: { artworks: artworkId },
  });
  console.log('artwork added in collection successfully');
};

module.exports = {
  addCollectionInUser,
  addArtworkInUser,
  addArtworkInCollection,
};
