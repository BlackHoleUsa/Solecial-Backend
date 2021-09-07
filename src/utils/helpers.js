const pinataSDK = require('@pinata/sdk');
const config = require('../config/config');
const { Readable } = require('stream');
const AWS = require('aws-sdk');
const fs = require('fs');
const IPFS = require('ipfs');
const { CID } = require('ipfs');
const pinata = pinataSDK(config.pinata.api_key, config.pinata.api_secret);

const addFilesToIPFS = async (photo, type) => {
  try {
    const stream = Readable.from(photo);
    stream.path = '/QmcXq6xxeU4UZv4FHRsDW9tcs5CYigDaxCb1wQZDPcjQVx/3';

    const options = {
      pinataMetadata: {
        name: 'testImage',
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const imgData = await pinata.pinFileToIPFS(stream, options);
    return `https://gateway.pinata.cloud/ipfs/${imgData.IpfsHash}`.toString();
  } catch (err) {
    console.log('---error ipfs---', err);
  }
};

const uploadToAws = (photo, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new AWS.S3();

      const params = {
        Bucket: config.aws.bucket,
        Key: `${path}`,
        Body: photo,
        ACL: 'public-read',
        ContentEncoding: 'base64',
      };
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    } catch (error) {
      console.log('Uploading to amazon error', error);
      reject(err);
    }
  });
};

const deleteFromAWS = (key) => {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new AWS.S3();
      var params = {
        Bucket: config.aws.bucket,
        Key: `${key}`,
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject();
        } else {
          resolve(data);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createCollectionHash = async (collectionId) => {
  try {
    const ipfs = await IPFS.create();

    // fs.mkdirSync('src/utils/test.txt', { recursive: true })
    // await fs.promises.mkdir('src/utils/test');
    // await fs.promises.writeFile('src/utils/test.txt', 'Hello bro how are u?');
    await ipfs.files.mkdir(`/collections`, { parents: true });
    await ipfs.files.write(`/collections/${collectionId.toString()}`, 'src/utils/test.txt', { create: true });
    const stats = await ipfs.files.stat(`/collections`);

    // await fs.promises.unlink('src/utils/test', { recursive: true });

    return stats.cid.toString();
  } catch (err) {
    console.log('---error ipfs---', err);
  }
};
module.exports = {
  addFilesToIPFS,
  uploadToAws,
  createCollectionHash,
  deleteFromAWS,
};
