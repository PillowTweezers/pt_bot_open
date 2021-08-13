const axios = require('axios').default;

/**
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    // Request part.
    const options = {
        method: 'GET',
        url: 'https://fortune-telling.online/random-advice-online/'
    };
    const response = await axios.request(options).catch(err=>{});
    // Only continue if status is ok.
    if (!response || response.status !== 200) {
        return;
    }
    const page = response.data;
    const tip = page.match(new RegExp('font-size: 28px;\">(.)+', 'g'))[0].split('>')[1];
    await message.reply(tip);
};
module.exports = procCommand;
