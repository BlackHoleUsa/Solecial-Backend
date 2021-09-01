const express = require('express');
const validate = require('../../middlewares/validate');
const collectionController = require('../../controllers/collection.controller');
const { createCollectionVS, getCollectionVS, singleCollectionVS } = require('../../validations/collection.validation');

const router = express.Router();

router.post('/createCollection', validate(createCollectionVS), collectionController.createCollection);
router.get('/getUserCollections', validate(getCollectionVS), collectionController.getUserCollections);

router.get('/getCollectionDetails', validate(singleCollectionVS), collectionController.getCollectionDetails);

module.exports = router;
