const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const artworkSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      typetype: String,
      required: false,
    },
    creater: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: false,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    collectionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Collection',
    },
  },
  {
    timestamps: true,
  }
);

artworkSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;
