const esClient = require('../db/es');
const { createSimilarPageScript } = require('./helper');



module.exports = {
    searchPageES: async function (url = '', index) {

        return await esClient.search({
            index,
            query: {
                term: {
                    'Address.keyword': {
                        value: url
                    }
                }
            }
        });
    },
    getAllESIndices: async function () {
        return await esClient.cat.indices({
            format: 'json'
        });
    },

    searchSimilarPageES: async function ({ from = 0, size = 30, index, ...params }) {
        const script = createSimilarPageScript(params);
        if (!script) throw Error('Failed to create script');
        const query = {
            index,
            size,
            from,
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