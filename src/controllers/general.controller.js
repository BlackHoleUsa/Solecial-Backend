const httpStatus = require('http-status');
const { userService, artworkService, collectionService, historyService, notificationService } = require('../services');
const EVENT = require('../triggers/custom-events').customEvent;
const catchAsync = require('../utils/catchAsync');
const { SEARCH_FILTERS } = require('../utils/enums');
const settings = require('../models/setting.model');

const handleSearch = catchAsync(async (req, res) => {
  const { keyword, filter, page, perPage } = req.query;

  if (keyword) {
    const users = await userService.searchUsersByName(keyword, page, perPage);
    const artworks = await artworkService.searchArtworkByName(keyword, page, perPage);


    let data = {};

    switch (filter) {
      case SEARCH_FILTERS.USERS:
        data.users = users;
        break;

      case SEARCH_FILTERS.ARTWORKS:
        data.artworks = artworks;
        break;

      default:
        data = {
          users,
          artworks,
        };
    }

    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      page,
      data,
    });
  } else {
    let users;
    let data = {};
    let artworks;
    let collections;
    switch (filter) {
      case SEARCH_FILTERS.USERS:
        users = await userService.getAllUsers();
        data.users = users;
        break;

      case SEARCH_FILTERS.ARTWORKS:
        artworks = await artworkService.getAllArtWork();
        data.artworks = artworks;
        break;

      case SEARCH_FILTERS.COLLECTIONS:
        collections = await collectionService.getAllCollections();
        data.collections = collections;
        break;

      default:
        data = {
          users,
          artworks,
          collections,
        };
    }
    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      data,
    });
  }
});

const getAppActivity = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;

  const histories = await historyService.getAllHistoriesPaginated(page, perPage);

  const count = await historyService.getHistoryCount();

  res.status(httpStatus.OK).send({
    status: true,
    message: 'Successfull',
    data: histories,
    count,
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
  const user = req.user;
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
  const user = req.user;
  const { page, perPage } = req.query;

  const artists = await userService.getUsersByMostArtworks();
  res.status(httpStatus.OK).send({
    status: true,
    data: artists,
  });
});

const getLeadingCollectors = catchAsync(async (req, res) => {
  const user = req.user;
  const { page, perPage } = req.query;

  const artists = await userService.fetchLeadingCollectors();
  res.status(httpStatus.OK).send({
    status: true,
    data: artists,
  });
});

const tempUdateUser = catchAsync(async (req, res) => {
  EVENT.emit('create-stats', {
    userId: req.query.userId
  });
  res.status(httpStatus.CREATED).send({
    status: true
  });
});
const getSettings = catchAsync(async (req, res) =>{
    const foundSetting =await settingService.getSettings()
    res.status(200).json({
      message:'Successful!',
      foundSetting
    })
})

const updateSettings = catchAsync(async (req,res) => {
  const existSetting = await settingService.getSettings()
  console.log(existSetting)
  if( existSetting.length == 0){
    await settingService.createSettings(req.body)
    res.status(200).send('Setting created')
  }else if(existSetting[0]){
    const id=existSetting[0]._id
    const updatedSetting = await settingService.updateSettings(id,req.body)
    res.status(200).json({
      message:'settings_updated',
      updatedSetting
    })
  }
})

module.exports = {
  handleSearch,
  getAppActivity,
  getTranscendingArtists,
  getNotifications,
  tempUdateUser,
  getLeadingCollectors
};
