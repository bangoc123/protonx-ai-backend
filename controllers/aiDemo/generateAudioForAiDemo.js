import axios from 'axios';
// import { sendInternalMessage } from '../../emailAlert';
import { generateServerErrorCode, validationHandler } from '../../utils';
import { QUESTION_DOES_NOT_EXIST, SOME_THING_WENT_WRONG } from '../constant';

export const generateAudioForAiDemo = (req, res) => {
    validationHandler(req, res, async () => {
        const { OPENAI_TOKEN } = process.env;
        try {
            const { question } = req.body;
            const url = 'https://api.openai.com/v1/audio/speech';

            if (!question) {
                generateServerErrorCode(res, 400, QUESTION_DOES_NOT_EXIST);
            }

            const options = {
                method: 'POST',
                url,
                timeout: 1000 * 480,
                headers: {
                    Authorization: `Bearer ${OPENAI_TOKEN}`,
                },
                responseType: 'arraybuffer',
                data: {
                    model: 'tts-1',
                    input: question,
                    voice: 'alloy',
                },
            };

            return axios
                .request(options)
                .then(async (response) => {
                    if (response.status === 200) {
                        const buffer = Buffer.from(response.data);
                        return res.status(200).json({
                            audio: buffer,
                        });
                    } else {
                        return generateServerErrorCode(
                            res,
                            500,
                            SOME_THING_WENT_WRONG
                        );
                    }
                })
                .catch(function (err) {
                    // sendInternalMessage(
                    //     'Server Error: generateAudioForAiDemo -> call open ai api',
                    //     err.toString()
                    // );
                    return generateServerErrorCode(
                        res,
                        500,
                        SOME_THING_WENT_WRONG
                    );
                });
        } catch (error) {
            // sendInternalMessage(
            //     'Server Error: generateAudioForAiDemo:',
            //     error.toString()
            // );
            return generateServerErrorCode(res, 500, SOME_THING_WENT_WRONG);
        }
    });
};
