/**
 * A simple failsafe command.
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  if (message.fromMe) {
    process.exit(0);
  }
};

module.exports = procCommand;
