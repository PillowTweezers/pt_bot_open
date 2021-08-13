const privilegedUsers = require('../../../config/admins.json').privilegedUsers;
const triviaHandler = require('../../../lib/handlers/triviaHandler');
const Trivia = require('../../trivia/trivia');

/**
 * Checks if someone is allowed to use command.
 *
 * @param {Message} message
 * @param {Client} client
 * @return {Promise<boolean|*>}
 */
const isPrivileged = async (message, client) => {
  return message.fromMe || privilegedUsers.includes(message.author);
};

/**
 * Process trivia command.
 *
 * @param {Message} message
 * @param {Client} client
 * @return {Promise<void>}
 */
const procCommand = async (message, client) => {
  if (!await isPrivileged(message, client)) {
    return;
  }
  const messageParts = message.body.split(' ');
  // Dont start 2 games on the same chat.
  if (triviaHandler.triviaMap.has(message.getChatId())) {
    return;
  }
  // If parameter not passed, call constructor without it.
  const questionCount = parseInt(messageParts[1]) || undefined;
  triviaHandler.triviaMap.set(message.getChatId(),
      new Trivia(client, message.getChatId(), questionCount));
};

module.exports = procCommand;
