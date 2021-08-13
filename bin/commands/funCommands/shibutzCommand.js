const seedRandom = require('seedrandom');
const shuffleSeed = require('shuffle-seed');
const shibutzConfig = require('../../../config/shibutz.json');
const {getRandomDistributed, getRandomIntInclusive} = require(
    '../../utils/random');
const Jimp = require('jimp');
const tinycolor = require('tinycolor2');
const {reverseHe, removeEmojis} = require('../../utils/stringUtils');
const {MessageMedia} = require('whatsapp-web.js');
const {shadow} = require('../../utils/imageEffects');

const backgroundMaskPath = './public/shibutz/backgroundMask.png';
const secondColorMaskPath = './public/shibutz/secondColorMask.png';
const profilePicMaskPath = './public/shibutz/profilePicMask.png';
const decorationPath = './public/shibutz/decoration.png';
const warningPath = './public/shibutz/warning.png';
const namesFontPath = './public/shibutz/fonts/namesFont.fnt';
const roleFontPath = './public/shibutz/fonts/rolesFont.fnt';

/**
 * Randomly gives people roles.
 * @param {Message} message
 * @param {Contact} contact
 * @param {function} prng
 * @return {Promise<Object>} - role
 */
const getShibutz = async (message, contact, prng) => {
  // Important-roles check.
  const chat = await message.getChat();
  const members = shuffleSeed.shuffle(chat.participants,
      chat.createdAt.toISOString());
  const index = members.findIndex((e) => e.id.user === contact.id.user);
  const importantRoles = [];
  for (const role of Object.values(shibutzConfig.importantRoles)) {
    for (let i = 0; i < role.amount; i++) {
      importantRoles.push(role);
    }
  }
  const imSize = Object.values(shibutzConfig.importantRoles).
      reduce((a, b) => ({amount: a.amount + b.amount})).amount;
  const noSize = Object.values(shibutzConfig.roles).
      reduce((a, b) => ({weight: a.weight + b.weight})).weight;
  const maxSize = imSize + noSize;
  if (!getRandomIntInclusive(0, Math.ceil(maxSize / members.length),
      {PRNG: prng})) {
    if (index < importantRoles.length) {
      return importantRoles[index];
    }
  }
  // Normal roles check.
  return getRandomDistributed(shibutzConfig.roles, {PRNG: prng});
};

/**
 * Generates background image with requested color.
 * @param {Object} shibutz
 * @return {Jimp}
 */
const genBackgroundImg = async (shibutz) => {
  const backgroundColor = tinycolor(shibutz.backgroundColor[0]).toHex();
  const backgroundImage = new Jimp(500, 500, backgroundColor);
  const backgroundMask = await Jimp.read(backgroundMaskPath);
  backgroundImage.mask(backgroundMask, 0, 0);
  if (shibutz.backgroundColor.length === 2) {
    const secondColor = tinycolor(shibutz.backgroundColor[1]).toHex();
    const colorLayer = new Jimp(500, 500, secondColor);
    const colorMask = await Jimp.read(secondColorMaskPath);
    colorLayer.mask(backgroundMask, 0, 0);
    colorLayer.mask(colorMask, 0, 0);
    backgroundImage.composite(colorLayer, 0, 0);
  }
  return backgroundImage;
};

/**
 * Draws profile pic to image.
 * @param {Jimp} src
 * @param {Contact} contact
 * @return {Promise<void>}
 */
const drawProfilePic = async (src, contact) => {
  const profilePicUrl = await contact.getProfilePicUrl();
  if (!profilePicUrl) {
    return;
  }
  const downloadedPic = await Jimp.read(profilePicUrl).
      catch((err) => console.log(err));
  if (!downloadedPic) {
    return;
  }
  const width = 350, height = 350;
  downloadedPic.resize(width, height);

  const profilePicMask = await Jimp.read(profilePicMaskPath);
  profilePicMask.resize(width, height);
  downloadedPic.mask(profilePicMask, 0, 0);

  const profilePic = await shadow(downloadedPic, 40, 40,
      {opacity: 0.2, size: 1, blur: 10, x: 0, y: 0});

  const x = (src.getWidth() - profilePic.getWidth()) / 2;
  const y = (src.getHeight() - profilePic.getHeight()) * (4 / 5);
  src.composite(profilePic, x, y);
};

/**
 * Write title to image.
 * @param {Jimp} src
 * @param {Contact} contact
 * @param {string} role
 * @return {Promise<void>}
 */
const writeDetails = async (src, contact, role) => {
  const namesFont = await Jimp.loadFont(namesFontPath);
  const name = contact.pushname || contact.name || '';
  const displayName = removeEmojis(reverseHe(name));
  src.print(namesFont, 0, 0, {
    text: displayName,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
  }, 480);

  const rolesFont = await Jimp.loadFont(roleFontPath);
  const y = Jimp.measureTextHeight(namesFont, displayName, 480) - 10;
  src.print(rolesFont, 0, y, {
    text: removeEmojis(reverseHe(role)),
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
  }, 500);
};

/**
 * Draws decoration to image.
 * @param {Jimp} src
 * @param {function} prng
 * @return {Promise<void>}
 */
const drawDecorations = async (src, prng) => {
  const decoration = await Jimp.read(decorationPath);
  decoration.resize(120, 140);
  {
    const x = 5;
    const y = (src.getHeight() - decoration.getHeight()) * (4 / 5);
    src.composite(decoration, x, y);
  }
  {
    const x = src.getWidth() - decoration.getWidth() - 5;
    const y = (src.getHeight() - decoration.getHeight()) * (2 / 5);
    src.composite(decoration, x, y);
  }
  if (!getRandomIntInclusive(0, 9, {PRNG: prng})) {
    const warning = await Jimp.read(warningPath);
    warning.resize(400, 150);
    const x = (src.getWidth() - warning.getWidth()) / 2;
    const y = src.getHeight() - warning.getHeight();
    src.composite(warning, x, y);
  }
};

/**
 * Generates shibutz pic and returns it.
 * @param {Message} message
 * @param {Contact} contact
 * @return {Promise<Jimp>}
 */
const getShibutzPic = async (message, contact) => {
  const name = contact.pushname || contact.name || '';
  const prng = seedRandom(name);
  const shibutz = await getShibutz(message, contact, prng);
  const image = await genBackgroundImg(shibutz);
  await drawProfilePic(image, contact);
  await writeDetails(image, contact, shibutz.displayName);
  await drawDecorations(image, prng);
  return image;
};

/**
 * Process shibutzCommand
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  const mentions = await message.getMentions();
  const contact = mentions.length ? mentions[0] : (await message.getContact());
  const shibutzPic = await getShibutzPic(message, contact);
  const picDataUri = await shibutzPic.getBase64Async(Jimp.MIME_PNG);
  await message.reply(MessageMedia.fromDataUri(picDataUri, 'shibutz.png'),
      undefined, {sendMediaAsSticker: true});
};

module.exports = procCommand;
