const { Notification } = require('../models');

const saveNotification = async (params) => {
  return await Notification.create(params);
};

const getUserNotifications = async (userId, page, perPage) => {
  return await Notification.find({ receiver: userId })
    .populate('extraData.follower')
    .populate('extraData.Auction')
    .populate('extraData.Bid')
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();
};

module.exports = {
  saveNotification,
  getUserNotifications,
};
