const helpCommand = require('../../../bin/commands/otherCommands/helpCommand');
const covidCommand = require(
  '../../../bin/commands/covidCommand');
const triviaCommand = require(
  '../../../bin/commands/triviaCommands/triviaCommand');
const gameoverCommand = require(
  '../../../bin/commands/triviaCommands/gameoverCommand');
const tagAllCommand = require(
  '../../../bin/commands/groupCommands/tagAllCommand');
const addToBlacklistCommand = require(
  '../../../bin/commands/adminsCommands/addToBlacklistCommand');
const removeFromBlacklistCommand = require(
  '../../../bin/commands/adminsCommands/removeFromBlacklist');
const randomNumbers = require(
  '../../../bin/commands/funCommands/randomNumberCommand');
const randomName = require(
  '../../../bin/commands/funCommands/randomNameCommand');
const sentimentCommand = require(
  '../../../bin/commands/funCommands/sentimentCommand');
const weatherCommand = require(
  '../../../bin/commands/funCommands/weatherCommand');
const failsafeCommand = require(
  '../../../bin/commands/otherCommands/failsafeCommand');
const speechToTextCommand = require(
  '../../../bin/commands/funCommands/speechToTextCommand');
const textToSpeechCommand = require(
  '../../../bin/commands/funCommands/textToSpeechCommand');
const gimatriaCommand = require(
  '../../../bin/commands/funCommands/gimatriaCommands');
const stickerCommand = require(
  '../../../bin/commands/stickerCreatorCommands/stickerMediaCommand');
const loveCalculatorCommand = require(
  '../../../bin/commands/funCommands/loveCalculatorCommand');
const whoIsCommand = require(
  '../../../bin/commands/funCommands/whoIsCommand');
const tvScheduleCommand = require('../../../bin/commands/funCommands/tvScheduleCommand');
const wikiCommand = require('../../../bin/commands/funCommands/wikiCommand');
const jokeCommand = require('../../../bin/commands/funCommands/jokeCommand');
const newsCommand = require('../../../bin/commands/funCommands/newsCommand');
const alarmCommand = require(
  '../../../bin/commands/otherCommands/alarmCcommand');
const luckCommand = require('../../../bin/commands/funCommands/luckCommand');
const tipCommand = require('../../../bin/commands/funCommands/tipCommand');
const translateToCommand = require('../../../bin/commands/otherCommands/translateToCommand');
const searchCommand = require('../../../bin/commands/funCommands/searchCommand');
const shotsCommand = require('../../../bin/commands/funCommands/shotsCommand');
const shibutzCommand = require(
  '../../../bin/commands/funCommands/shibutzCommand');
const { surveyCommand, surveyResults } = require('../../../bin/commands/otherCommands/surveyCommand');
const definitionCommand = require('../../../bin/commands/otherCommands/definitionCommand');
const colorizeCommand = require('../../../bin/commands/funCommands/colorizeCommand');
const formatCommand = require('../../../bin/commands/funCommands/formatCommand');
const someoneCommand = require(
  '../../../bin/commands/groupCommands/someoneCommand');
const numberCommand = require(
  '../../../bin/commands/groupCommands/numberCommand');

const {
  catCommand,
  dogCommand,
  duckCommand,
  foxCommand,
  lizardCommand,
  shibaCommand,
  pigCommand,
} = require('../../../bin/commands/animalCommands/animalCommands');

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
    case '????????':
      await helpCommand(message);
      break;
    case '????????????':
      await covidCommand(message);
      break;
    case '??????????????':
      await triviaCommand(message, client);
      break;
    case '??????_????????':
      await gameoverCommand(message, client);
      break;
    case '????????':
      await tagAllCommand(message, client);
      break;
    case '??????????':
      await catCommand(message);
      break;
    case '????????????':
      await shibaCommand(message);
      break;
    case '??????':
      await dogCommand(message);
      break;
    case '??????????':
      await duckCommand(message);
      break;
    case '????????':
      await lizardCommand(message);
      break;
    case '????????':
      await foxCommand(message);
      break;
    case '????????':
      await pigCommand(message);
      break;
    case '????????':
      await randomNumbers(message);
      break;
    case '????':
      await randomName(message);
      break;
    case '??????????':
      await sentimentCommand(message);
      break;
    case '??????????':
      await weatherCommand(message);
      break;
    case '????????':
      await speechToTextCommand(message);
      break;
    case '????????':
      await textToSpeechCommand(message);
      break;
    case '??????????':
      await failsafeCommand(message);
      break;
    case '??????????????':
      await gimatriaCommand(message);
      break;
    case '??????????':
      await stickerCommand(await message.getQuotedMessage());
      break;
    case '????????':
      await loveCalculatorCommand(message);
      break;
    case '????????':
      await whoIsCommand(message);
      break;
    case '????????':
      await addToBlacklistCommand(message);
      break
    case '??????':
      await removeFromBlacklistCommand(message);
      break;
    case '??????????????':
      await tvScheduleCommand(message);
      break;
    case '??????':
      await message.reply('????????');
      break;
    case '????????':
      await wikiCommand(message);
      break
    case '??????????':
      await jokeCommand(message);
      break;
    case '????????':
      await newsCommand(message);
      break;
    case '??????????':
      await alarmCommand(message);
      break;
    case '??????':
      await luckCommand(message);
      break;
    case '??????':
      await tipCommand(message);
      break;
    case '????????':
      await translateToCommand(message);
      break;
    case '??????':
      await searchCommand(message);
      break;
    case '????????????':
    case '??????????????':
    case '??\'??????????':
      await shotsCommand(message);
      break;
    case '??????????':
      await shibutzCommand(message);
      break;
    case '??????':
      await surveyCommand(message, client);
      break;
    case '????????????':
      surveyResults(message);
      break;
    case '??????????':
      await definitionCommand(message);
      break;
    case '??????':
      await colorizeCommand(message);
      break;
    case '????????':
    case '??????????':
      await formatCommand(message);
      break;
    case '??????????':
      await someoneCommand(message);
      break;
    case '????????':
      await numberCommand(message);
      break;
  }
};

module.exports = procCommand;
