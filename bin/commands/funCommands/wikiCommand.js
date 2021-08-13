const execa = require('execa');
const path = require('path');
const fs = require('fs');
const util = require('util');
const {removeFirstWord} = require('../../utils/stringUtils');
/**
 * Process speechToText command.
 *
 * @param {Message}message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    // Message processing.
    let numOfPar, value;
    numOfPar = parseInt(message.body.split(" ")[1]);
    if(isNaN(numOfPar)){
        if(message.body.split(" ")[1]==='הכל'){
            numOfPar = 100000
            value = removeFirstWord(message.body).split(" ").slice(1).join(" ");
        }else {
            numOfPar = 1;
            value = removeFirstWord(message.body);
        }
    }else {
        numOfPar = removeFirstWord(message.body).split(" ")[0]
        value = removeFirstWord(message.body).split(" ").slice(1).join(" ");
    }

    const res = await execa('python', [
        path.resolve(__dirname + '../../../pythonScripts/wiki.py'), numOfPar, value]);
    if (!fs.existsSync(path.resolve(__dirname, '..\\..\\pythonScripts\\temp.txt'))){
        return;
    }
    const file = await fs.readFileSync(
        path.resolve(__dirname, '..\\..\\pythonScripts\\temp.txt'), 'utf8');
    const output = file.toString();
    // Remove temp files.
    try {
        fs.unlinkSync(path.resolve(__dirname, '..\\..\\pythonScripts\\temp.txt'));
    } catch (err) {
        console.error(err);
    }
    // Beautify output.
    if (res['failed']) {
        console.log(util.inspect(res));
        return;
    }
    if (output.length <10){
        return;
    }
    await message.reply(output);
};

module.exports = procCommand;
