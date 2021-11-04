const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { User } = require('../models');
const EVENT = require('../triggers/custom-events').customEvent;
const {adminAuthforBlock} = require('../middlewares/auth')

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

const blockUser = catchAsync(async (req,res,next)=>{
  const isAdmin = await adminAuthforBlock(req);
  if(isAdmin){
    const user = await userService.updateUserById(req.params.userId, req.body);
    res.send(`user blocked Status: ${user.isblock}`); 
  }else{
    res.status(httpStatus.UNAUTHORIZED).send('Role is not superAdmin of requested User!');
  }
}) 

const forgotPassword = catchAsync(async (req, res) => {
  const dbUser = await userService.getUserByEmail(req.body.email);

  if (!dbUser) {
    return res.status(404).send({
      status: 404,
      message: 'User not found',
    });
  }

  await emailService.sendResetPasswordEmail(req.body.email, req.body.code);
  await userService.saveForgotPasswordCode(req.body.email, req.body.code);
  res.status(200).send({
    code: 200,
    message: 'Password reset email has been successfully sent to your email',
  });
});

const verifyCode = catchAsync(async (req, res) => {
  const flag = await authService.verifyCode(req.body.code, req.body.email);
  if (flag) {
    if (req.body.newPassword) {
      await userService.updateUserByEmail(req.body.email, req.body.newPassword);
      res.status(httpStatus.OK).send({
        status: 200,
        message: 'Password updated Successfully',
      });
    } else {
      res.status(httpStatus.OK).send({
        status: 200,
        message: 'Code verified',
      });
    }
  } else {
    res.status(httpStatus.EXPECTATION_FAILED).send({
      status: 400,
      message: 'code didnt verified',
    });
  }
});

const resetPassword = catchAsync(async (req, res) => {
  const {password,newPassword} = req.body
  let dbUser;
    const authorization=req.headers.authorization;
    const headersToken = authorization.split(' ')[1]
    dbUser = await userService.getUserByToken(headersToken,res)
    console.log(dbUser)
  if (!dbUser) {
    return res.status(404).send({
      status: 404,
      message: 'User not found',
    });
  }
  const passwordUpdatedUser = await authService.resetPassword(dbUser, password, newPassword );
  res.status(httpStatus.OK).json({
    status: 200,
    message: 'Password changed successfully!',
    "userUpdated":passwordUpdatedUser
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
  blockUser,
  forgotPassword,
  verifyCode,
  resetPassword,
  verifyEmail,
};
