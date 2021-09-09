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
    case 'עזרה':
      await helpCommand(message);
      break;
    case 'קורונה':
      await covidCommand(message);
      break;
    case 'טריוויה':
      await triviaCommand(message, client);
      break;
    case 'סוף_משחק':
      await gameoverCommand(message, client);
      break;
    case 'תייג':
      await tagAllCommand(message, client);
      break;
    case 'חתולי':
      await catCommand(message);
      break;
    case 'דוגייי':
      await shibaCommand(message);
      break;
    case 'כלב':
      await dogCommand(message);
      break;
    case 'ברווז':
      await duckCommand(message);
      break;
    case 'לטאה':
      await lizardCommand(message);
      break;
    case 'שועל':
      await foxCommand(message);
      break;
    case 'חזיר':
      await pigCommand(message);
      break;
    case 'הגרל':
      await randomNumbers(message);
      break;
    case 'שם':
      await randomName(message);
      break;
    case 'ניתוח':
      await sentimentCommand(message);
      break;
    case 'תחזית':
      await weatherCommand(message);
      break;
    case 'עצלן':
      await speechToTextCommand(message);
      break;
    case 'תגיד':
      await textToSpeechCommand(message);
      break;
    case 'חירום':
      await failsafeCommand(message);
      break;
    case 'גימטריה':
      await gimatriaCommand(message);
      break;
    case 'סטיקר':
      await stickerCommand(await message.getQuotedMessage());
      break;
    case 'אהבה':
      await loveCalculatorCommand(message);
      break;
    case 'מיזה':
      await whoIsCommand(message);
      break;
    case 'חסום':
      await addToBlacklistCommand(message);
      break
    case 'התר':
      await removeFromBlacklistCommand(message);
      break;
    case 'שידורים':
      await tvScheduleCommand(message);
      break;
    case 'בוט':
      await message.reply('עובד');
      break;
    case 'ויקי':
      await wikiCommand(message);
      break
    case 'בדיחה':
      await jokeCommand(message);
      break;
    case 'מבזק':
      await newsCommand(message);
      break;
    case 'אזעקה':
      await alarmCommand(message);
      break;
    case 'מזל':
      await luckCommand(message);
      break;
    case 'טיפ':
      await tipCommand(message);
      break;
    case 'תרגם':
      await translateToCommand(message);
      break;
    case 'חפש':
      await searchCommand(message);
      break;
    case 'ציקנוף':
    case 'צ׳יקנוף':
    case 'צ\'יקנוף':
      await shotsCommand(message);
      break;
    case 'שיבוץ':
      await shibutzCommand(message);
      break;
    case 'סקר':
      await surveyCommand(message, client);
      break;
    case 'תוצאות':
      surveyResults(message);
      break;
    case 'פירוש':
      await definitionCommand(message);
      break;
    case 'צבע':
      await colorizeCommand(message);
      break;
    case 'הוסף':
    case 'תוסיף':
      await formatCommand(message);
      break;
    case 'מישהו':
      await someoneCommand(message);
      break;
    case 'מספר':
      await numberCommand(message);
      break;
  }
};

module.exports = procCommand;
