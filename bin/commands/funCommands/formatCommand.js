const {removeFirstWord} = require('../../utils/stringUtils');


/**
 * Process format command.
 *
 * @param  {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    const name = removeFirstWord(message.body);
    const quoted = await message.getQuotedMessage();
    if (!quoted || quoted.body.startsWith('!')){
        return;
    }
    const format = quoted.body;

    let output = '';
    const num = parseInt(format.split('\n')[format.split('\n').length-1]);
    if(!isNaN(num)){
        output += format+'\n'+(num+1).toLocaleString()+'. '+name;
    }else {
        output = format+'\n'+name;
    }
    await message.reply(output);
};
module.exports = procCommand;
