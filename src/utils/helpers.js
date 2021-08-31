const IPFS = require('ipfs');
const pinataSDK = require('@pinata/sdk');
const config = require('../config/config');
const { createReadStream } = require('fs');
const { Readable } = require('stream');
const os = require('os');
const path = require('path');
const fs = require('fs');
const pinata = pinataSDK(config.pinata.api_key, config.pinata.api_secret);

const addFilesToIPFS = async (photo, type) => {
  try {
    // const readable = new Readable();
    // readable._read = () => {};
    // readable.push(photo);

    // const readableInstanceStream = new Readable({
    //   read() {
    //     this.push(photo);
    //     this.push(null);
    //   },
    // });

    const stream = Readable.from(photo);
    stream.path = 'some_filename.png';
    // const tmp = path.resolve(os.tmpdir(), `${new Date().getTime()}.png`);

    // await fs.writeFile(tmp, photo);

    // const stream = fs.createReadStream(tmp);

    // const stream = Readable.from(photo);

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

const loadImage = async (cid, ipfs) => {
  let file = '';

  ipfs.files.read(`http://ipfs.io/ipfs/` + cid, (err, files) => {
    if (err) {
      console.log('--error getting files---', err);
    }
    pos;
    console.log('---files----', files);
    file = files;
  });

  return file;
};

module.exports = {
  addFilesToIPFS,
};
