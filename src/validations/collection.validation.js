const Joi = require('joi');
const { password } = require('./custom.validation');

const createCollectionVS = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    owner: Joi.string().required(),
  }),
};

module.exports = {
  createCollectionVS,
};
