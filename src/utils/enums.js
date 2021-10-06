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
  CLAIM_SALE: 'collectAuctionAmount',
  NFT_CLAIM: 'NFTclaim',
  CLAIM_BACK: 'auctionCancelled',
  NEW_SALE: 'newSale',
  SALE_CANCELLED: "saleCancelled"
};

const AUCTION_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  TIMEOUT: 'timeout',
};

const SALE_STATUS = {
  OPEN: 'open',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const MINT_STATUS = {
  PENDING: 'pending',
  COMPLETE: 'complete',
};

const SEARCH_FILTERS = {
  USERS: 'users',
  ARTWORKS: 'artworks',
  COLLECTIONS: 'collections',
};

const AUCTION_FILTERS = {
  NEW: 'new',
  HAS_OFFER: 'hasOffer',
  ON_AUCTION: 'onAuction',
};

const HISTORY_TYPE = {
  ARTWORK_CREATED: 'artworkCreated',
  ARTWORK_DELETED: 'artworkDeleted',
  AUCTION_STARTED: 'auctionStarted',
  AUCTION_END: 'auctionEnd',
  BID_PLACED: 'bidPlaced',
};

const TRANSACTION_TYPE = {
  DEBIT: 'debit',
  CREDIT: 'credit',
};

const NOTIFICATION_TYPE = {
  NEW_FOLLOWER: 'newFollower',
  NEW_BID: 'newBid',
  AUCTION_TIMEOUT: 'auctionTimeout',
  AUCTION_END: 'auctionEnd',
  AUCTION_WIN: 'auctionWin',
};

TRANSACTION_ACTIVITY_TYPE = {
  NFT_CLAIM: 'nftClaim',
  NFT_SALE: 'nftSale',
};

module.exports = {
  ARTWORK_TYPE,
  MINT_CONTRACT_EVENTS,
  AUCTION_STATUS,
  AUC_CONTRACT_EVENTS,
  MINT_STATUS,
  SEARCH_FILTERS,
  AUCTION_FILTERS,
  HISTORY_TYPE,
  TRANSACTION_TYPE,
  NOTIFICATION_TYPE,
  TRANSACTION_ACTIVITY_TYPE,
  SALE_STATUS
};
