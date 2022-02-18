const Web3 = require('web3');
const { User, Collection, Artwork, Auction, BuySell } = require('../models');
const { getUserByAddress } = require('../services/user.service');
const artworkService = require('../services/artwork.service');
const groupService = require('../services/group.service');
const { AUCTION_CONTRACT_INSTANCE } = require('../config/contract.config');
const LISTENERS = require('./listeners.controller');
const { auctionService, bidService } = require('../services');
const EVENT = require('../triggers/custom-events').customEvent;
const {
  HISTORY_TYPE,
  TRANSACTION_TYPE,
  TRANSACTION_ACTIVITY_TYPE,
  AUCTION_STATUS,
  NOTIFICATION_TYPE,
  SALE_STATUS,
  STATS_UPDATE_TYPE,
} = require('../utils/enums');

const convertFromWei = (amount) => {
  console.log('converttoWei');
  return Web3.utils.fromWei(`${amount}`, 'ether');
};

const updateCollectionAddress = async (tokenId, owner, colName) => {
  tokenId = tokenId.toString();
  const user = await User.findOne({ address: owner });
  const artwork = await Artwork.findOneAndUpdate(
    { owner },
    {
      tokenId,
    }
  );
  console.log(artwork);
  EVENT.emit('stats-artwork-mint', {
    userId: user._id,
    type: STATS_UPDATE_TYPE.ownedArts,
  });
  console.log('artwork token id updated successfully');
};
const transfer = async (transferContract) => {
  const { from, to, tokenId } = transferContract;
  const result = await User.find({ address: to });
  console.log(result);
  try {
    if (
      from.toString() !== '0x0000000000000000000000000000000000000000' &&
      result.length === 0 &&
      to.toString() !== '0x8b22fd13958D4D34B072b6DD8db798eDc5240b76' && // auction contract
      from.toString() !== '0x865cf1FB2157130E776B0a6DDb72003be8244681' // mint contract
    ) {
      const artwork = await Artwork.findOne({ tokenId });
      await User.findOneAndUpdate({ address: from }, { $pull: { artworks: artwork._id } });
      await Auction.findOneAndDelete({ artwork: artwork._id });
      await BuySell.findOneAndDelete({ artwork: artwork._id });
      await Artwork.findOneAndDelete({ _id: artwork._id });
      console.log('transfer event called');
    } else {
      console.log('mint');
    }
  } catch (error) {
    console.log(error);
  }
};
const handleNewAuction = async (saleFromContract) => {
  let { tokenId, aucId, amount } = saleFromContract;
  console.log(tokenId);
  tokenId = tokenId.toString();
  try {
    // const collection = await Collection.findOne({ collectionAddress: colAddress });
    const artwork = await Artwork.findOne({ tokenId });
    console.log('artwork in auction ', artwork);
    if (await auctionService.artworkExistsInAuction(artwork._id)) {
      console.log('Artwork is already on auction');
      return;
    }
    const auctionData = await AUCTION_CONTRACT_INSTANCE.methods.AuctionList(aucId).call();
    const { endTime, startPrice } = auctionData;
    console.log('Price in auction', startPrice);
    const { owner, creater } = artwork;
    const params = {
      initialPrice: convertFromWei(startPrice),
      artwork: artwork._id,
      endTime: new Date(endTime * 1000),
      owner,
      creater,
      contractAucId: aucId,
    };

    const auction = await Auction.create(params);
    await User.findOneAndUpdate({ _id: owner }, { $pull: { artworks: artwork._id } });
    let res = null;
    if (amount !== undefined) {
      res = await Artwork.findOneAndUpdate(
        { _id: artwork._id },
        { owner, isAuctionOpen: true, endTime: new Date(endTime * 1000), amount }
      );
    } else {
      res = await Artwork.findOneAndUpdate(
        { _id: artwork._id },
        { owner, isAuctionOpen: true, endTime: new Date(endTime * 1000) }
      );
    }
    console.log('res in auction ', res);
    // await Artwork.findOneAndUpdate({ _id: artwork._id }, { owner: null });
    LISTENERS.openArtworkAuction({ artworkId: artwork._id, auction: auction._id });
  } catch (err) {
    console.log(err);
  }
};

