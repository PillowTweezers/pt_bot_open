const axios = require('axios');
const {removeFirstWord} = require('../../utils/stringUtils');
const Settings = require('../../../config/gimatria.json');

/**
 * Process gimatria command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  const requestParams = {
    'instr': removeFirstWord(message.body),
  };
  const requestOptions = {
    method: 'GET',
    url: Settings.url,
    params: requestParams,
  };
  const res = await axios.request(requestOptions).
      catch((err) => console.log(err));
  if (res.status !== 200) {
    return;
  }
  const data = res.data;
  let sum, sameSum;
  try {
  sum = parseInt(data.match(
      new RegExp('<\\/a>&quot; = .*?<\\/h2>', 'g'))[0].split('= ')[1].split('<')[0]);
  sameSum = data.match(new RegExp('(<li>((?!([a-zA-z])).)+<\/li>)|(\\);\">(.+)<\/a>)', 'g'))
    }catch(er){
    return;
  }
  if(sameSum !==null){
    sameSum = sameSum.sort(() => Math.random() - 0.5).
    slice(0, Settings.numberOfEquivalents).
    map((item) => item.split('>')[1].split('<')[0].trim());
  }
  let output = 'החישוב למילה ' + removeFirstWord(message.body) +
      ' הסתיים בהצלחה' + '\n';
  output += removeFirstWord(message.body) + ' יוצא ' + sum + ' בגימטריה' +
      '\n';
  output += 'עוד מילים עם אותה תוצאה:' + '\n';
  if(sameSum !== null) {
    for (let i = 0; i < sameSum.length; i++) {
      output += sameSum[i] + '\n';
    }
  }
  await message.reply(output);
};

module.exports = procCommand;
