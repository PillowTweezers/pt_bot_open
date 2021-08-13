const {Client} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const commandHandler = require('./handlers/commandHandler/commandHandler');
const triviaHandler = require('./handlers/triviaHandler');
const Settings = require('../config/bot.json');
const fs = require('fs');
const path = require('path');
const util = require('util');
const argv = require('yargs/yargs')(process.argv.slice(2)).argv;
const lolcatjs = require('lolcatjs');
const {getRandomIntInclusive} = require('../bin/utils/random');

// Mange client settings.
// Load session file.
if (fs.existsSync(Settings.sessionFile)) {
  Settings.launchOptions.session = require(path.resolve(Settings.sessionFile));
}

// Define client.
const client = new Client(Settings.launchOptions);

client.on('qr', (qr) => {
  qrcode.generate(qr, {small: true});
});

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED');
  // Save session to file.
  fs.writeFile(Settings.sessionFile, JSON.stringify(session), function(err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on('ready', () => {
  // Print bot's logo in rainbow.
  lolcatjs.options.seed = getRandomIntInclusive(0, 1000);
  lolcatjs.options.colors = true;
  lolcatjs.fromString(Settings.logo);
  console.log('Client is ready!');
});

client.on('message_create', async (message) => {
  if (!argv['minimal']) {
    commandHandler(message, client).
        catch((err) => {
          console.log('----------------------------------------------');
          console.log('COMMAND ERROR!!\n');
          console.log(util.inspect(err, false, null, true));
          console.log(util.inspect(message, false, null, true));
          console.log('----------------------------------------------');
        });
    triviaHandler.forwardToTrivia(message).
        catch((err) => {
          console.log('----------------------------------------------');
          console.log('TRIVIA ERROR!!\n');
          console.log(util.inspect(err, false, null, true));
          console.log(util.inspect(message, false, null, true));
          console.log('----------------------------------------------');
        });
  } else {
    console.log('----------------------------------------------');
    console.log('Message Record');
    console.log(util.inspect(message, false, null, true));
    console.log(
        util.inspect((await message.getQuotedMessage()), false, null, true));
    console.log('----------------------------------------------');
  }
});

// Start client actions.
client.initialize().catch((err) => console.log(err));
