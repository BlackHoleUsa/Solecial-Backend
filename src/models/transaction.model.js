const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
    },
    extraData: {
      activityType: String,
      auction: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Auction',
      },
    },
  },

  {
    timestamps: true,
  }
);

transactionSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
