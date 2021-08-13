const Jimp = require('jimp');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const backgroundPath = path.resolve(__dirname, '../../../public/shots/background.png');
const profilePicMaskPath = path.resolve(__dirname, '../../../public/shots/profilePicMask.png');
const shotPicturePath = path.resolve(__dirname, '../../../public/shots/shot.png');
const bottlePicturePath = path.resolve(__dirname, '../../../public/shots/bottle.png');
const namesFontPath = path.resolve(__dirname, '../../../public/shots/fonts/names.fnt');
const shotsLineFontPath = path.resolve(__dirname, '../../../public/shots/fonts/mainFont.fnt');
const { removeEmojis, reverseHe, reverse } = require('../../utils/stringUtils');
const shotsConfig = require('../../../config/shots.json');
const { getRandomIntInclusive } = require('../../utils/random');

/**
 * Returns a random number between 0 and 100, uses names as seed.
 *
 * @param {string} name1
 * @param {string} name2
 * @return {number}
 */
const getShotCount = (name1, name2) => {
  const namesArray = [name1, name2].sort();
  let seed = namesArray[0] + namesArray[1]
  const regulator = getRandomIntInclusive(0, 100, seed);
  if (regulator <= shotsConfig.lowProbability * 100) {
    return getRandomIntInclusive(shotsConfig.lowBounds[0],
      shotsConfig.lowBounds[1], seed)
  } else {
    seed = reverse(seed);
    return getRandomIntInclusive(shotsConfig.highBounds[0],
      shotsConfig.highBounds[1], seed)
  }
};

/**
 * Uses mask on profile pic.
 *
 * @param {Jimp} profilePic
 * @return {Promise<Jimp>}
 */
const maskProfilePic = async (profilePic) => {
  const profilePicMask = await Jimp.read(profilePicMaskPath);
  profilePicMask.resize(profilePic.getWidth(), profilePic.getHeight());
  return profilePic.mask(profilePicMask, 0, 0);
};

/**
 * Draws profile pic to main image.
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
  downloadedPic.resize(115, 115);
  const compPic = await maskProfilePic(downloadedPic);
  compPic.rotate(-25);

  const x = onRight ? 275 : 130;
  const y = onRight ? 200 : 130;
  image.composite(compPic, x, y);
};

/**
 * Draws profile name in requested position.
 *
 * @param {Jimp} image
 * @param {String} name
 * @param {boolean} onRight
 */
const drawProfileName = async (image, name, onRight) => {
  const font = await Jimp.loadFont(namesFontPath);

  const x = onRight ? 20 : 275;
  const y = 20;

  image.print(
    font,
    x,
    y,
    {
      text: reverseHe(name),
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    205);
};

/**
 * Draws plus in the middle of names.
 *
 * @param {Jimp} image
 */
const drawPlus = async (image) => {
  const font = await Jimp.loadFont(namesFontPath);

  const x = 230;
  const y = 20;

  image.print(
    font,
    x,
    y,
    {
      text: '+',
    },
    205);
}

/**
 * Draws decorations to image.
 *
 * @param {Jimp} image
 * @param {number} shotCount
 * @returns {Promise<void>}
 */
const drawDecorations = async (image, shotCount) => {
  if (shotCount >= shotsConfig.highBounds[0]) {
    const bottlePicture = await Jimp.read(bottlePicturePath);
    bottlePicture.resize(50, 100);
    for (let i = 0; i < shotCount / 22; i++) {
      const x = 480 - 50 - 46 * (i % 10);
      const y = 480 - 80 + 30 * Math.floor(i / 10);
      image.composite(bottlePicture, x, y);
    }
  } else {
    const shotPicture = await Jimp.read(shotPicturePath);
    shotPicture.resize(50, 50);
    for (let i = 0; i < shotCount; i++) {
      const x = 480 - 50 - 46 * (i % 10);
      const y = 500 - 80 + 30 * Math.floor(i / 10);
      image.composite(shotPicture, x, y);
    }
  }
};

/**
 * Draws the line with the shot count on image.
 *
 * @param {Jimp} image
 * @return {Promise<Void>}
 */
const drawShotsLine = async (image, shotCount) => {
  const font = await Jimp.loadFont(shotsLineFontPath);
  if (!font) {
    throw 'Coudn\'t load shots line font!';
  }
  const text = reverseHe("שוטים לצ'יקנוף " + shotCount);
  const textHeight = Jimp.measureTextHeight(font, text, 460);
  image.print(font, 10, 415 - textHeight, {
    text: text,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  }, 460);
}

/**
 *
 * @param {Contact} contact1
 * @param {Contact} contact2
 * @return {Promise<Jimp>}
 */
const generateLoveImage = async (contact1, contact2) => {
  const finalImage = await Jimp.read(backgroundPath);

  await drawProfilePic(finalImage, await contact1.getProfilePicUrl(), false);
  await drawProfilePic(finalImage, await contact2.getProfilePicUrl(), true);

  const name1 = removeEmojis(contact1.pushname || contact1.name || '');
  const name2 = removeEmojis(contact2.pushname || contact2.name || '');
  const shotCount = getShotCount(name1, name2);

  await drawProfileName(finalImage, name1, false);
  await drawProfileName(finalImage, name2, true);
  await drawPlus(finalImage);

  await drawDecorations(finalImage, shotCount);
  await drawShotsLine(finalImage, shotCount);

  return finalImage;
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
    undefined, { sendMediaAsSticker: true });
};

module.exports = procCommand;
