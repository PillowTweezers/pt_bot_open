const execa = require('execa');
const path = require('path');
const util = require('util');
const tmpdir = require('os').tmpdir;
const {MessageTypes} = require('whatsapp-web.js');
const Crypto = require('crypto');
const mime = require('mime');
const fs = require('fs');

/**
 * Generates random path in temp-dir.
 *
 * @param {string} mimeType
 * @return {string}
 */
const generateTempPath = (mimeType) => {
  return path.join(tmpdir(),
      'processing-' +
      Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) +
      '.' + mime.getExtension(mimeType));
};

/**
 * saving file to path.
 *
 * @param {string} imageBase64
 * @param {string} mimeType
 * @return {string} tempPath
 */
const saveFileToTempPath = async (imageBase64, mimeType) => {
  // const base64Data = imageBase64.replace('+', ' ');
  const binaryData = Buffer.from(imageBase64, 'base64').toString('binary');
  const tempPath = generateTempPath(mimeType);
  await fs.writeFile(tempPath, binaryData,
      'binary', (err) => {
        if (err) {
          throw err;
        }
      });
  return tempPath;
};

/**
 * Process compare command.
 *
 * @param {Message}message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  // Validate call.
  const quotedMessage = await message.getQuotedMessage();
  if (!quotedMessage || message.type !== MessageTypes.IMAGE ||
      quotedMessage.type !== MessageTypes.IMAGE) {
    return;
  }
  // Process messages.
  const messageMedia = (await message.downloadMedia());
  const quotedMessageMedia = (await quotedMessage.downloadMedia());
  // eslint-disable-next-line no-unused-vars
  const messageMediaPath = await saveFileToTempPath(messageMedia.data,
      messageMedia.mimetype);
  const quotedMessageMediaPath = await saveFileToTempPath(
      quotedMessageMedia.data, quotedMessageMedia.mimetype);
  // Call script.
  const res = await execa('python', [
    path.resolve(
        __dirname + '../../../pythonScripts/faceRecognition/compareFaces.py'),
    messageMediaPath,
    quotedMessageMediaPath]);

  // Remove temp files.
  try {
    fs.unlinkSync(messageMediaPath);
    fs.unlinkSync(quotedMessageMediaPath);
  } catch (err) {
    console.error(err);
  }

  // Beautify output.
  if (res['failed']) {
    console.log(util.inspect(res));
    return;
  }
  let output;
  if (parseFloat(res['stdout'])===-1){
    output = '*לא נמצאו פנים באחת מהתמונות.*';
  }else {
    const distancePercent = ((1 - parseFloat(res['stdout'])) * 100).toFixed(2);
    output = '*נמצא דמיון של כ' + distancePercent + ' אחוזים*';
  }
  await message.reply(output);
};

module.exports = procCommand;
