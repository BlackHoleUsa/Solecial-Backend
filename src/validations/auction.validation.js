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

const getOpenSalesVS = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
    min: Joi.string().optional(),
    max: Joi.string().optional(),
  }),
};

const getSaleDetailsVs = {
  query: Joi.object().keys({
    saleId: Joi.string().required()
  }),
};
const getAuctionDetailsVs = {
  query: Joi.object().keys({
    aucId: Joi.string().required()
  }),
};

module.exports = {
  getOpenAuctionVS,
  getOpenSalesVS,
  getSaleDetailsVs,
  getAuctionDetailsVs
};
