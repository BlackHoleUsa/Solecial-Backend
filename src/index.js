const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const settings = require('./models/setting.model');
const settingsService = require('./services/setting.service');

let server;
mongoose.set('useFindAndModify', false);
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(process.env.PORT || config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

async function updateSettings() {
  const response = await settingsService.getSettings();
  if (response.length === 0) {
    await settingsService.createSettings({ minimum_bid: 0, notifications: true, bid_notifications: true, royalty: 0 });
  }
}
updateSettings();
