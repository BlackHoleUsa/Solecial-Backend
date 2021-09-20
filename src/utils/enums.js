const ARTWORK_TYPE = {
  IMAGE: 'image',
  MUSIC: 'music',
  VIDEO: 'video',
};

const MINT_CONTRACT_EVENTS = {
  NEW_COLLECTION: 'newCollection',
};

const AUC_CONTRACT_EVENTS = {
  NEW_AUCTION: 'newAuction',
  NEW_BID: 'newBid',
};

const AUCTION_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
};

const MINT_STATUS = {
  PENDING: 'pending',
  COMPLETE: 'complete',
};

module.exports = {
  ARTWORK_TYPE,
  MINT_CONTRACT_EVENTS,
  AUCTION_STATUS,
  AUC_CONTRACT_EVENTS,
  MINT_STATUS,
};
