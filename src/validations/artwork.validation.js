const Joi = require('joi');

const createArtworkVS = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().optional(),
    artist_name: Joi.string().required(),
    artist_description: Joi.string().required(),
    price: Joi.string().required(),
    artist_image: Joi.string().optional(),
    artwork_type: Joi.string().valid('GIF', 'VIDEO', 'IMAGE', 'AUDIO').required(),
    tokenId: Joi.string().optional(),
    creater: Joi.string().required(),
    multipleNFT: Joi.boolean().required(),
    amount: Joi.string().optional(),
  }),
};

const getArtworksVS = {
  query: Joi.object().keys({
    page: Joi.string(),
    perPage: Joi.string(),
    userId: Joi.string().required(),
    artwork_type: Joi.string().valid('GIF', 'VIDEO', 'IMAGE', 'AUDIO').optional(),
  }),
};
const getArtworkType = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string(),
    artwork_type: Joi.string().valid('GIF', 'VIDEO', 'IMAGE', 'AUDIO').required(),
  }),
};

const addFavouriteVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const removeFavouriteVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const getFavouriteVS = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};

const increaseViewVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const placeBidVS = {
  body: Joi.object().keys({
    bidder: Joi.string().required(),
    artwork: Joi.string().required(),
    bid_amount: Joi.number().required(),
    owner: Joi.string().required(),
    auction: Joi.string().required(),
  }),
};

const openAuctionVS = {
  body: Joi.object().keys({
    initialPrice: Joi.number().required(),
    artwork: Joi.string().required(),
    endTime: Joi.date().required(),
  }),
};
const getSingleArtVS = {
  query: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const getAuctionBidsVS = {
  query: Joi.object().keys({
    auctionId: Joi.string().required(),
  }),
};

const updateTokenVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
    tokenId: Joi.string().required(),
  }),
};

const getCollectionArtworksVS = {
  query: Joi.object().keys({
    collectionId: Joi.string().required(),
  }),
};

const changeAuctionStatusVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
    status: Joi.string().required(),
  }),
};
const deleteArtworkVS = {
  body: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

const getHistoryVS = {
  query: Joi.object().keys({
    artworkId: Joi.string().required(),
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};

const nftClaimListVS = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};
const getAllArtworks = {
  query: Joi.object().keys({
    artwork_type: Joi.string().valid('GIF', 'VIDEO', 'IMAGE', 'AUDIO').optional(),
    isAuctionOpen: Joi.string().valid('True', 'TRUE').optional(),
    openForSale: Joi.string().valid('True', 'TRUE').optional(),
    page: Joi.string().optional(),
    perPage: Joi.string().optional(),
  }),
};
const getOpenArtWorks = {
  query: Joi.object().keys({
    artwork_type: Joi.string().valid('GIF', 'VIDEO', 'IMAGE', 'AUDIO').optional(),
    isAuctionOpen: Joi.string().valid('True', 'TRUE').optional(),
    openForSale: Joi.string().valid('True', 'TRUE').optional(),
    page: Joi.string().optional(),
    perPage: Joi.string().optional(),
  }),
}
module.exports = {
  createArtworkVS,
  getArtworksVS,
  getArtworkType,
  addFavouriteVS,
  removeFavouriteVS,
  getFavouriteVS,
  increaseViewVS,
  placeBidVS,
  openAuctionVS,
  getSingleArtVS,
  getAuctionBidsVS,
  updateTokenVS,
  getCollectionArtworksVS,
  changeAuctionStatusVS,
  deleteArtworkVS,
  getHistoryVS,
  nftClaimListVS,
  getAllArtworks,
  getOpenArtWorks,
};
