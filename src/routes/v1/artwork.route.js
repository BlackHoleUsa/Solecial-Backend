const express = require('express');
const validate = require('../../middlewares/validate');
const collectionController = require('../../controllers/collection.controller');
const artworkController = require('../../controllers/artwork.controller');

const artworkValidation = require('../../validations/artwork.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/saveArtwork', validate(artworkValidation.createArtworkVS), artworkController.saveArtwork);

router.get(
  '/getUserArtworks',
  [auth('manageUsers'), validate(artworkValidation.getArtworksVS)],
  artworkController.getUserArtworks
);

router.post(
  '/addToFavourite',
  [auth('manageUsers'), validate(artworkValidation.addFavouriteVS)],
  artworkController.addToFavourite
);

router.post(
  '/removeFromFavourite',
  [auth('manageUsers'), validate(artworkValidation.removeFavouriteVS)],
  artworkController.removeFromFavourites
);

router.get(
  '/getFavouriteArtworks',
  [auth('manageUsers'), validate(artworkValidation.getFavouriteVS)],
  artworkController.getFavouriteArtworks
);

router.post(
  '/increaseViewCount',
  [auth('manageUsers'), validate(artworkValidation.increaseViewVS)],
  artworkController.increaseArtworkViews
);

router.post('/placeBid', [auth('manageUsers'), validate(artworkValidation.placeBidVS)], artworkController.placeBid);

module.exports = router;
