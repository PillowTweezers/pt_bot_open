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

  let output = '*תמונת מצב קורונה:*' + '\n';
  output += infectedSum.toLocaleString() + ' חלו בקורונה מתחילת המגיפה' + '\n';
  output += activePatients.toLocaleString() + ' חולים פעילים' + '\n';
  output += infectedToday.toLocaleString() + ' חולים חדשים היום' + '\n';
  output += patientsHardStatus.toLocaleString() + ' חולים במצב קשה' + '\n';
  output += deadToday.toLocaleString() + ' מתים חדשים' + '\n';
  output += deadSum.toLocaleString() + ' מתים מתחילת המגיפה' + '\n';
  output += activeBreath.toLocaleString() + ' מונשמים' + '\n';
  output += recovered.toLocaleString() + ' מחלימים היום' + '\n';
  output += infectedWeekAverage.toLocaleString() + ' חולים חדשים בממוצע השבוע' +
      '\n';
  output += testsToday.toLocaleString() + ' בדיקות היום' + '\n';
  output += testsPositivePercentageToday + '% בדיקות חיוביות';
  // output += firstDoseSum.toLocaleString() + ' מתחסנים מנה ראשונה' + '\n';
  // output += secondDoseSum.toLocaleString() + ' מתחסנים מנה שנייה';

  await message.reply(output);
};

module.exports = procCommand;
