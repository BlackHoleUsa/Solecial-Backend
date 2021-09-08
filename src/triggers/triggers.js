const CONFIG = require('../config/config');
const EVENT = require('./custom-events').customEvent;
const LISTENERS = require('../controllers/listeners.controller');

EVENT.addListener('add-collection-in-user', LISTENERS.addCollectionInUser);
EVENT.addListener('add-artwork-in-user', LISTENERS.addArtworkInUser);
EVENT.addListener('add-artwork-in-collection', LISTENERS.addArtworkInCollection);

EVENT.addListener('save-bid-in-artwork', LISTENERS.saveBidInArtwork);
