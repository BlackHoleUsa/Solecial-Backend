const { artworkService } = require('.');
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
const CheckGroupArtWork = async (groupId) => {
  const result = await artworkService.getGroupArtworksCount(groupId);
  return result;
};
const editGroupArtWork = async (groupId, groupName = undefined, totalCount = undefined) => {
  let result;
  if (groupName !== undefined) {
    result = await Group.findOneAndUpdate({ _id: groupId }, { groupName: groupName }, { new: true });
  }
  if (totalCount !== undefined) {
    result = await Group.findOneAndUpdate({ _id: groupId }, { totalCount: totalCount }, { new: true });
  }
  return result;
};
const deleteGroupArtWork = async (groupId) => {
  const result = await Group.findOneAndDelete({ _id: groupId });
  return result;
};
const updateGroupMintStatus = async (groupId, mintStatus) => {
  const result = await Group.findOneAndUpdate({ _id: groupId }, { mint: mintStatus }, { new: true });
  return result;
};
module.exports = {
  creategroup,
  getUserGroups,
  getUserGroup,
  CheckGroupArtWork,
  editGroupArtWork,
  deleteGroupArtWork,
  updateGroupMintStatus,
};
