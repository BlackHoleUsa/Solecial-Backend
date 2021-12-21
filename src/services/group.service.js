const { Group } = require('../models');
const userService = require('./user.service');

const creategroup = async (params) => {
  const result = await Group.create(params);
  return result;
};

const getUserGroups = async (id) => {
  const result = await userService.getUserGroups(id);
  return result.groups;
};
const getUserGroup = async (userId, groupId) => {
  const result = await userService.getUserGroup(userId, groupId);
  return result;
};
module.exports = {
  creategroup,
  getUserGroups,
  getUserGroup,
};
