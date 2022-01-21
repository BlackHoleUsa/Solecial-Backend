const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const groupSchema = mongoose.Schema({
  groupName: {
    type: String,
    require: false,
  },
  currentCount: {
    type: Number,
    required: false,
    default: 0,
  },
  totalCount: {
    type: Number,
    required: false,
    default: 0,
  },
  mint: {
    type: Boolean,
    required: false,
    default: false,
  },
});

groupSchema.plugin(toJSON);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
