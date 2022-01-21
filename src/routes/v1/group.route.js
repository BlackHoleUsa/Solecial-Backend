const express = require('express');
const validate = require('../../middlewares/validate');
const groupController = require('../../controllers/group.controller');

const groupValidation = require('../../validations/group.validation');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.post('/createGroup', [auth('manageUsers'), validate(groupValidation.creategroup)], groupController.creategroup);

router.get('/getUserGroup', [auth('manageUsers')], groupController.getUserGroups);

router.get('/CheckGroupArtWork', validate(groupValidation.CheckGroupArtWork), groupController.CheckGroupArtWork);

router.post('/editGroup', [auth('manageUsers'), validate(groupValidation.editgroup)], groupController.editGroupArtWork);

router.get('/getGroupLatestArtWork', validate(groupValidation.getGroupLatestArtwork), groupController.getGroupLatestArtwork);

router.post(
  '/deleteGroup',
  [auth('manageUsers'), validate(groupValidation.deleteGroup)],
  groupController.deleteGroupArtWork
);

module.exports = router;
