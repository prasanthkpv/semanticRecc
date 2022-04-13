const { Client } = require('@elastic/elasticsearch');

const client = new Client({

    node: 'http://20.41.219.117:9200',
    auth: { username: 'elastic', password: 'MYP3_u3NlSExsDuxqlTC' }
});

module.exports = client;

