const fs = require('fs');
const path = require('path');
// import { sendInternalMessage } from '../../emailAlert';
import { generateServerErrorCode, validationHandler } from '../../utils';
import { SOME_THING_WENT_WRONG } from '../constant';
const { OPENAI_TOKEN } = process.env;
const { OpenAIApi, Configuration } = require('openai');

const config = new Configuration({
    apiKey: OPENAI_TOKEN,
});
const openai = new OpenAIApi(config);

export const generateImageVariationForAiDemo = (req, res) => {
    validationHandler(req, res, async () => {
        try {
            const { base64 } = req.body;
            const buffer = Buffer.from(base64, 'base64');
            const dirImage = path.join(__dirname, 'image.png');
            await fs.writeFileSync(dirImage, buffer);

            const response = await openai.createImageVariation(
                fs.createReadStream(dirImage),
                1,
                '256x256',
                'b64_json'
            );
            if (response.data && response.data.data && response.data.data[0]) {
                const content = response.data.data[0];
                if (content) {
                    // remove image
                    await fs.unlinkSync(dirImage);
                    return res.status(200).json(content);
                }
            }
            return generateServerErrorCode(res, 500, SOME_THING_WENT_WRONG);
        } catch (error) {
            // sendInternalMessage(
            //     'Server Error: generateImageVariationForAiDemo:',
            //     error.toString()
            // );
            return generateServerErrorCode(res, 500, SOME_THING_WENT_WRONG);
        }
    });
};
