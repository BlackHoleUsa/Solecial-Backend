const express = require('express');
const validate = require('../../middlewares/validate');
const collectionController = require('../../controllers/collection.controller');
const { createCollectionVS } = require('../../validations/collection.validation');

const router = express.Router();

router.post('/createCollection', validate(createCollectionVS), collectionController.test);

module.exports = router;
