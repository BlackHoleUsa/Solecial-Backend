const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    userName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().optional(),
    password: Joi.string().optional(),
    role: Joi.string().optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    address: Joi.string().optional(),
    password: Joi.string().optional(),
    email: Joi.string().email().optional(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const blockUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().length(4).required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    // email: Joi.string().required().email(),
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

const verifyCode = {
  body: Joi.object().keys({
    code: Joi.string().length(4).required(),
    email: Joi.string().email().required(),
    newPassword: Joi.string(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  blockUser,
  refreshTokens,
  forgotPassword,
  verifyCode,
  resetPassword,
  verifyEmail,
};
