const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { User } = require('../models');
const EVENT = require('../triggers/custom-events').customEvent;

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  EVENT.emit('create-stats', {
    userId: user._id
  });
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { address,email,password } = req.body;
  var user;

  if(address != undefined){
    user = await authService.loginUserWithAddress(address);
  }
   if(email != undefined && password != undefined){
    user = await authService.loginUserWithEmailAndPassword(email,password)
  }
  if (user) {
    await tokenService.removeToken(user);
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({
      status: true,
      user,
      tokens,
    });
  } else {
    res.send({
      status: false,
      user: null,
      tokens: null,
      message: 'No user found',
    });
  }
});
const logout = catchAsync(async (req, res) => {
  await tokenService.removeToken(req.user);
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
  const {password,newPassword} = req.body
  let dbUser;
  if(req.body.email !== undefined){
    dbUser = await userService.getUserByEmail(req.body.email);
  }else{
    const {headers:{authorization}}=req;
    const headersToken = authorization.split(' ')[1]
    dbUser = await userService.getUserByToken(headersToken)
  }
  if (!dbUser) {
    return res.status(404).send({
      status: 404,
      message: 'User not found',
    });
  }
  await authService.resetPassword(dbUser, password, newPassword );
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
