const express = require('express');
const validate = require('../../middlewares/validate');
const collectionController = require('../../controllers/collection.controller');
const {
  createCollectionVS,
  getCollectionVS,
  singleCollectionVS,
  updateCollectionVS,
} = require('../../validations/collection.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post(
  '/createCollection',
  [auth('consumedByArtistOnly'), validate(createCollectionVS)],
  collectionController.createCollection
);

router.get(
  '/getUserCollections',
  [auth('consumedByArtistOnly'), validate(getCollectionVS)],
  collectionController.getUserCollections
);

router.get(
  '/getCollectionDetails',
  [auth('consumedByArtistOnly'), validate(singleCollectionVS)],
  collectionController.getCollectionDetails
);

router.post(
  '/updateCollection',
  [auth('consumedByArtistOnly'), validate(updateCollectionVS)],
  collectionController.updateCollection
);

module.exports = router;
