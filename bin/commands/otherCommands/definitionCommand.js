const {removeFirstWord} = require('../../utils/stringUtils');
const axios = require('axios');

const getTextInTags = (text)=>{
    return text.split(">")[1].split("<")[0];
}
const getSecondTitles = (item)=>{
    const found = item.match(new RegExp(";'>.*?<", "g"));
    if (!found || found.length < 1) {
        return "";
    }
    return getTextInTags(found[0]).trim();
}
/**
 *
 * @param {string}item
 * @returns {string|*}
 */
const getExamples = (item)=>{
    let numOfExamples = item.match(new RegExp("index'>", "g"));
    if(!numOfExamples || numOfExamples.length<1) {
        return null;
    }
    numOfExamples = numOfExamples.length;
    let examplesSum = ""
    const examplesTitles = item.match(new RegExp("sr_e_txt'>.*?<", "g"));
    let examplesBodies = item.match(new RegExp("sr_example'>.*?<", "g"));
    for(let i=0;i<numOfExamples;i++) {
        if(!examplesBodies || examplesBodies.length === 0) {
            examplesSum += (i + 1).toLocaleString() + ". " + getTextInTags(examplesTitles[i]);
        }
        else {
            try {
                examplesSum += (i + 1).toLocaleString() + ". " + getTextInTags(examplesTitles[i]) + " " + getTextInTags(examplesBodies[i]);
            }catch(e){}
        }
        examplesSum += "\n";
    }
    return examplesSum;
}


/**
 * Process definition command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    const value = removeFirstWord(message.body);
    const requestOptions = {
        method: 'GET',
        url: "https://milog.co.il/"+encodeURIComponent(value)
    };
    const response = await axios.request(requestOptions);
    const page = response.data;
    const pattern = new RegExp("<div class='sr_e'><div><a href='.*? class='sr_e_t c1' title='.*?' onmousedown='.*?<\/div><\/div><\/div>", "g");
    const definitionsParts = page.match(pattern);
    let titles;
    try {
        titles = definitionsParts.map(item => getTextInTags(item.match(new RegExp("}'>.*?<", "g"))[0]));
    }catch(e){
        await message.reply('*לא נמצא פירוש למילה זו*');
        return;
    }
    const secondTitles = definitionsParts.map(item => getSecondTitles(item));
    const descriptions = definitionsParts.map(item => getTextInTags(item.match(new RegExp("sr_e_txt'>.*?<", "g"))[0]).trim());
    const examples = definitionsParts.map(item => getExamples(item));
    let output = '';
    for(let i=0;i<titles.length;i++) {
        if(!examples[i]) {
            output += "*"+(i+1).toLocaleString()+" "+titles[i] + secondTitles[i]+"*" + "\n" + descriptions[i];
        }else {
            output += "*"+(i+1).toLocaleString()+" "+titles[i] + secondTitles[i]+"*" + "\n" + examples[i];
        }
        output += "\n\n";
    }
    await message.reply(output.trimEnd());
};
module.exports = procCommand;
