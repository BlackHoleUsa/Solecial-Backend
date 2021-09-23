const { Bid, History } = require('../models');

const getArtworkHistory = async (artworkId, page, perPage, fieldsToPopulate) => {
  return await History.find({ artwork: artworkId })
    .populate(fieldsToPopulate)
    .sort({ createdAt: -1 })
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

const getAllHistoriesPaginated = async (page, perPage) => {
  return await History.find({})
    .populate('artwork owner auction bid')
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

module.exports = {
  getArtworkHistory,
  getAllHistoriesPaginated,
};
