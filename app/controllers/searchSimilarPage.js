const { searchSimilarPageES } = require('../services/esSearch');

module.exports = async function searchSimilarPage(req, res) {
    try {
        const body = req.body;
        if (!body.url) throw Error('URL is required');
        if (!body.type) throw Error('Type is required');
        const result = await searchSimilarPageES(body);
        res.send({ data: result.hits.hits, status: 'Success' });

    } catch (e) {
        console.log('error | ', e);
        res.status(500).send({ message: e.message, status: 'Error' });
    }
};