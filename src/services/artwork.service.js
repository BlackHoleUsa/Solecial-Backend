const { Artwork } = require('../models');
const { MINT_STATUS } = require('../utils/enums');

const getPopulatedArtwork = async (artworkId, fieldsToPopulate) => {
  return await Artwork.findOne({ _id: artworkId }).populate(fieldsToPopulate).lean();
};

const saveArtwork = async (params) => {
  const art = await Artwork.create(params);
  return art.toObject();
};

const getUserArtworks = async (userId, page, perPage) => {
  return await Artwork.find({ owner: userId })
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();
};

const getArtworkType = async (artworkType, page, perPage) => {
  if (artworkType == 'All') {
    return await Artwork.find()
      .limit(parseInt(perPage))
      .skip(page * perPage)
      .lean();
  }
  return await Artwork.find({ artwork_type: artworkType })
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();
};

const increaseArtworkViews = async (artworkId) => {
  return await Artwork.findOneAndUpdate({ _id: artworkId }, { $inc: { views: 1 } }, { new: true }).lean();
};

const updateArtwork = async (id, fieldToUpdate, value) => {
  return await Artwork.findOneAndUpdate({ _id: id }, { fieldToUpdate: value }, { new: true }).lean();
};

const updateArtworkMetaUrl = async (id, value) => {
  return await Artwork.findOneAndUpdate({ _id: id }, { $set: { meta_url: value } }, { new: true }).lean();
};

const getArtworkById = async (id) => {
  return await Artwork.findOne({ _id: id }).lean();
};

const closeArtworkAuction = async (artworkId) => {
  return await Artwork.findOneAndUpdate({ _id: artworkId }, { isAuctionOpen: false, auction: null, bids: [] }).lean();
};

const deleteArtworksByCollection = async (collectionId) => {
  return await Artwork.deleteMany({ collectionId });
};

const updateArtworkTokenId = async (artworkId, tokenId) => {
  return await Artwork.findOneAndUpdate({ _id: artworkId }, { tokenId }, { new: true }).lean();
};

const updateArtworkcollectionId = async (collectionId, tokenId) => {
  return await Artwork.findOneAndUpdate({ collectionId: collectionId }, { tokenId: tokenId }, { new: true }).lean();
};

const getArtworksByCollection = async (collectionId) => {
  const result = await Artwork.find({ collectionId: collectionId }).lean();
  return result;
};

const changeArtworkAuctionStatus = async (artworkId, status) => {
  return await Artwork.findOneAndUpdate(
    { _id: artworkId },
    {
      auctionMintStatus: status,
      isAuctionOpen: status == MINT_STATUS.PENDING && true,
    },
    { new: true }
  ).lean();
};

const deleteArtworkById = async (artworkId) => {
  await Artwork.findOneAndDelete({ _id: artworkId });
};

const searchArtworkByName = async (keyword, page, perPage, artist, min, max) => {
  let query = {};
  if (keyword) {
    query['name'] = { $regex: keyword, $options: 'i' };
  }
  if (artist) {
    query['owner'] = artist;
  }
  if (min && max) {
    query['$and'] = [
      {
        price: { $gte: parseInt(min) }
      },
      {
        price: { $lte: parseInt(max) }
      }
    ]
  }

  return await Artwork.find(query)
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

const getAllArtworks = async (page, perPage, artwork_type = undefined) => {
  if (artwork_type != undefined) {
    return await Artwork.find({ artwork_type })
      .limit(parseInt(perPage))
      .skip(page * perPage);
  }
  return await Artwork.find()
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

module.exports = {
  saveArtwork,
  getUserArtworks,
  getArtworkType,
  increaseArtworkViews,
  updateArtwork,
  updateArtworkMetaUrl,
  getPopulatedArtwork,
  getArtworkById,
  closeArtworkAuction,
  deleteArtworksByCollection,
  updateArtworkTokenId,
  getArtworksByCollection,
  changeArtworkAuctionStatus,
  deleteArtworkById,
  searchArtworkByName,
  getAllArtworks,
};
