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
  historyService,
} = require('../services');
const EVENT = require('../triggers/custom-events').customEvent;
const { addFilesToIPFS, pinMetaDataToIPFS } = require('../utils/helpers');
const { HISTORY_TYPE, NOTIFICATION_TYPE } = require('../utils/enums');

const saveArtwork = catchAsync(async (req, res) => {
  const body = req.body;
  const files = req.files;
  const { name, description, creater,artist_name,artist_description } = body;
  let imgData;
  if (files.length > 0) {
    imgData = await addFilesToIPFS(files[0].buffer, 'image');
    artistimgData = await addFilesToIPFS(files[1].buffer, 'artist_image');
    body.artwork_url = imgData;
    body.artist_url = artistimgData;
  }
  body.owner = body.creater;
  const artwork = await artworkService.saveArtwork(body);
  const user = await userService.getUserById(creater);
  const metaUrl = await pinMetaDataToIPFS({
    name,
    description,
    artist_name,
    artist_description,
    artist_url: artistimgData,
    artwork_url: imgData,
  });
  const updatedArtwork = await artworkService.updateArtworkMetaUrl(artwork._id, metaUrl);
  EVENT.emit('add-artwork-in-user', {
     artworkId: artwork._id,
     userId: body.creater,
  });
  // EVENT.emit('add-artwork-in-collection', {
  //   artworkId: artwork._id,
  //   collectionId: body.collectionId,
  // });

  EVENT.emit('update-artwork-history', {
    artwork: artwork._id,
    owner: body.creater,
    message: `${user.userName} created the artwork`,
    type: HISTORY_TYPE.ARTWORK_CREATED,
  });

  res.status(httpStatus.OK).send({ status: true, message: 'artwork saved successfully', updatedArtwork });
});

const getUserArtworks = catchAsync(async (req, res) => {
  const { page, perPage, userId } = req.query;

  const artworks = await artworkService.getUserArtworks(userId, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', data: artworks });
});
const getArtworkType = catchAsync(async (req, res) => {
  const { page, perPage, artwork_type} = req.query;

  const artworks = await artworkService.getArtworkType(artwork_type, page, perPage);
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
  EVENT.emit('update-artwork-history', {
    artwork: artwork._id,
    message: `artwork placed on auction`,
    auction: auction._id,
    type: HISTORY_TYPE.AUCTION_STARTED,
  });

  res.status(httpStatus.OK).send({ status: true, message: 'Artwork placed on auction successfully', data: auction });
});

const placeBid = catchAsync(async (req, res) => {
  const body = req.body;
  const user = req.user;

  const { artwork, auctionId } = body;
  const bid = await bidService.saveBid(body);

  EVENT.emit('save-bid-in-artwork', {
    artworkId: artwork,
    bidId: bid._id,
    auctionId,
  });

  EVENT.emit('update-artwork-history', {
    artwork: artwork,
    message: `Bid placed on artwork`,
    auction: auctionId,
    bid: bid._id,
    type: HISTORY_TYPE.BID_PLACED,
  });

  EVENT.emit('send-and-save-notification', {
    receiver: user._id,
    type: NOTIFICATION_TYPE.NEW_BID,
    extraData: {
      bid: bid._id,
    },
  });

  res.status(httpStatus.OK).send({ status: true, message: 'Your bid has been placed successfully', data: bid });
});

const getSingleArtwork = catchAsync(async (req, res) => {
  const { artworkId } = req.query;
  const artwork = await artworkService.getPopulatedArtwork(artworkId, 'auction creater owner collectionId bids');
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

const getArtworksByCollection = catchAsync(async (req, res) => {
  const { collectionId } = req.query;
  const artworks = await artworkService.getArtworksByCollection(collectionId);

  res.status(httpStatus.OK).send({ status: true, message: 'successfull', data: artworks });
});

const changeAuctionStatus = catchAsync(async (req, res) => {
  const { artworkId, status } = req.body;
  const artwork = await artworkService.changeArtworkAuctionStatus(artworkId, status);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', data: artwork });
});

const deleteArtwork = catchAsync(async (req, res) => {
  const { artworkId } = req.body;
  const artwork = await artworkService.getArtworkById(artworkId);
  if (!artwork) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Artwork does not exist');
  }

  EVENT.emit('update-artwork-history', {
    artwork: artworkId,
    message: `Artwork deleted`,
    type: HISTORY_TYPE.ARTWORK_DELETED,
  });

  // await collectionService.removeArtwork(artworkId, artwork.collectionId);
  await userService.removeArtwork(artwork.creater, artworkId);
  await artworkService.deleteArtworkById(artworkId);

  res.status(httpStatus.OK).send({ status: true, message: 'artwork deleted successfully', data: artworkId });
});

const getArtworkHistory = catchAsync(async (req, res) => {
  const { artworkId, page, perPage } = req.query;
  const history = await historyService.getArtworkHistory(artworkId, page, perPage, 'artwork owner');
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: history });
});

const getWinnedAuctions = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;

  let winnedAuctions = await auctionService.getClosedAuctions(req.user._id, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: winnedAuctions });
});

const getSoldItems = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;

  let winnedAuctions = await auctionService.getSoldAuctions(req.user._id, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: winnedAuctions });
});

const getTimeoutItems = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;
  let winnedAuctions = await auctionService.getTimeoutAuctions(req.user._id, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: winnedAuctions });
});

module.exports = {
  saveArtwork,
  getUserArtworks,
  getArtworkType,
  addToFavourite,
  removeFromFavourites,
  getFavouriteArtworks,
  increaseArtworkViews,
  placeBid,
  createAuction,
  getSingleArtwork,
  getAuctionBids,
  updateTokenId,
  getArtworksByCollection,
  changeAuctionStatus,
  deleteArtwork,
  getWinnedAuctions,
  getSoldItems,
  getArtworkHistory,
  getTimeoutItems,
};
