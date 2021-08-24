const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { User } = require('../models');

const test = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ status: true, message: 'successfull' });
});

module.exports = {
  test,
};
