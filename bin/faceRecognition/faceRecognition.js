// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
require('@tensorflow/tfjs-node');

const Settings = require('../../config/faceRecognition.json');
const faceApi = require('face-api.js');
const faceDetectionNet = faceApi.nets.ssdMobilenetv1;
const faceDetectionOptions = new faceApi.SsdMobilenetv1Options(
    {'minConfidence': Settings.minConfidence});
const canvas = require('canvas');
const {Canvas, Image, ImageData} = canvas;
const DataUriParser = require('datauri/parser');
const parser = new DataUriParser();
const path = require('path');
const {getRandomInt} = require('../utils/random');

/**
 * Small util that helps translate the expressions to Hebrew.
 *
 * @param {string} expression
 * @return {string} - expression in Hebrew.
 */
const translateExpression = (expression) => {
  if (!getRandomInt(0, 30)) {
    return 'חרמן';
  }
  switch (expression) {
    case 'neutral':
      return 'נייטרלי';
    case 'happy':
      return 'שמח';
    case 'sad':
      return 'עצוב';
    case 'angry':
      return 'כועס';
    case 'fearful':
      return 'מפוחד';
    case 'disgusted':
      return 'נגעל';
    case 'surprised':
      return 'מופתע';
  }
};

/**
 * Loads weights to face-api models from given path.
 *
 * @param {string} weightsPath
 * @return {Promise<void>}
 */
const loadWeights = async (weightsPath) => {
  try {
    await faceDetectionNet.loadFromDisk(weightsPath);
  } catch (err) {
    console.log(err);
  }
  await faceApi.nets.faceLandmark68Net.loadFromDisk(weightsPath);
  await faceApi.nets.ageGenderNet.loadFromDisk(weightsPath);
  await faceApi.nets.faceExpressionNet.loadFromDisk(weightsPath);
};

/**
 * Processes image and returns one with face recognition drawn.
 *
 * @param {string} inputImg - Image in dataUri.
 * @return {Promise<string>} - Drawn image in dataUri.
 */
const processImage = async (inputImg) => {
  // Initialize virtual canvas.
  faceApi.env.monkeyPatch({Canvas, Image, ImageData});
  await loadWeights(path.resolve(__dirname, '../../public/weights'));
  const img = await canvas.loadImage(inputImg);
  const results = await faceApi.detectAllFaces(img, faceDetectionOptions).
      withFaceLandmarks().
      withAgeAndGender().
      withFaceExpressions();

  const outCanvas = faceApi.createCanvasFromMedia(img);
  faceApi.draw.drawDetections(outCanvas, results.map((res) => res.detection));
  results.forEach((result) => {
        const {age, gender, genderProbability, expressions} = result;
        const displayedGender = gender === 'male' ? 'זכר' : 'נקבה';
        const expression = expressions.asSortedArray()[0];
        const displayedExpression = translateExpression(expression.expression);
        new faceApi.draw.DrawTextField(
            [
              `גיל: ${age.toFixed(0)}`,
              `${displayedGender} (${faceApi.utils.round(genderProbability)})`,
              `${displayedExpression} (${(expression.probability).toFixed(2)})`,
            ],
            result.detection.box.bottomLeft,
            {
              fontSize: 1.8 * (outCanvas.width / 80),
              fontStyle: 'Arial',
            },
        ).draw(outCanvas);
      },
  );

  return parser.format('.jpg', outCanvas.toBuffer('image/jpeg')).content;
};

module.exports = processImage;
