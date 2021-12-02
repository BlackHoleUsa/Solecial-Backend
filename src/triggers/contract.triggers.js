const {
  AUCTION_CONTRACT_INSTANCE,
  MINT_SINGLE_CONTRACT_INSTANCE,
  MINT_MULTIPLE_CONTRACT_INSTANCE,
} = require('../config/contract.config');
const { contractController } = require('../controllers');
const { MINT_CONTRACT_EVENTS, AUC_CONTRACT_EVENTS } = require('../utils/enums');
// var contractInfo = require('./contractInfo');
// const Web3 = require('web3')

// const infura = "wss://rinkeby.infura.io/ws/v3/c944b72ce9b74c77aac906c6a59f4e99"
// const web3 = new Web3(new Web3.providers.WebsocketProvider(infura));

// const contract = new web3.eth.Contract(contractInfo.marketMinterabi, contractInfo.marketMinterAddress);

MINT_SINGLE_CONTRACT_INSTANCE.events.allEvents(async (err, ev) => {
  if (err) {
    console.error('Error', err);
    return;
  }

  console.log('Event', ev);

  switch (ev.event) {
    case MINT_CONTRACT_EVENTS.NEW_COLLECTION:
      console.log('ev.returnValues', ev.returnValues);
      const { CollectionAddress, owner, colName } = ev.returnValues;
      contractController.updateCollectionAddress(CollectionAddress, owner, colName);
      break;
    default:
      console.log('happy');
  }
});

MINT_MULTIPLE_CONTRACT_INSTANCE.events.allEvents(async (err, ev) => {
  if (err) {
    console.error('Error', err);
    return;
  }

  console.log('Event', ev);

  switch (ev.event) {
    case MINT_CONTRACT_EVENTS.NEW_COLLECTION:
      console.log('ev.returnValues', ev.returnValues);
      const { CollectionAddress, owner, colName } = ev.returnValues;
      contractController.updateCollectionAddress(CollectionAddress, owner, colName);
      break;
    default:
      console.log('happy');
  }
});

AUCTION_CONTRACT_INSTANCE.events.allEvents(async (err, ev) => {
  if (err) {
    console.error('Error', err);
    return;
  }

  console.log('Event', ev.event);

  switch (ev.event) {
    case AUC_CONTRACT_EVENTS.NEW_AUCTION:
      console.log('Auction Event', ev.event);
      const { colAddress, tokenId, aucId, amount } = ev.returnValues;
      console.log('colAddress, tokenId, aucId', colAddress, tokenId, aucId, amount);
      contractController.handleNewAuction(colAddress, tokenId, aucId, amount);
      break;
    case AUC_CONTRACT_EVENTS.NEW_BID:
      console.log('New Bid', ev.returnValues);
      contractController.handleNewBid(ev.returnValues);
      break;
    case AUC_CONTRACT_EVENTS.CLAIM_SALE:
      console.log('Sale Claim', ev.returnValues);
      contractController.handleNFTSale(ev.returnValues);
      break;
    case AUC_CONTRACT_EVENTS.NFT_CLAIM:
      console.log('NFT Claim', ev.returnValues);
      contractController.handleNFTClaim(ev.returnValues);
      break;
    case AUC_CONTRACT_EVENTS.CLAIM_BACK:
      console.log('NFT Claim Back', ev.returnValues);
      contractController.handleClaimBack(ev.returnValues);
      break;
    case AUC_CONTRACT_EVENTS.NEW_SALE:
      console.log('NFT New Sale', ev.returnValues);
      contractController.handleNewSale(ev.returnValues);
      break;
    case AUC_CONTRACT_EVENTS.SALE_CANCELLED:
      console.log('NFT Sale cancelled', ev.returnValues);
      contractController.handleCancelSale(ev.returnValues);
      break;
    case AUC_CONTRACT_EVENTS.SALE_COMPLETED:
      console.log('NFT Sale Completed', ev.returnValues);
      contractController.handleSaleComplete(ev.returnValues);
      break;
    case AUCTION_CONTRACT_INSTANCE.NEW_SALE_1155:
      console.log('NFT New Sale 1155', ev.returnValues);
      contractController.handleNewSale(ev.returnValues);
      break;
    case AUCTION_CONTRACT_INSTANCE.NEW_AUCTION_1155:
      console.log('Auction Event 1155', ev.event);
      contractController.handleNewAuction(ev.returnValues);
      break;
    default:
      console.log('done');
  }
});

// const transferEvent = async () => {

//   console.log("Listening for transfer on eth")

//   await contract.events.newCollection()
//     .on('data', (event) => {
//       console.log("Got Event on eth")
//       // if (event.returnValues.to) {

//       to = event.returnValues.CollectionAddress
//       from = event.returnValues.owner
//       // amount = event.returnValues.value

//       // if (to == process.env.SYSTEM_ADDRESS) {
//       //   mintTrx.mint(from, amount);
//       // }
//       // else {
//       //   console.log("Ignore others")
//       // }
//       // }
//     })
//     .on('error', console.error);

// }
// transferEvent();
