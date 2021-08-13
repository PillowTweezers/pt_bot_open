const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {getRandomInt} = require('../../utils/random');

/**
 * Process randomName command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  // Request part.
  const options = {
    method: 'GET',
    url: 'https://data.gov.il/api/3/action/datastore_search?resource_id=c4fb2' +
        '685-381f-4e99-a88e-b9b7ed703117&limit=116677',
  };
  const res = await axios.request(options).catch((error) => {
    console.log(error);
  });
  if (res.status !== 200) {
    return;
  }

  // First name collection.
  const records = res.data['result']['records'];
  // Last name collection.
  const lastNames = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../../../public/lastnames.json')).
      toString().
      trim());

  // Formulate name from data.
  const output = records[getRandomInt(0, records.length)]['שם פרטי'] + ' ' +
      lastNames[getRandomInt(0, lastNames.length)]['family'];

  // Find recipient and send message.
  await message.reply(output);
};

module.exports = procCommand;
