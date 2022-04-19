const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { searchPage, getAllIndices, searchSimilarPage } = require('./app/controllers');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

const RouterV1 = express.Router();

RouterV1.use(cors());
RouterV1.use(bodyParser.urlencoded());
RouterV1.use(bodyParser.json());
RouterV1.post('/searchPage', searchPage);
RouterV1.post('/searchSimilarPages', searchSimilarPage);
RouterV1.get('/getAllIndices', getAllIndices);

app.use('/v1', RouterV1);

app.listen(PORT);
console.log('Backend avaiable at ', PORT);