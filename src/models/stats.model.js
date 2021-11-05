const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const statsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    ownedArts: {
      type: Number,
      default: 0
    },
    purchasedArts: {
      type: Number,
      default: 0
    },
    soldArts: {
      type: Number,
      default: 0
    },
    totalPurchasesAmount: {
      type: Number,
      default: 0
    },
    totalSoldAmount: {
      type: Number,
      default: 0
    },
    biggestPurchase: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

statsSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;
