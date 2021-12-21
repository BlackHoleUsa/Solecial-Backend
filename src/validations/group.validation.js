const Joi = require('joi');

const creategroup = {
  body: Joi.object().keys({
    groupName: Joi.string().required(),
    totalCount: Joi.number().required(),
  }),
};

module.exports = {
  creategroup,
};
