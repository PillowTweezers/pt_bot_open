const covidIsrael = require('../covid19/covidIsrael');
const covidCity = require('../covid19/covidCity');
const covidCountry = require('../covid19/covidCountry');

/**
 * Process covid command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  if (message.body.split(' ').length === 1) {
    await covidIsrael(message);
  } else {
    await covidCountry(message);
    await covidCity(message);
  }
};

module.exports = procCommand;
