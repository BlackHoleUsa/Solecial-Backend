const { Artwork, Group } = require('../models');
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
    .populate('owner')
    .populate('creater')
    .populate('group')
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

const increaseArtworkLikes = async (artworkId) => {
  return await Artwork.findOneAndUpdate({ _id: artworkId }, { $inc: { numberOfLikes: 1 } }, { new: true }).lean();
};

const decreaseArtworkLikes = async (artworkId) => {
  return await Artwork.findOneAndUpdate({ _id: artworkId }, { $inc: { numberOfLikes: -1 } }, { new: true }).lean();
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
  return await Artwork.findOneAndUpdate({ collectionId }, { tokenId }, { new: true }).lean();
};

const getArtworksByCollection = async (collectionId) => {
  const result = await Artwork.find({ collectionId }).lean();
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
  const query = {};
  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }
  if (artist) {
    query.owner = artist;
  }
  if (min && max) {
    query.$and = [
      {
        price: { $gte: parseInt(min) },
      },
      {
        price: { $lte: parseInt(max) },
      },
    ];
  }

  return await Artwork.find(query)
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

const getAllArtworks = async (
  page,
  perPage,
  _id,
  isAuctionOpen = undefined,
  openForSale = undefined,
  artwork_type = undefined
) => {
  if (artwork_type != undefined) {
    return await Artwork.find({ artwork_type, owner: _id })
      .populate('owner')
      .populate('group')
      .limit(parseInt(perPage))
      .skip(page * perPage);
  }
  if (isAuctionOpen != undefined) {
    return await Artwork.find({ isAuctionOpen: true, owner: _id })
      .populate('owner')
      .populate('group')
      .limit(parseInt(perPage))
      .skip(page * perPage);
  }
  if (openForSale != undefined) {
    return await Artwork.find({ openForSale: true, owner: _id })
      .populate('owner')
      .populate('group')
      .limit(parseInt(perPage))
      .skip(page * perPage);
  }
  return await Artwork.find({ owner: _id })
    .populate('owner')
    .populate('group')
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

const getAllArtworksCount = async (_id, isAuctionOpen = undefined, openForSale = undefined, artwork_type = undefined) => {
  if (artwork_type != undefined) {
    return await Artwork.find({ artwork_type, owner: _id }).populate('owner').countDocuments();
  }
  if (isAuctionOpen != undefined) {
    return await Artwork.find({ isAuctionOpen: true, owner: _id }).populate('owner').countDocuments();
  }
  if (openForSale != undefined) {
    return await Artwork.find({ openForSale: true, owner: _id }).populate('owner').countDocuments();
  }
  return await Artwork.find({ owner: _id }).populate('owner').countDocuments();
};

const getOpenArtWorks = async (
  page,
  perPage,
  isAuctionOpen = undefined,
  openForSale = undefined,
  artwork_type = undefined
) => {
  if (artwork_type != undefined) {
    return await Artwork.find({ artwork_type })
      .populate('owner')
      .populate('group')
      .limit(parseInt(perPage))
      .skip(page * perPage);
  }
  if (isAuctionOpen != undefined) {
    return await Artwork.find({ isAuctionOpen: true })
      .populate('owner')
      .populate('group')
      .limit(parseInt(perPage))
      .skip(page * perPage);
  }
  if (openForSale != undefined) {
    return await Artwork.find({ openForSale: true })
      .populate('owner')
      .populate('group')
      .limit(parseInt(perPage))
      .skip(page * perPage);
  }
  return await Artwork.find()
    .populate('owner')
    .populate('group')
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

const getOpenArtWorksCount = async (isAuctionOpen = undefined, openForSale = undefined, artwork_type = undefined) => {
  if (artwork_type != undefined) {
    return await Artwork.find({ artwork_type }).populate('owner').countDocuments();
  }
  if (isAuctionOpen != undefined) {
    return await Artwork.find({ isAuctionOpen: true }).populate('owner').countDocuments();
  }
  if (openForSale != undefined) {
    return await Artwork.find({ openForSale: true }).populate('owner').countDocuments();
  }
  return await Artwork.find().populate('owner').countDocuments();
};

const getAllArtworksPaginated = async (page, perPage) => {
  const artworks = await Artwork.find()
    .populate('creater')
    .populate('owner')
    .populate('group')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();

  return artworks;
};

const getArtWorksCount = async () => {
  const count = await Artwork.find().countDocuments();
  return count;
};

const getUserArtworksCount = async (userId) => {
  const count = await Artwork.find({ owner: userId }).countDocuments();
  return count;
};

const updateArtworkGroup = async (id, groupId) => {
  await Artwork.findOneAndUpdate({ _id: id }, { group: groupId });
};

const addEditionNumber = async (id, edition) => {
  await Artwork.findOneAndUpdate({ _id: id }, { edition });
};

const getGroupArtworks = async (groupId, page, perPage) => {
  const result = await Artwork.find({ group: groupId })
    .populate('group')
    .limit(parseInt(perPage))
    .skip(page * perPage);
  return result;
};

const getGroupArtworksCount = async (groupId) => {
  const result = await Artwork.find({ group: groupId });
  console.log(result.length);
  return result.length;
};
const getGroupArtworksWithEditionNumber = async (userId, groupId, editionNumber) => {
  const result = await Artwork.find({ creater: userId, group: groupId, edition: editionNumber }).populate('group');
  return result;
};

module.exports = {
  saveArtwork,
  getUserArtworks,
  getUserArtworksCount,
  getArtworkType,
  increaseArtworkViews,
  increaseArtworkLikes,
  decreaseArtworkLikes,
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
  getAllArtworksCount,
  getOpenArtWorksCount,
  getOpenArtWorks,
  getAllArtworksPaginated,
  getArtWorksCount,
  updateArtworkGroup,
  addEditionNumber,
  getGroupArtworks,
  getGroupArtworksWithEditionNumber,
  getGroupArtworksCount,
};
