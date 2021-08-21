const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const {removeFirstWord} = require('../../utils/stringUtils');
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
    let sql;
    if (!mentions){
        sql = "delete from blacklist where phone="+removeFirstWord(message.body);
    }else{
        sql = "delete from blacklist where phone="+mentions[0].number;
    }

    if(!sql){
        return;
    }

    const db = new sqlite3.Database(path.resolve(__dirname, '../../../blacklist.db'));
    try {
        db.run(sql);
        await message.reply("בוצע");
    }catch(err){
        await message.reply("לא עבד")
    }
};

module.exports = procCommand;
