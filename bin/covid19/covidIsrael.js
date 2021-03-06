const axios = require('axios');

const requestPayload = JSON.stringify({
  'requests': [
    {
      'id': '0',
      'queryName': 'vaccinated',
      'single': false,
      'parameters': {},
    },
    {
      'id': '1',
      'queryName': 'infectedPerDate',
      'single': false,
      'parameters': {},
    },
    {
      'id': '2',
      'queryName': 'patientsPerDate',
      'single': false,
      'parameters': {},
    },
    {
      'id': '3',
      'queryName': 'testResultsPerDate',
      'single': false,
      'parameters': {},
    },
  ],
});

const requestOptions = {
  method: 'POST',
  url: 'https://datadashboardapi.health.gov.il/api/queries/_batch',
  data: requestPayload,
  headers: {
    'Host': 'datadashboardapi.health.gov.il',
    'sec-ch-ua': 'Hey There',
    'Content-Type': 'application/json',
    'Content-Length': 81,
  },
};

/**
 * Process covid Israel command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  // Request part.
  const res = await axios.request(requestOptions).
      catch((err) => console.log(err));
  if (res.status !== 200) {
    return;
  }

  // Process data for message.
  const covidData = res.data;
  // const vaccinatedData = covidData[0].data;
  const infectedData = covidData[1].data;
  const patientsData = covidData[2].data;
  const testResultsData = covidData[3].data;

  const infectedSum = infectedData.reduce((prev, curr) => {
    return prev + curr.amount;
  }, 0);
  const activePatients = patientsData[patientsData.length -
      1]['Counthospitalized'] +
      patientsData[patientsData.length - 1]['patients_home'] +
      patientsData[patientsData.length - 1]['patients_hotel'];
  const infectedToday = infectedData[infectedData.length - 1]['amount'];
  const patientsHardStatus = patientsData[patientsData.length -
  1]['CountHardStatus'];
  const deadToday = patientsData[patientsData.length - 1]['CountDeath'];
  const deadSum = patientsData[patientsData.length - 1]['CountDeathCum'];
  const activeBreath = patientsData[patientsData.length - 1]['CountBreath'];
  const recovered = infectedData[infectedData.length - 1]['recovered'];
  const infectedWeekAverage = infectedData[infectedData.length - 1]['avg'];
  const testsToday = testResultsData[testResultsData.length - 1]['amount'];
  const testsPositivePercentageToday = (testResultsData[testResultsData.length -
  1]['positiveAmount'] / testsToday * 100).toPrecision(2);
  // const firstDoseSum = vaccinatedData
  //     [vaccinatedData.length - 1]['vaccinated_cum'];
  // const secondDoseSum = vaccinatedData
  //     [vaccinatedData.length - 1]['vaccinated_seconde_dose_cum'];

  let output = '*?????????? ?????? ????????????:*' + '\n';
  output += infectedSum.toLocaleString() + ' ?????? ?????????????? ???????????? ????????????' + '\n';
  output += activePatients.toLocaleString() + ' ?????????? ????????????' + '\n';
  output += infectedToday.toLocaleString() + ' ?????????? ?????????? ????????' + '\n';
  output += patientsHardStatus.toLocaleString() + ' ?????????? ???????? ??????' + '\n';
  output += deadToday.toLocaleString() + ' ???????? ??????????' + '\n';
  output += deadSum.toLocaleString() + ' ???????? ???????????? ????????????' + '\n';
  output += activeBreath.toLocaleString() + ' ??????????????' + '\n';
  output += recovered.toLocaleString() + ' ?????????????? ????????' + '\n';
  output += infectedWeekAverage.toLocaleString() + ' ?????????? ?????????? ???????????? ??????????' +
      '\n';
  output += testsToday.toLocaleString() + ' ???????????? ????????' + '\n';
  output += testsPositivePercentageToday + '% ???????????? ??????????????';
  // output += firstDoseSum.toLocaleString() + ' ?????????????? ?????? ????????????' + '\n';
  // output += secondDoseSum.toLocaleString() + ' ?????????????? ?????? ??????????';

  await message.reply(output);
};

module.exports = procCommand;
