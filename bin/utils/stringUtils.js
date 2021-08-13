const emojiRegex = require('emoji-regex');

/**
 * Checks if string contains hebrew.
 *
 * @param {string} str
 * @return {boolean}
 */
const containsHe = (str) => {
  return (/[\u0590-\u05FF]/).test(str);
};

/**
 * Reverses string.
 *
 * @param {string} str
 * @return {string}
 */
const reverse = (str) => {
  return str.split('').reverse().join('');
};

/**
 * Revers hebrew in string.
 *
 * @param {string} str
 * @return {string}
 */
const reverseHe = (str) => {
  const words = str.split(' ');
  let reversedWords = [];
  let hebrewWords = [];
  for (let i = 0; i < words.length; i++) {
    if (containsHe(words[i])) {
      hebrewWords.push(reverse(words[i]));
    } else {
      hebrewWords.reverse();
      reversedWords = [...reversedWords, ...hebrewWords];
      hebrewWords = [];
      reversedWords.push(words[i]);
    }
  }
  hebrewWords.reverse();
  reversedWords = [...reversedWords, ...hebrewWords];
  return reversedWords.join(' ');
};

/**
 * Removes a requested amount of words from the start of a string.
 *
 * @param {string} str
 * @param {number} wordCount
 * @return {string}
 */
const removeWordsFromStart = (str, wordCount) => {
  return str.split(' ').splice(wordCount).join(' ');
};

/**
 * Removes the first word from a string.
 *
 * @param {string} str
 * @return {string}
 */
const removeFirstWord = (str) => {
  return removeWordsFromStart(str, 1);
};

const removeEmojis = (str) => {
  const regex = emojiRegex();
  return str.replace(regex, '');
};

module.exports = {
  containsHe,
  reverse,
  reverseHe,
  removeWordsFromStart,
  removeFirstWord,
  removeEmojis
};
