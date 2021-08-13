// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
require('@tensorflow/tfjs-node');

const faceApi = require('face-api.js');
const faceRecognitionNet = faceApi.nets.faceRecognitionNet;
const canvas = require('canvas');
const {Canvas, Image, ImageData} = canvas;
const path = require('path');

/**
 * Loads image and returns face descriptor.
 *
 * @param {string} inputImg - image in dataUri.
 * @return {Promise<Float32Array|Float32Array[]>}
 */
const getFaceDescriptor = async (inputImg) => {
  const img = await canvas.loadImage(inputImg);
  return (await faceApi.computeFaceDescriptor(img));
};

/**
 * Processes images and finds the similarity of them.
 *
 * @param {string} inputImg1 - Image in dataUri.
 * @param {string} inputImg2 - Image in dataUri.
 * @return {Promise<number>} - Percentage of similarity.
 */
const findSimilarity = async (inputImg1, inputImg2) => {
  // Initialize virtual canvas.
  faceApi.env.monkeyPatch({Canvas, Image, ImageData});

  await faceRecognitionNet.loadFromDisk(
      path.resolve(__dirname, '../../public/weights'));

  const desc1 = await getFaceDescriptor(inputImg1);
  const desc2 = await getFaceDescriptor(inputImg2);

  return faceApi.utils.round(faceApi.euclideanDistance(desc1, desc2));
};

module.exports = findSimilarity;
