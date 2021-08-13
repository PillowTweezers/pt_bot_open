const Jimp = require('jimp');
const {MessageMedia} = require('whatsapp-web.js');
const profilePicMaskPath = './public/loveCalculator/profilePicMask.png';
const fontPath = './public/loveCalculator/fonts/names.fnt';
const stringUtils = require('../../utils/stringUtils');
const {getRandomIntInclusive} = require('../../utils/random');
const {shadow} = require('../../utils/imageEffects');

/**
 * Returns a random number between 0 and 100, uses names as seed.
 *
 * @param {string} name1
 * @param {string} name2
 * @return {number}
 */
const getLovePercentage = (name1, name2) => {
  const namesArray = [name1, name2].sort();
  return getRandomIntInclusive(0, 100, {seed: namesArray[1] + namesArray[0]});
};

/**
 * Expend and add shadow to profile pic, expended by 40x40;
 *
 * @param {Jimp} profilePic
 * @return {Promise<Jimp>}
 */
const shadowProfilePic = async (profilePic) => {
  return (await shadow(profilePic, 40, 40,
      {opacity: 0.2, size: 1, blur: 10, x: 0, y: 0}));
};

/**
 * Uses mask on profile pic.
 *
 * @param {Jimp} profilePic
 * @return {Promise<Jimp>}
 */
const maskProfilePic = async (profilePic) => {
  const profilePicMask = await Jimp.read(profilePicMaskPath);
  await profilePicMask.resize(profilePic.getWidth(), profilePic.getHeight());
  return (await profilePic.mask(profilePicMask, 0, 0));
};

/**
 *
 * @param {Jimp} image
 * @param {string}  profilePicUrl
 * @param {boolean} onRight
 * @return {Promise<void>}
 */
const drawProfilePic = async (image, profilePicUrl, onRight) => {
  const downloadedPic = await Jimp.read(profilePicUrl).
      catch((err) => console.log(err));
  if (!downloadedPic) {
    return;
  }
  await downloadedPic.resize(230, 230);

  const profilePicComp = await shadowProfilePic(
      await maskProfilePic(downloadedPic));

  const x = onRight ? 230 : 0;
  const y = onRight ? 230 : 0;
  await image.composite(profilePicComp, x, y);
};

const drawProfileName = async (image, name, onRight) => {
  const font = await Jimp.loadFont(fontPath);

  const fontHeight = Jimp.measureTextHeight(font, name, 230);
  const x = onRight ? 20 : 250;
  const y = onRight ? 480 - fontHeight : 20;

  await image.print(
      font,
      x,
      y,
      {
        text: stringUtils.reverseHe(name),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      230);
};

const drawLovePercentage = async (image, percentage) => {
  const font = await Jimp.loadFont(
      './public/loveCalculator/fonts/percentageFont.fnt');
  const text = percentage.toString() + '%';
  const textWidth = Jimp.measureText(font, text);
  const textHeight = Jimp.measureTextHeight(font, text, 260);
  await image.print(
      font,
      (image.getWidth() - textWidth) / 2 + 4,
      (image.getHeight() - textHeight) / 2 - 10,
      text,
  );
};

const drawHeart = async (image, filledPercentage) => {
  const heartEmpty = await Jimp.read('./public/loveCalculator/heartEmpty.png');
  await heartEmpty.resize(230, 230);
  const heartFilled = await Jimp.read(
      './public/loveCalculator/heartFilled.png');
  await heartFilled.resize(230, 230);

  const heightBar = heartEmpty.getHeight() * (100 - filledPercentage) / 100;
  await heartFilled.crop(0, heightBar, heartFilled.getWidth(),
      heartFilled.getHeight() - heightBar);
  const heartComp = await heartEmpty.composite(heartFilled, 0, heightBar);

  const heartRender = await shadow(heartComp, 40, 40,
      {opacity: 0.3, size: 1, blur: 10, x: 0, y: 0});

  const x = (image.getWidth() - heartRender.getWidth()) / 2;
  const y = (image.getHeight() - heartRender.getHeight()) / 2;
  await image.composite(heartRender, x, y);
};

const addDecoration = async (image) => {
  const decorations = await Jimp.read(
      './public/loveCalculator/decorations.png');

  await image.composite(decorations, 0, 0);
};

/**
 *
 * @param {Contact} contact1
 * @param {Contact} contact2
 * @return {Promise<Jimp>}
 */
const generateLoveImage = async (contact1, contact2) => {
  const loveImage = await Jimp.read(
      './public/loveCalculator/loveBackground.png');

  await drawProfilePic(loveImage, await contact1.getProfilePicUrl(), false);
  await drawProfilePic(loveImage, await contact2.getProfilePicUrl(), true);

  const name1 = contact1.pushname || contact1.name || '';
  const name2 = contact2.pushname || contact2.name || '';

  await drawProfileName(loveImage, name1, false);
  await drawProfileName(loveImage, name2, true);

  const lovePercentage = getLovePercentage(name1, name2);
  await drawHeart(loveImage, lovePercentage);
  await drawLovePercentage(loveImage, lovePercentage);

  await addDecoration(loveImage);

  return (await loveImage);
};

/**
 * Processes love calculator command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  const mentions = await message.getMentions();
  if (mentions.length < 1) {
    return;
  }
  mentions.push(await message.getContact());

  const loveImage = await generateLoveImage(mentions[0], mentions[1]);
  const loveImageDataUri = await loveImage.getBase64Async(Jimp.MIME_PNG);
  await message.reply(MessageMedia.fromDataUri(loveImageDataUri, 'love.png'),
      undefined, {sendMediaAsSticker: true});
};

module.exports = procCommand;
