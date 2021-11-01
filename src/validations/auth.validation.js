const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    userName: Joi.string(),
    email: Joi.string().required().email(),
    address: Joi.string(),
    password: Joi.string(),
    role: Joi.string(),
  }),
};

const login = {
  body: Joi.object().keys({
    address: Joi.string(),
    password:Joi.string(),
    email:Joi.string().email()
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
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
    password: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
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
  refreshTokens,
  forgotPassword,
  verifyCode,
  resetPassword,
  verifyEmail,
};
