const { User, Collection, Artwork } = require('../models');

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
  const { artworkId, bidId } = params;
  await Artwork.findOneAndUpdate(
    { _id: artworkId },
    {
      $push: { bids: bidId },
    }
  );
  console.log('bid saved in artwork successfully');
};

module.exports = {
  addCollectionInUser,
  addArtworkInUser,
  addArtworkInCollection,
  saveBidInArtwork,
};
