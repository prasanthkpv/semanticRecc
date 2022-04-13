const esClient = require('../db/es');

module.exports = {
    searchPageES: async function (url = '') {

        return await esClient.search({
            index: 'pages',
            query: {
                term: {
                    'Address.keyword': {
                        value: url
                    }
                }
            }
        });
    },

    searchSimilarPageES: async function (titleVector = []) {
        return await esClient.search({
            index: 'pages',
            query: {
                "script_score": {
                    "query": {
                        "match_all": {}
                    },
                    "script": {
                        "source": "cosineSimilarity(params.title_vector, 'Title_vector') + 1.0",
                        "params": {
                            "title_vector": titleVector
                        }
                    }
                }
            }
        });
    }
}