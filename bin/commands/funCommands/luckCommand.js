const axios = require('axios').default;
const {getRandomIntInclusive} = require('../../utils/random');


const types = ['normal', 'funny'];
/**
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    const type = types[getRandomIntInclusive(0, types.length-1)];
    // Request part.
    const options = {
        method: 'POST',
        url: 'https://www.generatorslist.com/random/words/fortune-cookie-generator/ajax',
        data: {
            'messageType': type,
        },
    };
    const response = await axios.request(options).catch(err=>{});
    // Only continue if status is ok.
    if (!response || response.status !== 200) {
        return;
    }
    const data = response.data;
    const output = data[0]['message'][0]['message'];
    await message.reply(output);
};
module.exports = procCommand;
