const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const User = require('../models/user.model');
const Token = require('../models/token.model');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};


const adminAuthforBlock=async (req)=>{
  let FLAG;
    const reqToken=req.headers.authorization.split(' ')[1]
    const tokenfound=await Token.findOne({token: reqToken},(err,result)=>{
      if(err){
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized due to not found user\'s Token'))  
      }
      return result
    })
     await User.findOne(tokenfound.user).then((result)=>{
      if(result.role == 'admin'){
        FLAG = true;
      }
    })
    .catch((err)=>{  
      return reject(new ApiError(httpStatus.UNAUTHORIZED,err))
    })
    return FLAG;
}

module.exports = {
  auth,
  adminAuthforBlock
}
