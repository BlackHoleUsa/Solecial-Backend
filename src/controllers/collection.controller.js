const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, collectionService } = require('../services');
const { User } = require('../models');
const helpers = require('../utils/helpers');
const EVENT = require('../triggers/custom-events').customEvent;

const test = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ status: true, message: 'successfull' });
});

const createCollection = catchAsync(async (req, res) => {
  const { owner } = req.body;
  const files = req.files;
  let col = await collectionService.saveCollection(req.body);

  let cover, profile;
  if (files.length > 0) {
    for (let file of files) {
      if (file.fieldname == 'profileImage') {
        profile = await helpers.uploadToAws(files[0].buffer, `/collections/${col._id}/profile`);
      } else if (file.fieldname == 'coverImage') {
        cover = await helpers.uploadToAws(files[0].buffer, `/collections/${col._id}/cover`);
      }
    }

    col = await collectionService.updateCollectionImages(col._id, profile.Location, cover.Location);
  }

  // const data = await collectionService.getCollectionById(owner);
  EVENT.emit('add-collection-in-user', {
    collectionId: col._id,
    userId: owner,
  });
  res.status(httpStatus.OK).send({ status: true, message: 'collection created successfully', data: col });
});

const getUserCollections = catchAsync(async (req, res) => {
  const { userId, page, perPage } = req.query;
  const data = await collectionService.getPaginatedCollections(page, perPage, userId);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', page, data });
});

const getCollectionDetails = catchAsync(async (req, res) => {
  const { collectionId } = req.query;
  const data = await collectionService.getPopulatedCollection(collectionId, 'artworks');
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', data });
});

module.exports = {
  createCollection,
  getUserCollections,
  getCollectionDetails,
};
