const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const { Collection } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

const saveCollection = async (params) => {
  return await Collection.create(params);
};

const getCollectionById = async (id) => {
  return await Collection.findOne({ _id: id });
};

const getCollectionsByUserId = async (userId) => {
  return await Collection.find({ owner: userId });
};

const getPaginatedCollections = async (page, perPage, userId) => {
  return await Collection.find({ owner: userId })
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();
};

const getPopulatedCollection = async (collectionId, fieldToPopulate) => {
  return await Collection.findOne({ _id: collectionId }).populate(fieldToPopulate).lean();
};

const updateCollectionImages = async (collectionId, profileImage, coverImage) => {
  return await Collection.findOneAndUpdate({ _id: collectionId }, { profileImage, coverImage }, { new: true });
};

const updateCollectioById = async (collectionId, updateBody) => {
  const collection = await Collection.findByIdAndUpdate(collectionId, updateBody, {
    new: true,
  });
  return collection;
};

const collectionExists = async (userId, colName) => {
  const collection = await Collection.find({ owner: userId, name: colName });
  return collection.length > 0;
};

module.exports = {
  saveCollection,
  getCollectionById,
  getPaginatedCollections,
  getPopulatedCollection,
  updateCollectionImages,
  updateCollectioById,
  getCollectionsByUserId,
  collectionExists,
};
