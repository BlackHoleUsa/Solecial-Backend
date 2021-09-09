var cron = require('node-cron');
const { auctionService } = require('../services');

cron.schedule('* * * * *', async () => {
  await auctionService.checkAndCompleteAuctionStatus();
});
