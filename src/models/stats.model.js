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
    },
    purchasedArts: {
      type: Number,
    },
    soldArts: {
      type: Number,
    },
    totalPurchasesAmount: {
      type: Number,
    },
    totalSoldAmount: {
      type: Number
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
