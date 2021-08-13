const privilegedUsers = require('../../../config/admins.json').privilegedUsers;
const triviaHandler = require('../../../lib/handlers/triviaHandler');

/**
 * Checks if someone is allowed to use command.
 *
 * @param {Client} client
 * @param {Message} message
 * @return {Promise<boolean|*>}
 */
const isPrivileged = async (client, message) => {
  const groupAdmins = (await message.getChat()).participants.filter(
      (participant) => participant.isAdmin);
  return message.fromMe || privilegedUsers.includes(message.author) ||
      groupAdmins.includes(message.author);
};

/**
 * Process gameover command.
 *
 * @param {Message} message
 * @param {Client} client
 * @return {Promise<void>}
 */
const procCommand = async (message, client) => {
  if (!await isPrivileged(client, message)) {
    return;
  }
  if (triviaHandler.triviaMap.has(message.getChatId())) {
    await triviaHandler.triviaMap.get(message.getChatId()).gameOver();
  }
};

module.exports = procCommand;
