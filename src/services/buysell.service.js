const { BuySell } = require('../models');

const getBuySellSaleId = async (artworkId) => {
  return await BuySell.findOne({ artwork: artworkId });
};

const deleteArtworkById = async (artworkId) => {
  return await BuySell.findOneAndDelete({ artwork: artworkId });
};
module.exports = {
  getBuySellSaleId,
  deleteArtworkById,
};
