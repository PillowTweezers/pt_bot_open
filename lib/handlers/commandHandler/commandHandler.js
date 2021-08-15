const procTextCommand = require('./textCommandHandler');
const procMediaCommand = require('./mediaCommandHandler');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const isInBlackList = async (message)=>{
  const db = new sqlite3.Database(path.resolve(__dirname, '..\\..\\..\\blacklist.db'));
  const phone = (await message.getContact()).number;
  const command = "select * from blacklist where phone="+phone;
  return new Promise((resolve, reject) => {
    db.all( command, (err, rows) => {
      if (err) {
        resolve(false);
      } else {
        if (rows.length >0){
          const currentTime = Math.floor(new Date().getTime() / 1000);
          if(rows[0]["end"]!==-1 && rows[0]["end"]<currentTime){
            console.log(phone+" deleted from blacklist");
            db.run("delete from blacklist where phone="+phone);
            resolve(false);
            return;
          }
        }
        resolve(rows.length>0);
      }
    })
  })
}

/**
 * Redirects command calls to the right handler.
 *
 * @param {Message} message
 * @param {WAWebJS.Client} client
 * @return {Promise<void>}
 */
const procMessage = async (message, client) => {
  if (!message.body.startsWith('!') || (await isInBlackList(message))) {
    return;
  }
  if (message.hasMedia) {
    await procMediaCommand(message, client);
  } else {
    await procTextCommand(message, client);
  }
};

module.exports = procMessage;
