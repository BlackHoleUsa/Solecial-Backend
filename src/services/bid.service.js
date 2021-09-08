const { Bid } = require('../models');

const saveBid = async (params) => {
  return await Bid.create(params);
};

module.exports = {
  saveBid,
};
