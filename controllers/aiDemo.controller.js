const express = require('express');
import { postQuestionForAiDemo } from './aiDemo/postQuestionForAiDemo';
import { body } from 'express-validator';
import { PROMPT_IS_REQUIRED, TITLE_DOES_NOT_EXIST } from './constant';
import { generateImageForAiDemo } from './aiDemo/generateImageForAiDemo';
import { generateImageVariationForAiDemo } from './aiDemo/generateImageVariationForAiDemo';
import { generateAudioForAiDemo } from './aiDemo/generateAudioForAiDemo';
import { postSpeechToTextForAiDemo } from './aiDemo/postSpeechToTextForAiDemo';

const aiDemoController = express.Router();

const postQuestionHook = [];

aiDemoController.post(
    '/chat',
    postQuestionHook,
    postQuestionForAiDemo,
);

const generateImageHook = [
    body('prompt')
        .exists()
        .withMessage(PROMPT_IS_REQUIRED),
];

aiDemoController.post(
    '/generate-image',
    generateImageHook,
    generateImageForAiDemo,
);

const generateImageVariationHook = [
    body('base64')
        .exists()
        .withMessage('base64 is required'),
];

aiDemoController.post(
    '/generate-image-variation',
    generateImageVariationHook,
    generateImageVariationForAiDemo,
);

const generateAudioHook = [];

aiDemoController.post(
    '/audio',
    generateAudioHook,
    generateAudioForAiDemo,
);

const postSpeechToTextHook = [];

aiDemoController.post(
    '/speech-to-text',
    postSpeechToTextHook,
    postSpeechToTextForAiDemo,
);


export default aiDemoController;
