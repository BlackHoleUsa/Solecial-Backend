const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, collectionService, artworkService } = require('../services');
const { User } = require('../models');
const EVENT = require('../triggers/custom-events').customEvent;
const { addFilesToIPFS } = require('../utils/helpers');

const saveArtwork = catchAsync(async (req, res) => {
  const { body } = req;
  const files = req.files;

  let imgData;

  if (files.length > 0) {
    imgData = await addFilesToIPFS(files[0].buffer, 'image');
    body.image = imgData;
  }
  body.owner = body.creater;
  const artwork = await artworkService.saveArtwork(body);

  EVENT.emit('add-artwork-in-user', {
    artworkId: artwork._id,
    userId: body.creater,
  });
  EVENT.emit('add-artwork-in-collection', {
    artworkId: artwork._id,
    collectionId: body.collectionId,
  });

  res.status(httpStatus.OK).send({ status: true, message: 'artwork saved successfully', artwork });
});

module.exports = {
  saveArtwork,
};
