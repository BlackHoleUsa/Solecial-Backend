const httpStatus = require('http-status');
const { userService, artworkService, collectionService, historyService, notificationService } = require('../services');
const EVENT = require('../triggers/custom-events').customEvent;
const catchAsync = require('../utils/catchAsync');
const { SEARCH_FILTERS } = require('../utils/enums');
const settingService = require('../services/setting.service');

const handleSearch = catchAsync(async (req, res) => {
  const { keyword, filter, page, perPage } = req.query;

  if (keyword) {
    const users = await userService.searchUsersByName(keyword, page, perPage);
    let usersCount = await userService.searchUsersByNameTotal(keyword);
    const artworks = await artworkService.searchArtworkByName(keyword, page, perPage);
    let artworksCount = await artworkService.searchArtworkByNameTotal(keyword);

    let count = 0;
    let data = {};

    switch (filter) {
      case SEARCH_FILTERS.USERS:
        data.users = users;
        count = usersCount;
        break;

      case SEARCH_FILTERS.ARTWORKS:
        data.artworks = artworks;
        count = artworksCount;
        break;

      default:
        data = {
          users,
          artworks : helper(artworks),
        };
    }

    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      page,
      data,
      count: count
    });
  } else {
    let users;
    let data = {};
    let artworks;
    let collections;
    let count;
    switch (filter) {
      case SEARCH_FILTERS.USERS:
        users = await userService.getAllUsers(page, perPage);
        data.users = users;
        count = await userService.getAllUsersCount();
        break;

      case SEARCH_FILTERS.ARTWORKS:
        artworks = await artworkService.getAllArtwork(page, perPage);
        data.artworks = artworks;
        count = await artworkService.getAllArtworksCount1();
        break;

      case SEARCH_FILTERS.COLLECTIONS:
        collections = await collectionService.getAllCollections();
        data.collections = collections;
        break;

      default:
        data = {
          users,
          artworks: helper(artworks),
          collections,
        };
    }
    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      data,
      count: count
    });
  }
});

const helper = (artWorks) => {
  const singleArtWorks = artWorks.filter((artwork) => artwork.multipleNFT === false);
  const multipleArtWorks = artWorks.filter((artwork) => artwork.multipleNFT === true);
  if (multipleArtWorks) {

    const multipleArtworkGroupId = multipleArtWorks.map((artwork) => artwork?.group?._id);
    const uniq = [...new Set(multipleArtworkGroupId)];
    const multipleStacks = [];
    for (let i = 0; i < uniq.length; i++) {
      for (let k = 0; k < multipleArtWorks.length; k++) {
        if (multipleArtWorks[k].group?._id?.toString() === uniq[i]?.toString()) {
          multipleStacks.push(multipleArtWorks[k]);
          k = multipleArtWorks.length + 1;
        }
      }
    }
    console.log(multipleStacks.length);
    return [...singleArtWorks, ...multipleStacks];
  }

};
const helper1 = (artWorks) => {
  const singleArtWorks = artWorks.filter((artwork) => artwork.multipleNFT === false);
  const multipleArtWorks = artWorks.filter((artwork) => artwork.multipleNFT === true);
  const multipleArtworkGroupId = multipleArtWorks.map((artwork) => artwork?.group?._id);
  const uniq = [...new Set(multipleArtworkGroupId)];
  let multipleStacks = [];
  for (let i = 0; i < uniq.length; i++) {
    for (let k = 0; k < multipleArtWorks.length; k++) {
      if (multipleArtWorks[k]?.group?._id?.toString() === uniq[i]?.toString()) {
        multipleStacks.push(multipleArtWorks[k]);
        k = multipleArtWorks.length + 1;
      }
    }
  }
  multipleStacks = [...new Set(multipleStacks)]
  console.log("singleArtWorks", singleArtWorks.length);
  console.log("multipleStacks", multipleStacks.length);
  return [...singleArtWorks, ...multipleStacks];
};

const getAppActivity = catchAsync(async (req, res) => {
  let { page, perPage } = req.query;
  page = parseInt(page);
  perPage = parseInt(perPage);
  const artWorks = await artworkService.getAllArtworksPaginated();
  const newArtWorks = await artworkService.getAllArtworksWithOutPaginated();
  const result = helper(artWorks);
  let result1 = [];
  if (page === 0 && perPage <= result.length) {
    for (let i = 0; i < perPage; i++) {
      result1.push(result[i]);
    }
  }
  else if (page === 0 && perPage >= result.length) {
    for (let i = 0; i < result.length; i++) {
      result1.push(result[i]);
    }
  }
  else if (page > 0 && perPage <= result.length) {
    for (let i = page * perPage; i < (page * perPage) + perPage; i++) {
      result1.push(result[i]);
    }
  }
  else if (page > 0 && perPage >= result.length) {
    for (let i = page * perPage; i < result.length; i++) {
      result1.push(result[i]);
    }
  }
  let newarray = result1.filter((el) => { return el != null });
  res.status(httpStatus.OK).send({
    status: true,
    message: 'Successfull',
    data: newarray,
    count: helper1(newArtWorks)?.length,
  });
});

const getNotifications = catchAsync(async (req, res) => {
  const { user } = req;
  const { page, perPage } = req.query;

  const notifications = await notificationService.getUserNotifications(user._id, page, perPage);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'Successfull',
    page,
    data: notifications,
  });
});

const getTransactions = catchAsync(async (req, res) => {
  const { user } = req;
  const { page, perPage } = req.query;

  const notifications = await notificationService.getUserNotifications(user._id, page, perPage);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'Successfull',
    page,
    data: notifications,
  });
});

const getTranscendingArtists = catchAsync(async (req, res) => {
  const { user } = req;
  const { page, perPage } = req.query;

  const artists = await userService.getUsersByMostArtworks();
  res.status(httpStatus.OK).send({
    status: true,
    data: artists,
  });
});

const getLeadingCollectors = catchAsync(async (req, res) => {
  const { user } = req;
  const { page, perPage } = req.query;

  const artists = await userService.fetchLeadingCollectors();
  res.status(httpStatus.OK).send({
    status: true,
    data: artists,
  });
});

const tempUdateUser = catchAsync(async (req, res) => {
  EVENT.emit('create-stats', {
    userId: req.query.userId,
  });
  res.status(httpStatus.CREATED).send({
    status: true,
  });
});
const getSettings = catchAsync(async (req, res) => {
  const foundSetting = await settingService.getSettings();
  res.status(200).json({
    message: 'Successful!',
    foundSetting,
  });
});

const updateSettings = catchAsync(async (req, res) => {
  const existSetting = await settingService.getSettings();
  if (existSetting.length == 0) {
    await settingService.createSettings(req.body);
    res.status(200).send('Setting created');
  } else if (existSetting[0]) {
    const id = existSetting[0]._id;
    const updatedSetting = await settingService.updateSettings(id, req.body);
    res.status(200).json({
      message: 'settings_updated',
      updatedSetting,
    });
  }
});

module.exports = {
  handleSearch,
  getAppActivity,
  getTranscendingArtists,
  getNotifications,
  getTransactions,
  tempUdateUser,
  getLeadingCollectors,
  getSettings,
  updateSettings,
};
