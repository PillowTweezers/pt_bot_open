const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const privilegedUsers = require('../../../config/admins.json').privilegedUsers;

const isAdmin = (message) => {
    return message.fromMe || privilegedUsers.includes(message.author);
};
/**
 * add phone to blacklist.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
    if(!isAdmin(message)){
        return;
    }

    const mentions = await message.getMentions();
    const contact = mentions[0];
    let name;
    if (contact.pushname) {
        name = contact.pushname;
    }else{
        name = contact.name;
    }
    const phone = contact.number;
    let timeToBlock = parseInt(message.body.split(' ')[message.body.split(' ').length-1]);
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if(isNaN(currentTime) || timeToBlock===-1){
        timeToBlock = -1 - currentTime;
    }
    const db = new sqlite3.Database(path.resolve(__dirname, '../../../blacklist.db'));
    try {
        const sql = "insert into blacklist (name, phone, start, end) values ('" + name + "', '" + phone + "', " + currentTime + ", " + (currentTime + timeToBlock) + ");";
        db.run(sql);
        await message.reply("בוצע");
    }catch(err){
        console.log(err);
        await message.reply("בעיה בדאטהבייס")
    }
};

module.exports = procCommand;
