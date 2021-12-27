const express = require('express');
const validate = require('../../middlewares/validate');
const groupController = require('../../controllers/group.controller');

const groupValidation = require('../../validations/group.validation');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.post('/createGroup', [auth('manageUsers'), validate(groupValidation.creategroup)], groupController.creategroup);

router.get('/getUserGroup', [auth('manageUsers')], groupController.getUserGroups);

router.get('/CheckGroupArtWork', validate(groupValidation.CheckGroupArtWork), groupController.CheckGroupArtWork);

module.exports = router;
