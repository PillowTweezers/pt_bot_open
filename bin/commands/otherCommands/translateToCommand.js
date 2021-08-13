const {removeFirstWord} = require('../../utils/stringUtils');
const translateStringTo = require('../../utils/translator').translateStringTo;


/**
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    let text = removeFirstWord(message.body);
    if(!text||text.length<2){
        const quotedMessage = await message.getQuotedMessage();
        if (quotedMessage){
            text =  quotedMessage.body;
        }else{
            return;
        }
    }
    const translatedText = await translateStringTo(text, 'he');
    let output = 'הטקסט תורגם בהצלחה:'+'\n';
    output += translatedText;
    await message.reply(output);
};
module.exports = procCommand;
