const axios = require('axios').default;
const translator = require('../../utils/translator').translateString;
const ApiKeys = require('../../../config/apiKeys.json');
/**
 * Process sentiment command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  // Message processing.
  const quotedMessage = await message.getQuotedMessage();
  if (!quotedMessage) {
    return;
  }
  const quote = quotedMessage.body;
  if (!quote) {
    return;
  }
  const translatedQuote = await translator(quote);
  // Request part.
  const options = {
    method: 'POST',
    url: 'https://text-sentiment.p.rapidapi.com/analyze',
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-key':  ApiKeys['sentiment-analysis4.p.rapidapi.com'],
      'x-rapidapi-host': 'text-sentiment.p.rapidapi.com'
    },
    data: {text: translatedQuote}
  };

  const res = await axios.request(options).catch((error) => {

  });
  // Only continue if status is ok.
  if (!res || res.status !== 200) {
    return;
  }
  const resData = res.data;
  let output = '*ניתוח ההודעה בוצע*' + '\n';
  output += 'ו--------------------------------ו' + '\n';
  output += 'אחוזי חיוביות: ' + parseFloat(resData['pos_percent']).toFixed(2) + '%\n';
  output += 'אחוזי שליליות: ' + parseFloat(resData['neg_percent']).toFixed(2) + '%\n';
  output += 'אחוזי נייטרליות: ' + parseFloat(resData['mid_percent']).toFixed(2)+'%';
  await quotedMessage.reply(output);
};

module.exports = procCommand;
