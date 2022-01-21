const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const EVENT = require('../triggers/custom-events').customEvent;

const { groupService, artworkService } = require('../services');

const creategroup = catchAsync(async (req, res) => {
  const { user } = req;
  const createdGroup = await groupService.creategroup(req.body);
  EVENT.emit('add-group-in-user', {
    groupId: createdGroup.id,
    userId: user._id,
  });
  res.status(httpStatus.OK).send({ status: true, message: 'group created successfully', createdGroup });
});

const getUserGroups = catchAsync(async (req, res) => {
  const { user } = req;
  let userGroups = await groupService.getUserGroups(user._id);
  // const newArr = userGroups.map((item) => {
  //   return {
  //     ...item,
  //     newField: '12',
  //   };
  // });
  // console.log(newArr);
  for (let i = 0; i < userGroups.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    let groupArtWorks = await artworkService.getArtworksBygroupId(userGroups[i].id);
    for (let j = 0; j < groupArtWorks.length; j++) {
      if (groupArtWorks[j].tokenId) {
        userGroups[i].mint = true;
      }
    }
  }
  res.status(httpStatus.OK).send({ status: true, userGroups });
});

const CheckGroupArtWork = catchAsync(async (req, res) => {
  const groupId = req.query.groupId;
  const result = await groupService.CheckGroupArtWork(groupId);
  if (result >= 1) {
    const artwork = await artworkService.getArtworkBygroupId(groupId);
    return res.status(httpStatus.OK).send({ status: true, artwork });
  }
  return res.status(httpStatus.OK).send({ status: false });
});

const editGroupArtWork = catchAsync(async (req, res) => {
  const groupId = req.query.groupId;
  const { groupName, totalCount } = req.body;
  const result = await groupService.editGroupArtWork(groupId, groupName, totalCount);
  return res.status(httpStatus.OK).send({ data: result });
});
const deleteGroupArtWork = catchAsync(async (req, res) => {
  const groupId = req.query.groupId;
  const result = await groupService.deleteGroupArtWork(groupId);
  return res.status(httpStatus.CREATED).send({ data: result });
});
const getGroupLatestArtwork = catchAsync(async (req, res) => {
  const groupId = req.query.groupId;
  const result = await groupService.getGroupLatestArtwork(groupId);
  return res.status(httpStatus.OK).send({ data: result });
});
module.exports = {
  creategroup,
  getUserGroups,
  CheckGroupArtWork,
  editGroupArtWork,
  deleteGroupArtWork,
  getGroupLatestArtwork,
};
