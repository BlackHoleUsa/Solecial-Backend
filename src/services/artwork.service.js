const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const { Collection, Artwork } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

const getPopulatedArtwork = async (artworkId, fieldsToPopulate) => {
  return await Artwork.findOne({ _id: artworkId }).populate(fieldsToPopulate);
};

const saveArtwork = async (params) => {
  return await Artwork.create(params);
};

const getUserArtworks = async (userId, page, perPage) => {
  return await Artwork.find({ owner: userId })
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();
};

const increaseArtworkViews = async (artworkId) => {
  return await Artwork.findOneAndUpdate({ _id: artworkId }, { $inc: { views: 1 } }, { new: true });
};

const updateArtwork = async (id, fieldToUpdate, value) => {
  return await Artwork.findOneAndUpdate({ _id: id }, { fieldToUpdate: value }, { new: true });
};

const updateArtworkMetaUrl = async (id, value) => {
  return await Artwork.findOneAndUpdate({ _id: id }, { meta_url: value }, { new: true });
};

const getArtworkById = async (id) => {
  return await Artwork.findOne({ _id: id });
};

module.exports = {
  saveArtwork,
  getUserArtworks,
  increaseArtworkViews,
  updateArtwork,
  updateArtworkMetaUrl,
  getPopulatedArtwork,
  getArtworkById,
};
