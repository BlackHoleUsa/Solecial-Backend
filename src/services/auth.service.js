const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const web3 = require('web3');
const bcrypt = require('bcryptjs')


// /**
//  * Login with username and password
//  * @param {string} email
//  * @param {string} password
//  * @returns {Promise<User>}
//  */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if(user.isblock === true){
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Account is Blocked!') 
  }
  console.log(user);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 *
 * @param {string} address
 * @returns  {Promise<User>}
 */
const loginUserWithAddress = async (address) => {
  if (!(await web3.utils.isAddress(address))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'address is not valid');
  }

  const user = await userService.getUserByAddress(address);
  return user;
};

 /**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @headers {string} resetPasswordToken
 * @param {string} password
 * @param {string} newPassword
 * @returns {Promise}
 */

const resetPassword = async ( dbUser , password , newPassword ) => {
  try {
    // const user = await userService.getUserByEmail(email);
    if (!dbUser) {
      throw new Error('Wrong User');
    }
    const passwordConfirmed= await dbUser.isPasswordMatch(password)
    if(passwordConfirmed === true){ 
      const hashPassword = await bcrypt.hash(newPassword,8)
      await userService.updateUserById(dbUser._id, { password: hashPassword});
    }else if(passwordConfirmed === false){
      throw new ApiError(httpStatus.UNAUTHORIZED, 'current password not verified');
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  refreshAuth,
  resetPassword,
  verifyEmail,
  loginUserWithAddress,
  loginUserWithEmailAndPassword
};
