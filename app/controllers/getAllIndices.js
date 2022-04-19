const { getAllESIndices } = require('../services/esSearch');

module.exports = async function getAllIndices(req, res) {
    try {
        const result = await getAllESIndices();
        res.send({ data: result.map(item => ({ index: item.index })), status: 'Success' });
    } catch (e) {
        res.status(500).send({ message: e.message, status: 'Error' });
    }
};