const { Notification } = require('../models');

const saveNotification = async (params) => {
  return await Notification.create(params);
};

module.exports = {
  saveNotification,
};
