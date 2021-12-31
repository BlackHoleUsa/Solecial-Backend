const Joi = require('joi');
const { password } = require('./custom.validation');

const getActivityVS = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};
const getSettingsVS = {
  body: Joi.object().keys({
    notifications: Joi.boolean().optional(),
    bid_notifications: Joi.boolean().optional(),
    royalty: Joi.number().optional(),
    minimum_bid: Joi.number().optional(),
  }),
};

module.exports = {
  getActivityVS,
  getSettingsVS
};
