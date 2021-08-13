const privilegedUsers = require('../../../config/admins.json').privilegedUsers;

/**
 * Checks if someone is allowed to use command.
 *
 * @param {Client} client
 * @param {Message} message
 * @return {Promise<boolean|*>}
 */
const isPrivileged = async (client, message) => {
  return message.fromMe || privilegedUsers.includes(message.author);
};

/**
 * Process tagAll command.
 *
 * @param {Message} message
 * @param {Client} client
 * @return {Promise<void>}
 */
const procCommand = async (message, client) => {
  if (!await isPrivileged(client, message)) {
    return;
  }
  if (!((await message.getChat()).isGroup)) {
    return;
  }
  const chat = await message.getChat();

  let output = '';
  const mentions = [];
  for (const participant of chat.participants) {
    const contact = await client.getContactById(
        participant.id._serialized);

    mentions.push(contact);
    output += `@${participant.id.user} `;
  }
  const quotedMessage = await message.getQuotedMessage() || message;
  // TODO: Add old messages support.
  await quotedMessage.reply(output, undefined, {
    mentions: mentions,
  });
};

module.exports = procCommand;
