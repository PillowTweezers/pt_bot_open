const axios = require('axios');
const ApiKeys = require('../../../config/apiKeys.json');
const {MessageMedia} = require('whatsapp-web.js');

/**
 * Downloads media from url and returns the media in dataUri.
 *
 * @param {string} url
 * @return {Promise<WAWebJS.MessageMedia>} dataUri.
 */
const urlToMessageMedia = async (url) => {
  const options = {
    method: 'GET',
    url: url,
    responseType: 'arraybuffer',
  };
  const retrievedMedia = await axios.request(options);
  return new MessageMedia(retrievedMedia.headers['content-type'],
      Buffer.from(retrievedMedia.data, 'binary').toString('base64'));
};

/**
 * Get a random image of a cat.
 *
 * @return {Promise<WAWebJS.MessageMedia>} dataUri.
 */
const cat = async () => {
  const options = {
    method: 'GET',
    url: 'https://aws.random.cat/meow',
  };
  return await urlToMessageMedia(
      await axios.request(options).then((res) => res.data.file));
};

/**
 * Get a random image of a dog.
 *
 * @return {Promise<WAWebJS.MessageMedia>} dataUri.
 */
const dog = async () => {
  const options = {
    method: 'GET',
    url: 'https://dog.ceo/api/breeds/image/random',
  };
  return await urlToMessageMedia(
      await axios.request(options).then((res) => res.data.message));
};

/**
 * Get a random image of a duck.
 *
 * @return {Promise<WAWebJS.MessageMedia>} dataUri.
 */
const duck = async () => {
  const options = {
    method: 'GET',
    url: 'https://random-d.uk/api/v2/random',
  };
  return await urlToMessageMedia(
      await axios.request(options).then((res) => res.data.url));
};

/**
 * Get a random image of a fox.
 *
 * @return {Promise<WAWebJS.MessageMedia>} dataUri.
 */
const fox = async () => {
  const options = {
    method: 'GET',
    url: 'https://randomfox.ca/floof/',
  };
  return await urlToMessageMedia(
      await axios.request(options).then((res) => res.data.image));
};

/**
 * Get a random image of a lizard.
 *
 * @return {Promise<WAWebJS.MessageMedia>} dataUri.
 */
const lizard = async () => {
  const options = {
    method: 'GET',
    url: 'https://nekos.life/api/v2/img/lizard',
  };
  return await urlToMessageMedia(
      await axios.request(options).then((res) => res.data.url));
};

/**
 * Get a random image of a shiba.
 *
 * @return {Promise<WAWebJS.MessageMedia>} dataUri.
 */
const shiba = async () => {
  const options = {
    method: 'GET',
    url: 'http://shibe.online/api/shibes',
  };
  return await urlToMessageMedia(
      await axios.request(options).then((res) => res.data[0]));
};

/**
 * Get a random image of a pig.
 *
 * @return {Promise<WAWebJS.MessageMedia>} dataUri.
 */
const pig = async () => {
  const options = {
    method: 'GET',
    url: 'https://pigs.p.rapidapi.com/random',
    headers: {
      'x-rapidapi-key': ApiKeys['pigs.p.rapidapi.com'],
      'x-rapidapi-host': 'pigs.p.rapidapi.com',
      'useQueryString': true,
    },
  };
  return await urlToMessageMedia(
      await axios.request(options).then((res) => res.data.source));
};

module.exports = {
  cat,
  dog,
  duck,
  fox,
  lizard,
  shiba,
  pig,
};
