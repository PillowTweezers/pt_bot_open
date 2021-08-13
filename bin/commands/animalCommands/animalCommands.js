const animalsApi = require('./animalsApi');
const MediaHelper = require('../../utils/mediaHelper');
const {MessageMedia} = require('whatsapp-web.js');

/**
 * Sends media to a chat.
 * Handles gifs and images.
 *
 * @param {Message} message
 * @param {WAWebJS.MessageMedia} imageInMessageMedia
 * @return {Promise<void>}
 */
const replyWithMedia = async (message, imageInMessageMedia) => {
  if (imageInMessageMedia.mimetype === 'image/gif') {
    const mp4InDataURI = await MediaHelper.gifToMp4(
        'data:image/gif;base64,' + imageInMessageMedia.data);
    // base64 encoded data doesn't contain commas
    const base64ContentArray = mp4InDataURI.split(',');
    // base64 content cannot contain whitespaces but nevertheless skip if there
    // are!
    const mimeType = base64ContentArray[0].match(
        /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
    // base64 encoded data - pure
    const base64Data = base64ContentArray[1];
    await message.reply(new MessageMedia(mimeType, base64Data), undefined,
        {sendVideoAsGif: true});
  } else {
    await message.reply(imageInMessageMedia);
  }
};

/**
 * Process cat command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const catCommand = async (message) => {
  const imageInMessageMedia = await animalsApi.cat();
  await replyWithMedia(message, imageInMessageMedia);
};

/**
 * Process dog command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const dogCommand = async (message) => {
  const imageInMessageMedia = await animalsApi.dog();
  await replyWithMedia(message, imageInMessageMedia);
};

/**
 * Process duck command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const duckCommand = async (message) => {
  const imageInMessageMedia = await animalsApi.duck();
  await replyWithMedia(message, imageInMessageMedia);
};

/**
 * Process fox command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const foxCommand = async (message) => {
  const imageInMessageMedia = await animalsApi.fox();
  await replyWithMedia(message, imageInMessageMedia);
};

/**
 * Process lizard command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const lizardCommand = async (message) => {
  const imageInMessageMedia = await animalsApi.lizard();
  await replyWithMedia(message, imageInMessageMedia);
};

/**
 * Process shiba command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const shibaCommand = async (message) => {
  const imageInMessageMedia = await animalsApi.shiba();
  await replyWithMedia(message, imageInMessageMedia);
};

/**
 * Process pig command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const pigCommand = async (message) => {
  const imageInMessageMedia = await animalsApi.pig();
  await replyWithMedia(message, imageInMessageMedia);
};

module.exports = {
  catCommand,
  dogCommand,
  duckCommand,
  foxCommand,
  lizardCommand,
  shibaCommand,
  pigCommand,
};
