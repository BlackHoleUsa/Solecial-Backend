const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const {
  authService,
  userService,
  tokenService,
  emailService,
  artworkService,
  bidService,
  auctionService,
  historyService,
  buysellService,
  settingService,
  groupService,
} = require('../services');
const EVENT = require('../triggers/custom-events').customEvent;
const { addFilesToIPFS, pinMetaDataToIPFS } = require('../utils/helpers');
const { HISTORY_TYPE, NOTIFICATION_TYPE, STATS_UPDATE_TYPE } = require('../utils/enums');
const { set } = require('../app');

const saveArtwork = catchAsync(async (req, res) => {
  // mutipleNFT, //amount
  const { body } = req;
  const { files } = req;
  const { name, description, creater, artist_name, artist_description, multipleNFT, groupId } = body;
  let imgData;
  let artistimgData;
  if (files.length > 0) {
    imgData = await addFilesToIPFS(files[0].buffer, 'image');
    artistimgData = await addFilesToIPFS(files[1].buffer, 'artist_image');
    body.artwork_url = imgData;
    body.artist_url = artistimgData;
  }
  body.owner = body.creater;
  body.basePrice = body.price;
  const artwork = await artworkService.saveArtwork(body);
  const user = await userService.getUserById(creater);
  let metaUrl;
  if (multipleNFT) {
    EVENT.emit('increase-group-count', {
      groupId,
    });
    await artworkService.updateArtworkGroup(artwork._id, groupId);
    const currentCount = await groupService.getUserGroup(user._id, groupId);
    metaUrl = await pinMetaDataToIPFS({
      name,
      description,
      artist_name,
      artist_description,
      artist_url: artistimgData,
      artwork_url: imgData,
      edition: `${currentCount[0].currentCount} of ${currentCount[0].totalCount}`,
    });
    await artworkService.addEditionNumber(artwork._id, currentCount[0].currentCount);
  } else {
    metaUrl = await pinMetaDataToIPFS({
      name,
      description,
      artist_name,
      artist_description,
      artist_url: artistimgData,
      artwork_url: imgData,
    });
  }

  const updatedArtwork = await artworkService.updateArtworkMetaUrl(artwork._id, metaUrl);
  EVENT.emit('add-artwork-in-user', {
    artworkId: artwork._id,
    userId: body.creater,
  });

  EVENT.emit('update-artwork-history', {
    artwork: artwork._id,
    owner: body.creater,
    message: `${user.userName} created the artwork`,
    type: HISTORY_TYPE.ARTWORK_CREATED,
  });

  res.status(httpStatus.OK).send({ status: true, message: 'artwork saved successfully', updatedArtwork });
});

const getUserArtworks = catchAsync(async (req, res) => {
  const { page, perPage, userId, artwork_type } = req.query;

  const artworks = await artworkService.getUserArtworks(userId, page, perPage);
  if (artwork_type !== undefined) {
    const filteredarr = artworks.filter((result) => result.artwork_type == artwork_type);
    const count = filteredarr.length;
    res.status(httpStatus.OK).send({ status: true, message: 'successfull', data: filteredarr, count });
  } else {
    const count = await artworkService.getUserArtworksCount(userId);
    res.status(httpStatus.OK).send({ status: true, message: 'successfull', data: artworks, count });
  }
});
const getArtworkType = catchAsync(async (req, res) => {
  const { page, perPage, artwork_type } = req.query;

  const artworks = await artworkService.getArtworkType(artwork_type, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'successfull', data: artworks });
});

const addToFavourite = catchAsync(async (req, res) => {
  const { artworkId } = req.body;
  const { user } = req;
  const userObject = await userService.getSingleFavouriteArtWork(user._id);
  const { favouriteArtworks } = userObject;
  if (!favouriteArtworks.includes(artworkId)) {
    await userService.addArtworkToFavourites(user._id, artworkId);
    await artworkService.increaseArtworkLikes(artworkId);
  }
  res.status(httpStatus.OK).send({ status: true, message: 'artwork added in favourites successfully' });
});

const removeFromFavourites = catchAsync(async (req, res) => {
  const { artworkId } = req.body;
  const { user } = req;

  const updatedUser = await userService.removeArtworkFromFavourite(user._id, artworkId);
  await artworkService.decreaseArtworkLikes(artworkId);
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
  const { body } = req;
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
  const { body } = req;
  const { user } = req;
  const setting = await settingService.getSettings();
  const minBid = setting[0].minimum_bid;
  const bidNotification = setting[0].bid_notifications;

  const { artwork, auctionId, bid_amount } = body;
  if (minBid <= bid_amount) {
    const bid = await bidService.saveBid(body);
    EVENT.emit('save-bid-in-artwork', {
      artworkId: artwork,
      bidId: bid._id,
      auctionId,
    });

    EVENT.emit('update-artwork-history', {
      artwork,
      message: `Bid placed on artwork`,
      auction: auctionId,
      bid: bid._id,
      type: HISTORY_TYPE.BID_PLACED,
    });
    if (bidNotification === true) {
      EVENT.emit('send-and-save-notification', {
        receiver: user._id,
        type: NOTIFICATION_TYPE.NEW_BID,
        extraData: {
          bid: bid._id,
        },
      });
    }
    res.status(httpStatus.OK).send({ status: true, message: 'Your bid has been placed successfully', data: bid });
  } else {
    res
      .status(httpStatus.PRECONDITION_FAILED)
      .send(`Bid amount is less than the solecial required bid amount which is ${minBid}`);
  }
});

