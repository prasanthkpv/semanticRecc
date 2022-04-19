const esClient = require('../db/es');
const { createSimilarPageScript } = require('./helper');
// const fs = require('fs');

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

    searchSimilarPageES: async function ({
        from = 0,
        size = 30,
        index,
        internalLinks = [],
        ...params
    }) {
        const script = createSimilarPageScript(params);
        internalLinks.push(params.url);
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
                                    "terms": { "Address.keyword": internalLinks }
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
        // fs.writeFileSync('./query.json', JSON.stringify(query, null, 4));
        return await esClient.search(query);
    }
}