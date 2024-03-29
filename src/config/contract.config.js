const { ETH_CONTRACTS } = require('./config');
const Web3 = require('web3');

const web3_Instance = new Web3(new Web3.providers.WebsocketProvider(ETH_CONTRACTS.WEB_SOCKET_INFURA_URL));

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
  AUCTION_CONTRACT_INSTANCE
};