const getSingleArtwork = catchAsync(async (req, res) => {
  const { artworkId } = req.query;
  const artwork = await artworkService.getPopulatedArtwork(artworkId, 'auction creater owner collectionId bids sale group');
  const response = await buysellService.getBuySellSaleId(artworkId);
  if (response) {
    res
      .status(httpStatus.OK)
      .send({ status: true, message: 'Successfull', data: artwork, contractSaleId: response.contractSaleId });
  } else {
    res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: artwork });
  }
});

const getAuctionDetails = catchAsync(async (req, res) => {
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

  EVENT.emit('stats-artwork-mint', {
    userId: artwork.owner,
    type: STATS_UPDATE_TYPE.ownedArts,
  });

  res.status(httpStatus.OK).send({
    status: true,
    message: 'token id updated successfully',
    data: artwork,
  });
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

  const winnedAuctions = await auctionService.getClosedAuctions(req.user._id, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: winnedAuctions });
});

const getSoldItems = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;

  const winnedAuctions = await auctionService.getSoldAuctions(req.user._id, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: winnedAuctions });
});

const getTimeoutItems = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;
  const winnedAuctions = await auctionService.getTimeoutAuctions(req.user._id, page, perPage);
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: winnedAuctions });
});

const getAllArtworks = catchAsync(async (req, res) => {
  const { artwork_type, page, perPage, isAuctionOpen, openForSale } = req.query;
  const { user } = req;
  if (!artwork_type) {
    const artWorks = await artworkService.getAllArtworks(page, perPage, user._id, isAuctionOpen, openForSale);
    const count = await artworkService.getAllArtworksCount(user._id, isAuctionOpen, openForSale);
    res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: artWorks, count });
  } else {
    const artWorks = await artworkService.getAllArtworks(page, perPage, user._id, undefined, undefined, artwork_type);
    const count = await artworkService.getAllArtworksCount(user._id, undefined, undefined, artwork_type);
    res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: artWorks, count });
  }
});

const helper = (artWorks) => {
  const singleArtWorks = artWorks.filter((artwork) => artwork.multipleNFT === false);
  const multipleArtWorks = artWorks.filter((artwork) => artwork.multipleNFT === true);
  const multipleArtworkGroupId = multipleArtWorks.map((artwork) => artwork.group._id);
  const uniq = [...new Set(multipleArtworkGroupId)];
  const multipleStacks = [];
  for (let i = 0; i < multipleArtWorks.length; i++) {
    for (let k = 0; k < uniq.length; k++) {
      if (multipleArtWorks[i].group._id.toString() === uniq[k].toString() && multipleArtWorks[i].edition === 1) {
        multipleStacks.push(multipleArtWorks[i]);
      }
    }
  }
  console.log(singleArtWorks.length);
  console.log(multipleStacks.length);
  return [...singleArtWorks, ...multipleStacks];
};

const getOpenArtWorks = catchAsync(async (req, res) => {
  const { artwork_type, page, perPage, isAuctionOpen, openForSale } = req.query;
  if (!artwork_type) {
    const artWorks = await artworkService.getOpenArtWorks(page, perPage, isAuctionOpen, openForSale);
    const artWorksNew = await artworkService.getOpenArtWorksWithOutPages(isAuctionOpen, openForSale);
    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      data: helper(artWorks),
      count: helper(artWorksNew)?.length,
    });
  } else {
    const artWorks = await artworkService.getOpenArtWorks(page, perPage, undefined, undefined, artwork_type);
    const artWorksNew = await artworkService.getOpenArtWorksWithOutPages(isAuctionOpen, openForSale);
    res.status(httpStatus.OK).send({ status: true, message: 'Successfull', data: helper(artWorks), count: helper(artWorksNew)?.length, });
  }
});

const getGroupArtworks = catchAsync(async (req, res) => {
  const { groupId, page, perPage } = req.query;
  const result = await artworkService.getGroupArtworks(groupId, page, perPage);
  const count = await artworkService.getGroupArtworksCount(groupId);
  console.log("sdas");
  res.status(httpStatus.OK).send({ data: result, count });
});

const getGroupArtworksWithEdition = catchAsync(async (req, res) => {
  const { groupId, editionNumber } = req.query;
  const { user } = req;
  const result = await artworkService.getGroupArtworksWithEditionNumber(user._id, groupId, editionNumber);
  res.status(httpStatus.OK).send({ data: result });
});

const convertMultipleToSingleArtwork = catchAsync(async (req, res) => {
  const { artworkId } = req.query;
  const result = await artworkService.convertMultipleToSingleArtwork(artworkId);
  res.status(httpStatus.OK).send({ data: result });
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
  changeAuctionStatus,
  deleteArtwork,
  getWinnedAuctions,
  getSoldItems,
  getArtworkHistory,
  getTimeoutItems,
  getAllArtworks,
  getOpenArtWorks,
  getGroupArtworks,
  getGroupArtworksWithEdition,
  convertMultipleToSingleArtwork,
};
