const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { AUCTION_STATUS } = require('../utils/enums');

const buySellSchema = mongoose.Schema(
  {
    artwork: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Artwork',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    contractSaleId: {
      type: String,
      required: false,
    },
    buyer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: false,
    },
    status: {
      type: String,
      default: AUCTION_STATUS.OPEN,
    },
  },
  {
    timestamps: true,
  }
);

buySellSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const BuySell = mongoose.model('BuySell', buySellSchema);

module.exports = BuySell;
