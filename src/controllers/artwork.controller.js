const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const {
  authService,
  userService,
  tokenService,
  emailService,
  collectionService,
  artworkService,
  bidService,
  auctionService,
} = require('../services');
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
      name: user?.userName,
      id: user?._id,
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

const createAuction = catchAsync(async (req, res) => {
  const { artwork } = req.body;
  if (await auctionService.artworkExistsInAuction(artwork)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Artwork is already on auction');
  }
  const body = req.body;
  const { owner, creater } = await artworkService.getArtworkById(artwork);
  body.owner = owner;
  body.creater = creater;

  const auction = await auctionService.saveAuction(body);

  EVENT.emit('open-artwork-auction', {
    artworkId: artwork,
    auction: auction._id,
  });

  res.status(httpStatus.OK).send({ status: true, message: 'Artwork placed on auction successfully', data: auction });
});

const placeBid = catchAsync(async (req, res) => {
  const body = req.body;
  const { artwork, auctionId } = body;
  const bid = await bidService.saveBid(body);

  EVENT.emit('save-bid-in-artwork', {
    artworkId: artwork,
    bidId: bid._id,
    auctionId,
  });

  res.status(httpStatus.OK).send({ status: true, message: 'Your bid has been placed successfully', data: bid });
});

const getSingleArtwork = catchAsync(async (req, res) => {
  const { artworkId } = req.query;

  const artwork = await artworkService.getPopulatedArtwork(artworkId, 'auction creater owner');
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: artwork });
});

const getAuctionBids = catchAsync(async (req, res) => {
  const { auctionId } = req.query;

  const bids = await bidService.getAuctionBidsPopulated(auctionId, 'bidder owner auction');
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: bids });
});

const updateTokenId = catchAsync(async (req, res) => {
  const { artworkId, tokenId } = req.body;
  const artwork = await artworkService.updateArtworkTokenId(artworkId, tokenId);

  res.status(httpStatus.OK).send({ status: true, message: 'token id updated successfully', data: artwork });
});

module.exports = {
  saveArtwork,
  getUserArtworks,
  addToFavourite,
  removeFromFavourites,
  getFavouriteArtworks,
  increaseArtworkViews,
  placeBid,
  createAuction,
  getSingleArtwork,
  getAuctionBids,
  updateTokenId,
};
