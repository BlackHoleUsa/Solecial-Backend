const Joi = require('joi');

const createArtworkVS = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    creater: Joi.string().required(),
    price: Joi.string().required(),
    image: Joi.string().optional(),
    collectionId: Joi.string().required(),
    artwork_type: Joi.string().required(),
  }),
};

const getArtworksVS = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
    userId: Joi.string().required(),
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
    auctionId: Joi.string().required(),
  }),
};

const openAuctionVS = {
  body: Joi.object().keys({
    initialPrice: Joi.number().required(),
    artwork: Joi.string().required(),
    owner: Joi.string().required(),
    creater: Joi.string().required(),
    endTime: Joi.date().required(),
  }),
};
const getSingleArtVS = {
  query: Joi.object().keys({
    artworkId: Joi.string().required(),
  }),
};

module.exports = {
  createArtworkVS,
  getArtworksVS,
  addFavouriteVS,
  removeFavouriteVS,
  getFavouriteVS,
  increaseViewVS,
  placeBidVS,
  openAuctionVS,
  getSingleArtVS,
};