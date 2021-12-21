const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const groupSchema = mongoose.Schema({
  groupName: {
    type: String,
    require: true,
  },
  currentCount: {
    type: Number,
    required: false,
    default: 0,
  },
  totalCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

groupSchema.plugin(toJSON);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
