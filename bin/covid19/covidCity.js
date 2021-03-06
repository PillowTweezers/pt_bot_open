const axios = require('axios');

const reqPayload = JSON.stringify({
  'requests': [
    {
      'id': '0',
      'queryName': 'spotlightPublic',
      'single': false,
      'parameters': {},
    },
  ],
});

const reqOptions = {
  method: 'POST',
  url: 'https://datadashboardapi.health.gov.il/api/queries/_batch',
  data: reqPayload,
  headers: {
    'Host': 'datadashboardapi.health.gov.il',
    'sec-ch-ua': 'Hey There',
    'Content-Type': 'application/json',
    'Content-Length': 81,
  },
};

/**
 * Returns a string with color data on a specific city according to Israel's
 * ministry of health.
 *
 * @param {number} score
 * @return {string}
 */
const getColorName = (score) => {
  if (score < 4.5) {
    return '馃煝 讬专讜拽';
  } else if (score < 6) {
    return '馃煛 爪讛讜讘';
  } else if (score < 7) {
    return '讻转讜诐 讘讛讬专馃煚馃煛';
  } else if (score < 7.5) {
    return '馃煚 讻转讜诐';
  } else {
    return '馃敶 讗讚讜诐';
  }
};

const fixCityName = (cityName) => {
  switch (cityName) {
    case '转诇 讗讘讬讘':
      return '转诇 讗讘讬讘 - 讬驻讜';
    default:
      return cityName;
  }
};

/**
 * Process covid city command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  // Request part.
  const res = await axios.request(reqOptions).catch((err) => console.log(err));
  if (res.status !== 200) {
    return;
  }

  // Process data for message.
  const cityData = res.data[0].data;
  const reqCityName = fixCityName(
      message.body.substring(message.body.indexOf(' ') + 1));
  const reqCity =
      cityData.find((cityEntry) => cityEntry['name'] === reqCityName);

  // If city not found, quit.
  if (!reqCity) {
    return;
  }

  // Form message content.
  let output = '*----' + reqCityName + '----*\n';
  output += '爪讘注: ' + getColorName(reqCity['score']) + ' (' + reqCity['score'] +
      '/10)' + '\n';
  output += '讞讜诇讬诐 驻注讬诇讬诐 诇1,000 转讜砖讘讬诐: ' + reqCity['activeSickTo1000'] + '\n';
  output += '讗讞讜讝 讘讚讬拽讜转 讞讬讜讘讬讜转: ' +
      (reqCity['positiveTests'] * 100).toFixed(1) + '%\n';
  output += '砖讬注讜专 砖讬谞讜讬 讛诪讗讜诪转讬诐: ' +
      (reqCity['growthLastWeek'] * 100).toFixed(1) + '%\n';
  output += '讞讜诇讬诐 驻注讬诇讬诐: ' + reqCity['activeSick'] + '\n';
  output += '讞讬住讜谉 专讗砖讜谉: ' + reqCity['firstDose'].toFixed(1) + '%\n';
  output += '讞讬住讜谉 砖谞讬: ' + reqCity['secondDose'].toFixed(1) + '%\n';
  output += '谞讚讘拽讬诐 诇10,000 转讜砖讘讬诐: ' + reqCity['sickTo10000'];

  await message.reply(output);
};

module.exports = procCommand;
