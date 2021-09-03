const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('manageUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .put([auth('manageUsers'), validate(userValidation.updateUser)], userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);
// .get(auth('manageUsers'), validate(userValidation.getUser), userController.getUser)
router.post('/followUser', [auth('manageUsers'), validate(userValidation.followUser)], userController.followUser);
router.post('/unfollowUser', [auth('manageUsers'), validate(userValidation.unfollowUser)], userController.unfollowUser);

router.get(
  '/getUserFollowers',
  [auth('manageUsers'), validate(userValidation.getUserFollowers)],
  userController.getUserFollowers
);

router.get(
  '/getUserFollowing',
  [auth('manageUsers'), validate(userValidation.getUserFollowing)],
  userController.getUserFollowing
);

module.exports = router;
