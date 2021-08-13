/**
 * Process sticker command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  if (!message || !message.hasMedia) {
    return;
  }
  await message.reply(await message.downloadMedia(), undefined,
      {sendMediaAsSticker: true});
};

module.exports = procCommand;
