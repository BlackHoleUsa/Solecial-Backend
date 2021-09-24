const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const transactionSchema = mongoose.Schema(
  {
    bidder: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
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
