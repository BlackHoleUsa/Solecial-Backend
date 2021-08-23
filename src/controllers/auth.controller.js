const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { User } = require('../models');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  await tokenService.removeToken(user);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await tokenService.removeToken(user);
  res.status(httpStatus.OK).send({
    status: true,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  let dbUser = await userService.getUserByEmail(req.body.email);

  if (!dbUser) {
    return res.status(404).send({
      status: 404,
      message: 'User not found',
    });
  }

  await emailService.sendResetPasswordEmail(req.body.email, req.body.code);
  res.status(200).send({
    code: 200,
    message: 'Password reset email has been successfully sent to your email',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  let dbUser = await userService.getUserByEmail(req.body.email);

  if (!dbUser) {
    return res.status(404).send({
      status: 404,
      message: 'User not found',
    });
  }

  await authService.resetPassword(req.body.email, req.body.password);
  res.status(httpStatus.OK).send({
    status: 200,
    message: 'Password changed successfully!',
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
