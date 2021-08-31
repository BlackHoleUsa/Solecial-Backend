const Joi = require('joi');

const createArtworkVS = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    creater: Joi.string().required(),
    price: Joi.string().required(),
    image: Joi.string().optional(),
    collectionId: Joi.string().required(),
  }),
};

module.exports = {
  createArtworkVS,
};
