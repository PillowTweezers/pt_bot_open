const execa = require('execa');
const path = require('path');
const tmpdir = require('os').tmpdir;
const {MessageTypes, MessageMedia} = require('whatsapp-web.js');
const Crypto = require('crypto');
const mime = require('mime');
const fs = require('fs');

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
    return tempPath;
};

/**
 * Process colorize command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    if (message.type !== MessageTypes.IMAGE) {
        if (message.hasQuotedMsg){
            message = await message.getQuotedMessage();
        }else {
            return;
        }
    }
    // Process messages.
    const messageMedia = (await message.downloadMedia());

    const messageMediaPath = await saveFileToTempPath(messageMedia.data,
        messageMedia.mimetype);

    // Call script.
    const res = await execa('python', [
        path.resolve(__dirname + '../../../pythonScripts/colorizer.py'),
        messageMediaPath]);

    await message.reply(MessageMedia.fromFilePath(messageMediaPath));
    try {
        fs.unlinkSync(messageMediaPath);
        // file removed
    } catch (err) {
        console.error(err);
    }
};

module.exports = procCommand;
