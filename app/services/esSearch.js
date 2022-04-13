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
        console.log('script', script);
        if (!script) throw Error('Failed to create script');
        return await esClient.search({
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
        });
    }
}