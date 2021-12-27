const Joi = require('joi');

const creategroup = {
  body: Joi.object().keys({
    groupName: Joi.string().required(),
    totalCount: Joi.number().required(),
  }),
};

const CheckGroupArtWork = {
  query: Joi.object().keys({
    groupId: Joi.string().required(),
  }),
};
module.exports = {
  creategroup,
  CheckGroupArtWork,
};
