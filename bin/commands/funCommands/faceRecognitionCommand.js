const procImage = require('../../faceRecognition/faceRecognition');
const {MessageMedia} = require('whatsapp-web.js');

/**
 * Process face recognition command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procMessage = async (message) => {
  const messageMedia = await message.downloadMedia();
  // Sometimes media gets corrupted and fails to download.
  if (!messageMedia) {
    return;
  }
  const processedImage = await procImage(messageMedia.getDataUri());
  const outputImage = MessageMedia.fromDataUri(processedImage);
  await message.reply(outputImage);
};

module.exports = procMessage;
