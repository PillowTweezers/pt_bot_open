const { randomFromArr } = require('../../utils/random');

/**
 * Tags a random user.
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  const chat = await message.getChat();

  if (!chat.isGroup) {
    return;
  }

  const participant = randomFromArr(chat.participants);
  const output = `@${participant.id.user} `;
  const mentions = [participant];
  await message.reply(output, undefined, { mentions: mentions });
};

module.exports = procCommand;