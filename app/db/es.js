const { Client } = require('@elastic/elasticsearch');
require("dotenv").config();

console.log(process.env.ES_USERNAME,process.env.ES_PASSWORD);
const client = new Client({
    node: process.env.ES_NODE,
    auth: { username: process.env.ES_USERNAME, password: process.env.ES_PASSWORD }
});

module.exports = client;

