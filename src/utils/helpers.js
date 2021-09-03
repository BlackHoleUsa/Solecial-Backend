const pinataSDK = require('@pinata/sdk');
const config = require('../config/config');
const { Readable } = require('stream');
const AWS = require('aws-sdk');
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

    const imgData = pinata.pinFileToIPFS(stream, options);
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

const createCollectionHash = async (collectionId) => {
  try {
    // const stream = Readable.from(photo);
    // stream.path = '/QmcXq6xxeU4UZv4FHRsDW9tcs5CYigDaxCb1wQZDPcjQVx/3';

    const options = {
      pinataMetadata: {
        name: 'testImage',
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const colData = await pinata.pinJSONToIPFS({
      pinataMetadata: {
        name: 'customNameForYourJSONObject',
        keyvalues: {
          customKey: 'customValue',
          customKey2: 'customValue2',
        },
      },
      collectionId: collectionId.toString(),
    });

    // const metadata = {
    //   name: 'test',
    //   keyvalues: {
    //     newKey: 'newValue',
    //     existingKey: 'newValue',
    //     existingKeyToRemove: null,
    //   },
    // };
    // const result = await pinata.hashMetadata(colData.IpfsHash, metadata);
    // console.log(result);

    return `https://gateway.pinata.cloud/ipfs/${colData.IpfsHash}`.toString();
  } catch (err) {
    console.log('---error ipfs---', err);
  }
};
module.exports = {
  addFilesToIPFS,
  uploadToAws,
  createCollectionHash,
};
