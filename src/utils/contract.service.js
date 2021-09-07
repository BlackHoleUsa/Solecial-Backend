const Web3 = require('web3');
const CONSTANTS = require('../config/config');
const mintABI = require('../config/abi.json');

const WEB3 = new Web3('https://rinkeby.infura.io/v3/c944b72ce9b74c77aac906c6a59f4e99');
const MINT_CONTRACT = new WEB3.eth.Contract(mintABI, CONSTANTS.ETH_CONTRACTS.MINT_NFT_CONTRACT_ADDRESS)

module.exports = {
  WEB3,
  MINT_CONTRACT
}
