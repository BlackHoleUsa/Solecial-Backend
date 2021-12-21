const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const EVENT = require('../triggers/custom-events').customEvent;

const { groupService } = require('../services');

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
module.exports = {
  creategroup,
  getUserGroups,
};
