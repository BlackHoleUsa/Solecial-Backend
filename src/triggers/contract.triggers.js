const { ETH_CONTRACTS } = require('../config/config');
const { WEB3 } = require('../utils/contract.service');

WEB3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ", result);
});

let subscription = WEB3.eth.subscribe('newCollection', function (response) {
  console.log(response);
});