const Joi = require('joi');

const getOpenAuctionVS = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
    filter: Joi.string().optional(),
    min: Joi.string().optional(),
    max: Joi.string().optional(),
  }),
};

module.exports = {
  getOpenAuctionVS,
};
