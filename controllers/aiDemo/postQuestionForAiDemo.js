import axios from 'axios';
// import { sendInternalMessage } from '../../emailAlert';
import { generateServerErrorCode, validationHandler } from '../../utils';
import { QUESTION_DOES_NOT_EXIST, SOME_THING_WENT_WRONG } from '../constant';

export const postQuestionForAiDemo = (req, res) => {
    validationHandler(req, res, async () => {
        try {
            const { questions } = req.body;
            const { OPENAI_TOKEN } = process.env;
            const url = 'https://api.openai.com/v1/chat/completions';

            if (!questions || questions.length === 0) {
                generateServerErrorCode(res, 400, QUESTION_DOES_NOT_EXIST);
            }

            const options = {
                method: 'POST',
                url,
                timeout: 1000 * 480,
                headers: {
                    Authorization: `Bearer ${OPENAI_TOKEN}`,
                },
                data: {
                    model: 'gpt-4',
                    messages: questions,
                },
            };

            return axios
                .request(options)
                .then((response) => {
                    if (response.status === 200) {
                        const content =
                            response['data']['choices'][0]['message'];
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
                    // sendInternalMessage(
                    //     'Server Error: postQuestionForAiDemo -> call open ai api',
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
            //     'Server Error: postQuestionForAiDemo:',
            //     error.toString()
            // );
            return generateServerErrorCode(res, 500, SOME_THING_WENT_WRONG);
        }
    });
};
