const axios = require('axios').default;
const {MessageMedia} = require('whatsapp-web.js');
const {removeFirstWord} = require('../../utils/stringUtils');
const apiKeys = require('../../../config/apiKeys.json');
const privilegedUsers = require('../../../config/admins.json').privilegedUsers;

const isPrivileged = async (message) => {
  return message.fromMe || privilegedUsers.includes(message.author);
};
/**
 * Process sentiment command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  // Message processing.
  const text = removeFirstWord(message.body);
  if (!text || text.length < 3 || text.length > 400 ||
      !(await isPrivileged(message))) {
    return;
  }

  // Request part.
  const options = {
    method: 'GET',
    url: 'https://api.voicerss.org/',
    params: {
      key: apiKeys['api.voicerss.org'],
      src: text,
      hl: 'he-il',
      r: '-2',
      c: 'mp3',
      b64: true,
    },
  };
  const response = await axios.request(options);
  if (response.status !== 200) {
    return;
  }
  await message.reply(MessageMedia.fromDataUri(response.data, 'recording.mp3'),
      undefined, {sendAudioAsVoice: true});
};

module.exports = procCommand;
