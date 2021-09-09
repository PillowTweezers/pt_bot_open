const isNumber = require('is-number');

/**
 * Removes all numbers at start of lines starting from given index, and numbers
 * the lines.
 * @param {string} str
 * @param {number} startLine
 */
const numberLines = (str, startLine) => {
  let output = '';
  const lines = str.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (i < startLine) {
      output += lines[i];
    } else {
      output += `${i-startLine+1}. `;
      const words = lines[i].split(' ');
      if (isNumber(parseInt(words[0]))) {
        output += words.slice(1).join(' ');
      } else {
        output += words.join(' ');
      }
    }
    output += '\n';
  }
  return output.trim();
}

/**
 * Numbers the quoted message.
 * @param {Message} message
 * @return {Promise<void>}
 */
const procCommand = async (message) => {
  if (!message.hasQuotedMsg) {
    return;
  }

  const quoMsg = await message.getQuotedMessage();
  let output = quoMsg.body;

  const startLine = parseInt(message.body.split(' ')[1]) || 0;
  output = numberLines(output, startLine);

  await message.reply(output);
};

module.exports = procCommand;