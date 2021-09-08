const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, collectionService, artworkService } = require('../services');
const { User } = require('../models');
const EVENT = require('../triggers/custom-events').customEvent;
const { addFilesToIPFS, pinMetaDataToIPFS } = require('../utils/helpers');

const saveArtwork = catchAsync(async (req, res) => {
  const body = req.body;
  const files = req.files;
  const { name, description, creater, collectionId } = body;

  let imgData;

  if (files.length > 0) {
    imgData = await addFilesToIPFS(files[0].buffer, 'image');
    body.artwork_url = imgData;
  }
  body.owner = body.creater;
  const artwork = await artworkService.saveArtwork(body);
  const user = await userService.getUserById(creater);

  const metaUrl = await pinMetaDataToIPFS({
    name,
    description,
    creater: {
      name: user.userName,
      id: user._id,
    },
    collectionId,
    artwork_url: imgData,
  });

  const updatedArtwork = await artworkService.updateArtworkMetaUrl(artwork._id, metaUrl);

  EVENT.emit('add-artwork-in-user', {
    artworkId: artwork._id,
    userId: body.creater,
  });
  EVENT.emit('add-artwork-in-collection', {
    artworkId: artwork._id,
    collectionId: body.collectionId,
  });

  res.status(httpStatus.OK).send({ status: true, message: 'artwork saved successfully', updatedArtwork });
});

const getUserArtworks = catchAsync(async (req, res) => {
  const { page, perPage, userId } = req.query;

  const artworks = await artworkService.getUserArtworks(userId, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', data: artworks });
});

const addToFavourite = catchAsync(async (req, res) => {
  const { artworkId } = req.body;
  const user = req.user;
  const updatedUser = await userService.addArtworkToFavourites(user._id, artworkId);
  res.status(httpStatus.OK).send({ status: true, message: 'artwork added in favourites successfully' });
});

const removeFromFavourites = catchAsync(async (req, res) => {
  const { artworkId } = req.body;
  const user = req.user;

  const updatedUser = await userService.removeArtworkFromFavourite(user._id, artworkId);
  res.status(httpStatus.OK).send({ status: true, message: 'artwork removed from favourites successfully' });
});

const getFavouriteArtworks = catchAsync(async (req, res) => {
  const { userId, page, perPage } = req.query;

  const artworks = await userService.getFavouriteArtworks(userId, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', data: artworks });
});

const increaseArtworkViews = catchAsync(async (req, res) => {
  const { artworkId } = req.body;

  const artwork = await artworkService.increaseArtworkViews(artworkId);
  res.status(httpStatus.OK).send({ status: true, message: 'Artwork view increased successfully', data: artwork });
});

module.exports = {
  saveArtwork,
  getUserArtworks,
  addToFavourite,
  removeFromFavourites,
  getFavouriteArtworks,
  increaseArtworkViews,
};
