const express = require('express');
const validate = require('../../middlewares/validate');
const collectionController = require('../../controllers/collection.controller');
const artworkController = require('../../controllers/artwork.controller');

const artworkValidation = require('../../validations/artwork.validation');

const router = express.Router();

router.post('/saveArtwork', validate(artworkValidation.createArtworkVS), artworkController.saveArtwork);

module.exports = router;
