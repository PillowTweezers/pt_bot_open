const axios = require('axios').default;
const urlToMessageMedia = require('..\\..\\utils\\mediaHelper').urlToMessageMedia
const {removeFirstWord} = require('../../utils/stringUtils');
/**
 * Process sentiment command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    let param = parseInt(removeFirstWord(message.body));
    if(isNaN(param) || param<1 || param>100){
        param = 1;
    }

    // Request part.
    const options = {
        method: 'GET',
        url: 'https://www.n12.co.il/AjaxPage?jspName=getNewsChatMessages.jsp&count=100',
    };
    const response = await axios.request(options);
    // Only continue if status is ok.
    if (response.status !== 200) {
        return;
    }
    const report = response.data[param-1];
    const reporter = report['reporter'];
    let output = reporter['reporter']['name']+':\n';
    let media;
    if(report["medias"].length===0){
        output += report['messageContent'];
    }else {
        output += report['medias'][0]['mediaContent'];
        if (report['medias'][0]['link3']) {
        media = await urlToMessageMedia(report['medias'][0]['link3']);
        }else if(report['medias'][0]['link2']){
            media = await urlToMessageMedia(report['medias'][0]['link2']);
        }else if(report['medias'][0]['link1']){
            media = await urlToMessageMedia(report['medias'][0]['link1']);
        }
    }
    if(media){
        await message.reply(media, undefined, {caption: output})
    }else {
        await message.reply(output);
    }
};
module.exports = procCommand;
