// <chatId>: <trivia instance>
const triviaMap = new Map();

/**
 * Redirects message calls to the right trivia Game.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const forwardToTrivia = async (message) => {
  const triviaGame = triviaMap.get(message.getChatId());
  if (triviaGame) {
    await triviaGame.procMessage(message);
  }
};

module.exports.forwardToTrivia = forwardToTrivia;
module.exports.triviaMap = triviaMap;
