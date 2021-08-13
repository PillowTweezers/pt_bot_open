const stickerCommand = require(
    '../../../bin/commands/stickerCreatorCommands/stickerMediaCommand');
const compareCommand = require(
    '../../../bin/commands/funCommands/compareCommand');
const faceRecognitionCommand = require(
    '../../../bin/commands/funCommands/faceRecognitionCommand');
const colorizeCommand = require(
    '../../../bin/commands/funCommands/colorizeCommand');
/**
 * Redirects command calls to the right command file.
 *
 * @param {Message} message
 * @param {Client} client
 * @return {Promise<void>}
 */
const procCommand = async (message, client) => {
  const messageParts = message.body.split(' ');
  switch (messageParts[0].substr(1)) {
    case 'סטיקר':
      await stickerCommand(message);
      break;
    case 'דומה':
      await compareCommand(message);
      break;
    case 'ניתוח':
      await faceRecognitionCommand(message);
      break;
    case 'צבע':
      await colorizeCommand(message);
      break;
  }
};

module.exports = procCommand;
