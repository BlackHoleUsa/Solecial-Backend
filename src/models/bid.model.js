const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const bidSchema = mongoose.Schema(
  {
    bidder: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    artwork: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Artwork',
      required: true,
    },

    bid_amount: {
      type: Number,
      required: true,
    },

    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    auction: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Auction',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bidSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
