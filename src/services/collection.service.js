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

const getCollectionsById = async (userId) => {
  return await Collection.find({ owner: userId });
};

module.exports = {
  saveCollection,
  getCollectionsById,
};
