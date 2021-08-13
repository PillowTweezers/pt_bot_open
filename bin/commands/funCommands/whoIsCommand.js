const axios = require('axios').default;
const urlToMessageMedia = require('..\\..\\utils\\mediaHelper').urlToMessageMedia
const fs = require('fs');
const path = require('path');
let config = require('..\\..\\..\\config\\whoIs.json');
let headers = {
    'Authorization': config.auth
};

/**
 * Generate new Authorization
 * @param {Message} message
 * @return {Promise<void>}
 */
const generateAuthorization = async(message)=>{
    const payload = {
        "pwd_token": config.pwd_token,
        "phone_number":config.phone
    }
    const options = {
        method: 'POST',
        url: 'https://app.mobile.me.app/auth/authorization/login/',
        data: payload
    };
    const response = await axios.request(options).catch(err=>{console.log(err)});
    // Only continue if status is ok.
    if (!response || response.status !== 200) {
        return;
    }
    config.auth = response.data["access"];
    headers['Authorization'] = response.data["access"];
    fs.writeFile(path.resolve(__dirname,'..\\..\\..\\config\\whoIs.json'), JSON.stringify(config), function writeJSON(err) {
        if (err){
            console.log(err);
        }
    });
    await procCommand(message);
}


/**
 * Process whois command.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    // Message processing.
    let phone = message.body.split('!מיזה ')[1].trim();
    phone = phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('\\+', '');
    if(phone.startsWith('0')){
        phone = '972'+phone.substr(1);
    }
    if (!phone || phone.length>14 /*|| !message.fromMe*/){
        return;
    }
    phone = parseInt(phone);
    if(isNaN(phone)){
        return;
    }
    // Request part.
    const options = {
        method: 'GET',
        url: 'https://app.mobile.me.app/main/contacts/search/',
        params: {
            'phone_number': phone
        },
        headers: headers
    };
    const response = await axios.request(options).catch(err=>{return err});
    // Only continue if status is ok.
    if (!response || response.status !== 200) {
        await generateAuthorization(message);
        return;
    }
    const data = response.data["contact"];
    let output="";
    if(data["name"]!==""){
        output += 'שם: '+data["name"]+'\n';
    }
    if(data['suggested_as_spam']){
        output += 'דיווחים כספאם: '+data["suggested_as_spam"]+'\n';
    }
    output += 'טלפון: '+phone+"\n";
    const user = data["user"];
    if(user){
        if(user["gender"]){
            if (user["gender"]==="M"){
                output += "מין: זכר\n";
            }else{
                output += "מין: נקבה\n";
            }
        }
        if (user["email"]){
            output += 'אימייל: '+user["email"]+"\n";
        }

    }
    output = output.trimEnd();
    if(user && user['profile_picture']){
        const media  = await urlToMessageMedia(user["profile_picture"], "name");
        if(media.mimetype === "application/json"){
            await message.reply(output);
            return;
        }
        await message.reply(media, undefined, {caption: output})
    }else {
        await message.reply(output);
    }
};
module.exports = procCommand;
