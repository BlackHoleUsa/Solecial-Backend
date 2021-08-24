const CONFIG = require('../config/config');
const EVENT = require('./custom-events').customEvent;
const LISTENERS = require('../controllers/listeners.controller');

EVENT.addListener('add-collection-in-user', LISTENERS.addCollectionInUser);
