const { userService, artworkService, collectionService } = require('../services');

const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { SEARCH_FILTERS } = require('../utils/enums');

const handleSearch = catchAsync(async (req, res) => {
  const { keyword, filter, page, perPage } = req.query;

  if (keyword) {
    const users = await userService.searchUsersByName(keyword, page, perPage);
    const artworks = await artworkService.searchArtworkByName(keyword, page, perPage);
    const collections = await collectionService.searchCollectionByName(keyword, page, perPage);

    let data = {};

    switch (filter) {
      case SEARCH_FILTERS.USERS:
        data.users = users;
        break;
      case SEARCH_FILTERS.ARTWORKS:
        data.artworks = artworks;
        break;
      case SEARCH_FILTERS.COLLECTIONS:
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
      page,
      data,
    });
  } else {
    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      data: [],
    });
  }
});

module.exports = {
  handleSearch,
};
