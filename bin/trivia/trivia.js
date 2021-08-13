const fs = require('fs');
const QuestionEntry = require('./questionEntry');
const Participant = require('./participant');
const Config = require('../../config/trivia.json');
const path = require('path');
const triviaHandler = require('../../lib/handlers/triviaHandler');
const {getRandomInt} = require('../utils/random');

// Util functions.
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Trivia game class.
 */
class Trivia {
  /**
   * Constructor for a trivia game.
   *
   * @param {Client} client
   * @param {string} chatId
   * @param {number} numOfQuestion
   */
  constructor(client, chatId, numOfQuestion = Config.defaultQuestionCount) {
    this.client = client;
    this.chatId = chatId;
    // Cap question count.
    if (numOfQuestion > Config.maxQuestionCount) {
      numOfQuestion = Config.maxQuestionCount;
    }
    this.numOfQuestion = numOfQuestion;
    this.questionCounter = 0;
    this.participants = [];
    this.loadQuestionsFile(
        path.resolve(__dirname + '/../../', Config.questionsFile));
    this.startGame();
  }

  /**
   * Prepares the outside given data from processing.
   *
   * @param {Message} message
   */
  async procMessage(message) {
    this.processAnswer(message.body,
        (await message.getContact()).id._serialized);
  }

  /**
   * Loads and parses the questions json file.
   *
   * @param {string} filePath
   */
  loadQuestionsFile(filePath) {
    this.triviaJson = JSON.parse(fs.readFileSync(filePath).toString());
  }

  /**
   * Starts the game.
   *
   * @return {Promise<void>}
   */
  async startGame() {
    await this.withdrawQuestion();
  }

  /**
   * Changes the current question to a random question from the loaded questions
   * json file.
   *
   * @return {Promise<void>}
   */
  async withdrawQuestion() {
    // TODO: Remove withdrawn question from object.
    this.questionCounter++;
    this.currentQuestion = new QuestionEntry(this.triviaJson[
        getRandomInt(0, this.triviaJson.length)]);
    await this.client.sendMessage(this.chatId, this.currentQuestion.toString());
  }

  /**
   * Returns the index of the current question's correct answer in the answers'
   * array.
   *
   * @return {number}
   */
  getCorrectAnswerIndex() {
    return this.currentQuestion.getCorrectAnswerIndex();
  }

  /**
   * Alters participant's score by a specified amount. Uses the phone number to
   * identify the participant. If participant not found it adds a new one to
   * array.
   *
   * @param {string} userId
   * @param {int} score
   */
  alterParticipantScore(userId, score) {
    const participantAnswered = this.participants.find(
        (participant) => participant.getId() === userId);
    if (participantAnswered) {
      participantAnswered.alterScore(score);
    } else {
      this.participants.push(new Participant(userId, score));
    }
  }

  /**
   * Stops the round, if needed it ends the game, if not it just sleeps for a
   * delay from the config file and withdraws a new question.
   *
   * @return {Promise<void>}
   */
  async roundOver() {
    this.currentQuestion = null;
    if (this.questionCounter >= this.numOfQuestion) {
      await this.gameOver();
      return;
    }
    await this.client.sendMessage(this.chatId,
        'הסיבוב נגמר, שאלה הבאלה תתחיל בעוד ' +
        Config.sleepTime / 1000 + ' שניות');
    await sleep(Config.sleepTime);
    await this.withdrawQuestion();
  }

  /**
   * Process answer and change participant's score accordingly.
   *
   * @param {string} receivedAnswer
   * @param {string} userId
   */
  processAnswer(receivedAnswer, userId) {
    // Quit if in timeout.
    if (this.currentQuestion === null) {
      return;
    }
    const receivedParsedAnswer = parseInt(receivedAnswer);
    // Determine if message is an answer to the question.
    if (!(receivedParsedAnswer > 0 && receivedParsedAnswer < 5)) {
      return;
    }
    if (receivedParsedAnswer === (this.getCorrectAnswerIndex() + 1)) {
      this.alterParticipantScore(userId, Config.correctReward);
      this.roundOver();
    } else {
      this.alterParticipantScore(userId, Config.mistakePenalty);
    }
  }

  /**
   * Declares trivia game as over, and sends a message with participants'
   * scores.
   *
   * @return {Promise<void>}
   */
  async gameOver() {
    let output = '*נגמר המשחק!*\n';
    const mentions = [];
    this.participants.sort((a, b) => (a.getScore() < b.getScore()) ? 1 : -1);
    for (const participant of this.participants) {
      output += participant.toString();
      const contact = await this.client.getContactById(
          participant.getId());

      mentions.push(contact);
    }
    await this.client.sendMessage(this.chatId, output, {mentions: mentions});
    triviaHandler.triviaMap.delete(this.chatId);
  }
}

module.exports = Trivia;
