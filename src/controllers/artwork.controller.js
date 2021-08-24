const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, collectionService } = require('../services');
const { User } = require('../models');
const EVENT = require('../triggers/custom-events').customEvent;

const saveArtwork = catchAsync(async (req, res) => {
  // const { owner } = req.body;
  // const col = await collectionService.saveCollection(req.body);
  // const data = await collectionService.getCollectionsById(owner);

  //   EVENT.emit('add-collection-in-user', {
  //     collectionId: col._id,
  //     userId: owner,
  //   });

  res.status(httpStatus.OK).send({ status: true, message: 'collection created successfully' });
});

module.exports = {
  saveArtwork,
};
