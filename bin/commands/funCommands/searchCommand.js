const {removeFirstWord} = require('../../utils/stringUtils');
const base = 'https://googlethatforyou.com?q=';
/**
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    const text = removeFirstWord(message.body);
    if(!text||text.length===0){
        return;
    }
    const output = base+encodeURIComponent(text);

    await message.reply(output);
};
module.exports = procCommand;
