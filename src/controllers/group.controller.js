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
  const userGroups = await groupService.getUserGroups(user._id);
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
module.exports = {
  creategroup,
  getUserGroups,
  CheckGroupArtWork,
};
