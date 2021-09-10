const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { ARTWORK_TYPE } = require('../utils/enums');

const artworkSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    artwork_url: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tokenId: {
      type: Number,
      required: false,
    },
    collectionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Collection',
    },
    views: {
      type: Number,
      required: false,
      default: 0,
    },
    artwork_type: {
      type: String,
      required: false,
      default: ARTWORK_TYPE.IMAGE,
    },
    meta_url: {
      type: String,
      required: false,
      trim: true,
    },
    bids: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Bid',
      },
    ],
    isAuctionOpen: {
      type: Boolean,
      default: false,
    },
    auction: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Auction',
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
