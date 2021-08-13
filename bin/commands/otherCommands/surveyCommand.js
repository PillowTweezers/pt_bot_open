const {removeFirstWord} = require('../../utils/stringUtils');
const {Buttons, MessageTypes} = require('whatsapp-web.js');
const yargs = require('yargs/yargs');
const {description, title} = require('../../../config/survey.json')
/**
 * Process survey command.
 *
 * @param {String} command
 * @return {String[]}
 */
const parseCommand = (command)=>{
    return yargs(command).argv["_"].map(item=>item.split('"')[1]);
}
/**
 * Process survey command.
 *
 * @param {Message} message
 * @param {Client} client
 * @return {Promise<void>}
 */
const surveyCommand = async (message, client) => {
    const command = removeFirstWord(message.body);
    const parsed = parseCommand(command);
    if (parsed.includes(' ')){
        return;
    }
    let optionsObjects = [];
    for (let i=1;i<parsed.length;i++){
        optionsObjects.push({"body": parsed[i]});
    }
    let button = new Buttons(parsed[0], optionsObjects, title, description);

    // let button = new Buttons("body",[{body:"bt1"},{body:"bt2"},{body:"bt3"}],parsed[0],"הסבר");
    await client.sendMessage((await message.getChat()).id._serialized, button);
};


/**
 * Process survey command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const surveyResults = async (message)=>{
    const quoted = await message.getQuotedMessage();
    if(!quoted || !quoted.isDynamicReplyButtonsMsg){
        return;
    }
    const buttonsText = quoted.dynamicReplyButtons.map(button=>button.buttonText.displayText);
    const chat = await message.getChat();
    let counter = new Map();
    for(let i=0;i<buttonsText.length;i++){
        counter.set(buttonsText[i], 0);
    }
    let messages, voted = [];
    messages = await chat.fetchMessagesUntil(quoted);
    for(let i=0;i<messages.length;i++){
        if (!messages[i].hasQuotedMsg || messages[i].type !== MessageTypes.BUTTON_RESPONSE) {
            continue;
        }
        let quotedMessage = await messages[i].getQuotedMessage();
        if(quotedMessage && quotedMessage.id && quotedMessage.id._serialized===quoted.id._serialized && counter.has(messages[i].body) && !voted.includes(messages[i].author)){
            counter.set(messages[i].body, counter.get(messages[i].body)+1);
            voted.push(messages[i].author);
        }
    }

    let output = 'תוצאות הסקר הן: '+"\n";
    for(let i=0;i<buttonsText.length;i++){
        output += buttonsText[i]+": "+counter.get(buttonsText[i])+'\n';
    }
    await message.reply(output);
}

module.exports = {surveyCommand,surveyResults};
// procCommand({"body": '!סקר "שאלה" "תשובה1" "תשובה2" "תשובה3"'})
