const { BuySell } = require('../models');

const getBuySellSaleId = async (artworkId) => {
  return await BuySell.findOne({ artwork: artworkId });
};

module.exports = {
  getBuySellSaleId,
};
