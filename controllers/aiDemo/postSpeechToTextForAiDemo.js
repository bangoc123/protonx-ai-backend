const fs = require('fs');
const path = require('path');
// import { sendInternalMessage } from '../../emailAlert';
import { generateServerErrorCode, validationHandler } from '../../utils';
import { SOME_THING_WENT_WRONG } from '../constant';

export const postSpeechToTextForAiDemo = (req, res) => {
    validationHandler(req, res, async () => {
        try {

            const { OPENAI_TOKEN } = process.env;
            const { OpenAIApi, Configuration } = require('openai');

            const config = new Configuration({
                apiKey: OPENAI_TOKEN,
            });
            const openai = new OpenAIApi(config);

            const { buffer } = req.body;
            const bufferToPost = Buffer.from(buffer);
            const dirAudio = path.join(__dirname, 'audio.wav');
            await fs.writeFileSync(dirAudio, bufferToPost);

            const response = await openai.createTranscription(
                fs.createReadStream(dirAudio),
                'whisper-1',
            );
            if (response.data && response.data.text) {
                await fs.unlinkSync(dirAudio);
                return res.status(200).json(response.data);
            }
            return generateServerErrorCode(res, 500, SOME_THING_WENT_WRONG);
        } catch (error) {
            // sendInternalMessage(
            //     'Server Error: postSpeechToTextForAiDemo:',
            //     error.toString()
            // );
            return generateServerErrorCode(res, 500, SOME_THING_WENT_WRONG);
        }
    });
};
