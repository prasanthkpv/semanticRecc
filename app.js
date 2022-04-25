const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { searchPage, getAllIndices, searchSimilarPage, getSimilarPages } = require('./app/controllers');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

const RouterV1 = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use('/v1', RouterV1);


RouterV1.post('/searchPage', searchPage);
RouterV1.post('/searchSimilarPages', searchSimilarPage);
RouterV1.get('/getAllIndices', getAllIndices);
RouterV1.post('/getSimilarPages', getSimilarPages);  // doing


app.listen(PORT);
console.log('Backend avaiable at ', PORT);