const handleNewSale = async (saleFromContract) => {
  let { colAddress, tokenId, saleId, price, amount } = saleFromContract;
  price = convertFromWei(price);
  tokenId = tokenId.toString();
  try {
    // const collection = await Collection.findOne({ collectionAddress: colAddress });
    console.log('Price in Newsale', price);
    const artwork = await Artwork.findOne({ tokenId });
    if (!artwork.openForSale) {
      const { owner } = artwork;
      const params = {
        price,
        artwork: artwork._id,
        owner,
        contractSaleId: saleId,
      };

      const sale = await BuySell.create(params);
      await User.findOneAndUpdate({ _id: owner }, { $pull: { artworks: artwork._id } });
      if (amount !== undefined) {
        await Artwork.findOneAndUpdate({ _id: artwork._id }, { owner, sale: sale._id, openForSale: true, amount });
      } else {
        await Artwork.findOneAndUpdate({ _id: artwork._id }, { owner, sale: sale._id, openForSale: true });
      }

      // await Artwork.findOneAndUpdate({ _id: artwork._id }, { owner: null, sale: sale._id, openForSale: true });
    } else {
      console.log('Artwork is already on sale');
    }
  } catch (err) {
    console.log(err);
  }
};

const handleCancelSale = async (saleFromContract) => {
  let { saleId, amount } = saleFromContract;
  try {
    const sale = await BuySell.findOneAndUpdate({ contractSaleId: saleId }, { status: SALE_STATUS.CANCELLED }).populate(
      'artwork'
    );
    const { artwork } = sale;
    const usr = await User.findOneAndUpdate({ _id: sale.owner }, { $push: { artworks: artwork._id } });
    if (amount !== undefined) {
      await Artwork.findOneAndUpdate(
        { _id: artwork._id },
        {
          owner: sale.owner,
          isAuctionOpen: false,
          openForSale: false,
          auction: null,
          sale: null,
          auctionMintStatus: null,
          amount,
        }
      );
    } else {
      await Artwork.findOneAndUpdate(
        { _id: artwork._id },
        {
          owner: sale.owner,
          isAuctionOpen: false,
          openForSale: false,
          auction: null,
          sale: null,
          auctionMintStatus: null,
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const handleSaleComplete = async (saleFromContract) => {
  console.log('saleFormContract', saleFromContract);
  let { saleId, newOwner_, amount } = saleFromContract;
  try {
    console.log('new owner address', newOwner_);
    const sale = await BuySell.findOneAndUpdate({ contractSaleId: saleId }, { status: SALE_STATUS.COMPLETED }).populate(
      'artwork'
    );
    const { artwork } = sale;
    console.log('Price in SaleComplete', sale.price);
    const usr = await User.findOneAndUpdate({ _id: sale.owner }, { $pull: { artworks: artwork._id } });
    EVENT.emit('update-artwork-history', {
      artwork: artwork._id,
      message: `${usr.userName} was the owner`,
      type: HISTORY_TYPE.OWNERSHIP,
    });

    const artworks1 = await User.findOne({ address: newOwner_ });
    console.log(artworks1);
    let newArtworkOwner;
    if (!artworks1.artworks.includes(artwork._id)) {
      newArtworkOwner = await User.findOneAndUpdate({ address: newOwner_ }, { $push: { artworks: artwork._id } });
    }
    console.log('newArtworkOWner', newArtworkOwner);
    if (amount !== undefined) {
      await Artwork.findOneAndUpdate(
        { _id: artwork._id },
        {
          owner: newArtworkOwner._id,
          basePrice: artwork.price,
          price: sale.price,
          isAuctionOpen: false,
          openForSale: false,
          auction: null,
          sale: null,
          auctionMintStatus: null,
          amount,
        }
      );
    } else {
      await Artwork.findOneAndUpdate(
        { _id: artwork._id },
        {
          owner: newArtworkOwner._id,
          basePrice: artwork.price,
          price: sale.price,
          isAuctionOpen: false,
          openForSale: false,
          auction: null,
          sale: null,
          auctionMintStatus: null,
        }
      );
    }

    await BuySell.findOneAndUpdate({ _id: sale._id }, { buyer: newArtworkOwner._id });
    console.log('NFT Sale complete');
    EVENT.emit('record-transaction', {
      user: newArtworkOwner._id,
      type: TRANSACTION_TYPE.DEBIT,
      amount: sale.price,
      extraData: {
        activityType: TRANSACTION_ACTIVITY_TYPE.BUY_OP,
        sale: sale._id,
      },
    });
    EVENT.emit('record-transaction', {
      user: sale.owner,
      type: TRANSACTION_TYPE.CREDIT,
      amount: sale.price,
      extraData: {
        activityType: TRANSACTION_ACTIVITY_TYPE.BUY_OP,
        sale: sale._id,
      },
    });
    EVENT.emit('stats-artwork-mint', {
      userId: newArtworkOwner._id,
      type: STATS_UPDATE_TYPE.purchasedArts,
      amount: sale.price,
    });
    EVENT.emit('stats-artwork-mint', {
      userId: sale.owner,
      type: STATS_UPDATE_TYPE.soldArts,
      amount: sale.price,
    });
    EVENT.emit('send-and-save-notification', {
      receiver: sale.owner,
      type: NOTIFICATION_TYPE.NFT_BUY,
      message: `${newArtworkOwner.userName} has bought the artwork`,
      extraData: {
        sale: sale._id,
      },
    });
    const artwork1 = await artworkService.getArtworkById(artwork._id);

    await artworkService.updateArtworkGroup1(artwork._id);
    const result = await artworkService.getGroupArtworks1(artwork1.group);

    if (result.length === 0) {
      await groupService.setGroupStatusFalse(artwork.group);
      console.log("artwork group status changed");
    }


  } catch (err) {
    console.log(err);
  }
};

const handleNewBid = async (par) => {
  let { bid, bidder, aucId } = par;
  bid = convertFromWei(bid);
  const auctionData = await AUCTION_CONTRACT_INSTANCE.methods.AuctionList(aucId).call();
  let { colAddress, owner, tokenId } = auctionData;
  tokenId = tokenId.toString();
  const dbBidder = await User.findOne({ address: bidder });
  const dbOwner = await User.findOne({ address: owner });
  // const collection = await Collection.findOne({ collectionAddress: colAddress });
  // const artwork = await Artwork.findOne({ collectionId: collection._id, tokenId });
  // eslint-disable-next-line object-shorthand
  const artwork = await Artwork.findOne({ tokenId: tokenId });
  const auction = await Auction.findOne({ artwork: artwork._id, contractAucId: aucId });

  const params = {
    bidder: dbBidder._id,
    artwork: artwork._id,
    bid_amount: bid,
    owner: dbOwner._id,
    auction: auction._id,
  };

  const dbBid = await bidService.saveBid(params);

  EVENT.emit('save-bid-in-artwork', {
    artworkId: artwork._id,
    bidId: dbBid._id,
    auctionId: auction._id,
  });
  const bidder1 = await bidService.getBidder(dbBidder._id);
  console.log(bidder1);
  EVENT.emit('update-artwork-history', {
    artwork: artwork._id,
    message: `${dbBidder.userName} has placed the bid`,
    auction: auction._id,
    bid: dbBid._id,
    type: HISTORY_TYPE.BID_PLACED,
  });

  EVENT.emit('send-and-save-notification', {
    receiver: dbOwner._id,
    type: NOTIFICATION_TYPE.NEW_BID,
    message: `${dbBidder.userName} has placed the bid`,
    extraData: {
      bid: dbBid._id,
    },
  });
};

const handleNFTClaim = async (values) => {
  let { aucId, newOwner, collection, amount } = values;
  // amount = convertFromWei(amount);
  console.log('Values in NFT Claim', values);
  let { latestBid } = await AUCTION_CONTRACT_INSTANCE.methods.AuctionList(aucId).call();
  latestBid = convertFromWei(latestBid);
  const auction = await Auction.findOneAndUpdate({ contractAucId: aucId }, { nftClaim: true }).populate('artwork');
  const { artwork } = auction;
  const usr = await User.findOneAndUpdate({ _id: artwork.owner }, { $pull: artwork._id });
  EVENT.emit('update-artwork-history', {
    artwork: artwork._id,
    message: `${usr.userName} was the owner`,
    type: HISTORY_TYPE.OWNERSHIP,
  });
  const newArtworkOwner = await User.findOneAndUpdate({ address: newOwner }, { $push: { artworks: artwork._id } });
  if (amount !== undefined) {
    await Artwork.findOneAndUpdate(
      { _id: artwork._id },
      {
        owner: newArtworkOwner._id,
        basePrice: artwork.price,
        price: latestBid,
        isAuctionOpen: false,
        auction: null,
        auctionMintStatus: null,
        sale: null,
        openForSale: false,
        endTime: null,
        amount,
      }
    );
  } else {
    await Artwork.findOneAndUpdate(
      { _id: artwork._id },
      {
        owner: newArtworkOwner._id,
        basePrice: artwork.price,
        price: latestBid,
        isAuctionOpen: false,
        auction: null,
        auctionMintStatus: null,
        sale: null,
        openForSale: false,
        endTime: null,
      }
    );
  }

  EVENT.emit('record-transaction', {
    user: newArtworkOwner._id,
    type: TRANSACTION_TYPE.DEBIT,
    amount: latestBid,
    extraData: {
      activityType: TRANSACTION_ACTIVITY_TYPE.NFT_CLAIM,
      auction: auction._id,
    },
  });

  EVENT.emit('stats-artwork-mint', {
    userId: newArtworkOwner._id,
    type: STATS_UPDATE_TYPE.purchasedArts,
    amount: latestBid,
  });

  EVENT.emit('send-and-save-notification', {
    receiver: auction.owner,
    message: `${newArtworkOwner.userName} has claimed the artwork`,
    type: NOTIFICATION_TYPE.AUCTION_WIN,
    extraData: {
      auction: auction._id,
    },
  });

  await Auction.findOneAndDelete({ contractAucId: aucId });
  console.log('Auction delete successfully');
  console.log('NFT claimed successfully');
};

const handleNFTSale = async (values) => {
  let { aucId, owner, amount } = values;
  const auction = await Auction.findOneAndUpdate({ contractAucId: aucId }, { ownerclaim: true }).populate('artwork');
  const { artwork } = auction;
  const user = await User.findOneAndUpdate({ address: owner }, { $pull: artwork._id });

  EVENT.emit('record-transaction', {
    user: user._id,
    type: TRANSACTION_TYPE.CREDIT,
    amount,
    extraData: {
      activityType: TRANSACTION_ACTIVITY_TYPE.NFT_SALE,
      auction: auction._id,
    },
  });

  EVENT.emit('stats-artwork-mint', {
    userId: user._id,
    type: STATS_UPDATE_TYPE.soldArts,
    amount,
  });
  console.log('NFT claimed successfully');
};

const handleClaimBack = async (values) => {
  let { aucId, amount } = values;
  // amount = convertFromWei(amount);
  const auction = await Auction.findOneAndUpdate(
    { contractAucId: aucId },
    { cancelled: true, status: AUCTION_STATUS.CLOSED }
  );
  const usr = await User.findOneAndUpdate({ _id: auction.owner }, { $push: { artworks: auction.artwork } });
  if (amount !== undefined) {
    await Artwork.findOneAndUpdate(
      { _id: auction.artwork },
      {
        owner: auction.owner,
        isAuctionOpen: false,
        auction: null,
        auctionMintStatus: null,
        sale: null,
        openForSale: false,
        endTime: null,
        amount,
      }
    );
  } else {
    await Artwork.findOneAndUpdate(
      { _id: auction.artwork },
      {
        owner: auction.owner,
        isAuctionOpen: false,
        auction: null,
        auctionMintStatus: null,
        sale: null,
        openForSale: false,
        endTime: null,
      }
    );
  }

  console.log('NFT claimed back successfully');
};

module.exports = {
  updateCollectionAddress,
  handleNewAuction,
  handleNewBid,
  handleNFTClaim,
  handleNFTSale,
  handleClaimBack,
  handleNewSale,
  handleCancelSale,
  handleSaleComplete,
  transfer,
};
