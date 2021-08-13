const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const tmpdir = require('os').tmpdir;
const Crypto = require('crypto');
const dataUri = require('datauri');
const fs = require('fs');
const dataUriToBuffer = require('data-uri-to-buffer');
const {MessageMedia} = require('whatsapp-web.js');
const axios = require('axios');
/**
 * The functions transforms gifs to mp4. Because of the limitations of ffmpeg,
 * both the input and the output are files.
 *
 * @param {string} gifDataUri - the gif you want to convert in dataUri format.
 * @return {Promise<string>}
 */
const gifToMp4 = async (gifDataUri) => {
  const tempInputFile = path.join(tmpdir(),
      `processing.
      ${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}
      .gif`);
  const tempOutputFile = path.join(tmpdir(),
      `processing.
      ${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}
      .mp4`);
  fs.writeFileSync(tempInputFile, dataUriToBuffer(gifDataUri));
  await new Promise((resolve, reject) => {
    ffmpeg(tempInputFile).inputFormat('gif').outputOptions([
      '-movflags faststart',
      '-pix_fmt yuv420p',
    ]).videoFilter([
      {
        filter: 'scale',
        options: 'trunc(iw/2)*2:trunc(ih/2)*2',
      },
    ]).toFormat('mp4').on('error', function(err) {
      reject(err);
    }).on('end', function() {
      resolve(true);
    }).save(tempOutputFile);
  });
  const outputDataUri = await dataUri(tempOutputFile);
  fs.unlinkSync(tempOutputFile);
  fs.unlinkSync(tempInputFile);
  return outputDataUri;
};

const urlToMessageMedia = async (url, filename=undefined, ) => {
  const options = {
    method: 'GET',
    url: url,
    responseType: 'arraybuffer',
  };
  const retrievedMedia = await axios.request(options);
  const dataURI = 'data:'+retrievedMedia.headers['content-type']+';base64,'+Buffer.from(retrievedMedia.data, 'binary').toString('base64')
  let media = MessageMedia.fromDataUri(dataURI, filename);
  return media;
};
module.exports.gifToMp4 = gifToMp4;
module.exports.urlToMessageMedia = urlToMessageMedia;
