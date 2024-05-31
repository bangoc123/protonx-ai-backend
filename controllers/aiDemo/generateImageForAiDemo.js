import axios from 'axios';
import { generateServerErrorCode, validationHandler } from '../../utils';
import { SOME_THING_WENT_WRONG } from '../constant';

export const generateImageForAiDemo = (req, res) => {
    validationHandler(req, res, async () => {
        const { OPENAI_TOKEN } = process.env;
        try {
            const { prompt } = req.body;
            const url = 'https://api.openai.com/v1/images/generations';

            const options = {
                method: 'POST',
                url,
                timeout: 1000 * 480,
                headers: {
                    Authorization: `Bearer ${OPENAI_TOKEN}`,
                },
                data: {
                    model: 'dall-e-2',
                    prompt,
                    size: '256x256',
                    response_format: 'b64_json',
                },
            };

            return axios
                .request(options)
                .then((response) => {

                    if (response.status === 200) {
                        const content =
                            response['data']['data'][0];
                        if (content) {
                            return res.status(200).json(content);
                        }

                        return generateServerErrorCode(
                            res,
                            500,
                            SOME_THING_WENT_WRONG
                        );
                    } else {
                        return generateServerErrorCode(
                            res,
                            500,
                            SOME_THING_WENT_WRONG
                        );
                    }
                })
                .catch(function (err) {
                    // console.log('---response', err)
                    // sendInternalMessage(
                    //     'Server Error: generateImageForAiDemo -> call open ai api',
                    //     err.toString()
                    // );
                    return generateServerErrorCode(
                        res,
                        500,
                        SOME_THING_WENT_WRONG
                    );
                });
        } catch (error) {
            // console.log('---response', error)
            // sendInternalMessage(
            //     'Server Error: generateImageForAiDemo:',
            //     error.toString()
            // );
            return generateServerErrorCode(res, 500, SOME_THING_WENT_WRONG);
        }
    });
};
