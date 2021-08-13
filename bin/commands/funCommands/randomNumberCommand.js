const {getRandomIntInclusive} = require('../../utils/random');

/**
 * Process random number command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  let min = parseInt(message.body.split(' ')[1]);
  let max = parseInt(message.body.split(' ')[2]);
  if (isNaN(max) || isNaN(min)) {
    return;
  }
  if (max < min) {
    const temp = min;
    min = max;
    max = temp;
  }
  await message.reply(getRandomIntInclusive(min, max).toString());
};

module.exports = procCommand;
