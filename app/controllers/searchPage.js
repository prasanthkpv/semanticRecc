const { searchPageES } = require('../services/esSearch');

module.exports = async function searchPage(req, res) {
    try {
        const body = req.body;
        if (!body.url) throw Error('URL is required');
        const result = await searchPageES(body.url);
        res.send({ data: result.hits.hits[0]?._source, status: 'Success' });

    } catch (e) {
        res.status(500).send({ message: e.message, status: 'Error' });
    }
};