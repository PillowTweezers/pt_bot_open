const translator = require('../utils/translator').translateString;
const axios = require('axios');
const ApiKeys = require('../../config/apiKeys.json');

const requestOptions = {
  method: 'GET',
  url: 'https://corona-virus-world-and-india-data.p.rapidapi.com/api',
  headers: {
    'x-rapidapi-key':
        ApiKeys['corona-virus-world-and-india-data.p.rapidapi.com'],
    'x-rapidapi-host': 'corona-virus-world-and-india-data.p.rapidapi.com',
  },
};

/**
 * Process covid country command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  // Remove command, and translate to english.
  const reqCountryName = message.body.substring(message.body.indexOf(' ') + 1);
  let translatedReqCountryName = await translator(reqCountryName);

  // Correct country name, thank you google for spelling Romania as Rumania.
  switch (translatedReqCountryName) {
    case 'United States':
      translatedReqCountryName = 'USA';
      break;
    case 'England':
      translatedReqCountryName = 'UK';
      break;
    case 'Rumania':
      translatedReqCountryName = 'Romania';
      break;
    case 'Czech Republic':
      translatedReqCountryName = 'Czechia';
      break;
    case 'United Arab Emirates':
      translatedReqCountryName = 'UAE';
      break;
  }

  // The api request part.
  const res = await axios.request(requestOptions);
  // Well, we don't want an error.
  if (res.status !== 200) {
    return;
  }

  // Find requested country, and quit if not found.
  const country = res.data['countries_stat'].find((countryEntry) =>
      countryEntry['country_name'].toUpperCase() ===
      translatedReqCountryName.toUpperCase());
  if (!country) {
    return;
  }

  // Form message content.
  let output = '*----' + reqCountryName + '----*\n';
  output += country['cases'] + ' חולים מתחילת המגפה' + '\n';
  output += country['deaths'] + ' מתים מתחילת המגיפה' + '\n';
  output += country['total_recovered'] + ' מחלימים מתחילת המגיפה' + '\n';
  output += country['new_deaths'] + ' מתים חדשים' + '\n';
  output += country['new_cases'] + ' חולים חדשים' + '\n';
  output += country['serious_critical'] + ' חולים במצב קשה' + '\n';
  output += country['active_cases'] + ' חולים פעילים' + '\n';
  output += country['total_cases_per_1m_population'] + ' חולים למיליון איש' +
      '\n';
  output += country['deaths_per_1m_population'] + ' מתים למיליון איש';

  await message.reply(output);
};

module.exports = procCommand;
