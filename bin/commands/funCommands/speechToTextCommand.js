const execa = require('execa');
const path = require('path');
const util = require('util');
const tmpdir = require('os').tmpdir;
const {MessageTypes} = require('whatsapp-web.js');
const Crypto = require('crypto');
const mime = require('mime');
const fs = require('fs');

/**
 * Returns a random temp path.
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
  await fs.writeFileSync(tempPath, binaryData,
      'binary');
  const newTempPath = tempPath.split('.')[0] + '.wav';
  await execa('ffmpeg', ['-i', tempPath, newTempPath]);
  return newTempPath;
};

/**
 * Process speechToText command.
 *
 * @param {Message}message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  // Message processing.

  const quotedMessage = (await message.getQuotedMessage());
  if (!quotedMessage || !(quotedMessage.type === MessageTypes.VOICE || quotedMessage.type === MessageTypes.AUDIO)) {
    return;
  }
  const media = await quotedMessage.downloadMedia();
  const tempPath = await saveFileToTempPath(media.data, media.mimetype);
  const res = await execa('python', [
    path.resolve(
        __dirname + '../../../pythonScripts/speechToText.py'),
    tempPath]);
  const file = await fs.readFileSync(
      path.resolve(__dirname, '..\\..\\pythonScripts\\temp.txt'), 'utf8');
  // Remove temp files.
  try {
    fs.unlinkSync(tempPath);
    fs.unlinkSync(path.resolve(__dirname, '..\\..\\pythonScripts\\temp.txt'));
    fs.unlinkSync(tempPath.split('.')[0] + '.oga');
  } catch (err) {
    console.error(err);
  }
  // Beautify output.
  if (res['failed']) {
    console.log(util.inspect(res));
    return;
  }
  const output = 'התמלול של ההודעה הסתיים:' + '\n' + file.toString();
  await message.reply(output);
};

module.exports = procCommand;
