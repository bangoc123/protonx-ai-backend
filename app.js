require('dotenv').config({ path: `./.env.${process.env.ENV}` });
const express = require('express');
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';


const { OPENAI_TOKEN } = process.env;

// console.log('--process.env;', OPENAI_TOKEN);

const app = express();
const port = 5001;

// Set up bodyParser
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

// compress all responses
app.use(compression());

// Set up CORS
app.use(cors());

import aiDemoController from './controllers/aiDemo.controller';

app.use('/ai-demos', aiDemoController);

app.get('/', (req, res) => {
  res.send('ProtonX AI API is online!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

