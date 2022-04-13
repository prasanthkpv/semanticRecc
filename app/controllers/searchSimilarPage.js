const { searchSimilarPageES } = require('../services/esSearch');

module.exports = async function searchSimilarPage(req, res) {
    try {
        const body = req.body;
        if (!body.titleVector) throw Error('Title vector is required');
        const result = await searchSimilarPageES(body.titleVector);
        res.send({ data: result.hits.hits, status: 'Success' });

    } catch (e) {
        res.status(500).send({ message: e.message, status: 'Error' });
    }
};