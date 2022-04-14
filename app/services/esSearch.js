const esClient = require('../db/es');
const { createSimilarPageScript } = require('./helper');



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

    searchSimilarPageES: async function (params) {
        const script = createSimilarPageScript(params);
        if (!script) throw Error('Failed to create script');
        const query = {
            index: 'pages',
            size: 30,
            query: {
                "script_score": {
                    "query": {
                        "bool": {
                            "must_not": [
                                {
                                    "term": {
                                        "Address.keyword": {
                                            "value": params.url
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "script": {
                        "source": script.source,
                        "params": script.params
                    }
                }
            }
        };
        return await esClient.search(query);
    }
}