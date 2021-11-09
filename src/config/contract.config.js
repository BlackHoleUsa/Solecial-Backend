const Web3 = require('web3');
const { ETH_CONTRACTS } = require('./config');

const options = {
  timeout: 30000, // ms

  clientConfig: {
    // Useful to keep a connection alive
    keepalive: true,
    keepaliveInterval: -1, // ms
  },

  // Enable auto reconnection
  reconnect: {
    auto: true,
    delay: 1000, // ms
    maxAttempts: 10,
    onTimeout: false,
  },
};

const web3_Instance = new Web3(new Web3.providers.WebsocketProvider(ETH_CONTRACTS.WEB_SOCKET_INFURA_URL, options));

const MINT_CONTRACT_INSTANCE = new web3_Instance.eth.Contract(
  ETH_CONTRACTS.MINT_NFT_ABI,
  ETH_CONTRACTS.MINT_NFT_CONTRACT_ADDRESS
);

const AUCTION_CONTRACT_INSTANCE = new web3_Instance.eth.Contract(
  ETH_CONTRACTS.AUC_ABI,
  ETH_CONTRACTS.AUCTION_CONTRACT_ADDRESS
);

module.exports = {
  MINT_CONTRACT_INSTANCE,
  AUCTION_CONTRACT_INSTANCE,
};
