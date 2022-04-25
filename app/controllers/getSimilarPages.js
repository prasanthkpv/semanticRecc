const { searchPageES } = require('../services/esSearch');
const { searchSimilarPageES } = require('../services/esSearch');

//(request body contain)
// url, 
// index,
// type,(title, h1, meta, sumOfAll, maxOfAll )


module.exports = async function getSimilarPages(req, res) {
    try {
        const body = req.body;
        if (!body.url) throw Error('URL is required');
        if (!body.type) throw Error('Type is required');
        if (!body.index) throw Error('Index is required');
        const result = await searchPageES(body.url, body.index);

        // res.send({ data: result.hits.hits[0] && result.hits.hits[0]._source, status: 'Success' });
        const source = result.hits.hits[0]._source;
        const data = {
            from: body.from,
            size: body.size,
            url: body.url,
            index: body.index,
            type: body.type,
            internalLink: source.internal_links
        }

        if (body.type === 'title') {
            if (!source.Title_vector) throw Error('Title Vector is required');
            data.titleVector = source.Title_vector;
        }
        else if (body.type === 'h1') {
            if ((!source.H1_1_vector) && (!source.H1_2_vector)) throw Error('H1_1_vector or H1_2_vector is required');
            data.h11Vector = source.H1_1_vector;
            data.h12Vector = source.H1_2_vector;

        }
        else if (body.type === 'meta') {
            if (!source.Meta_Description_vector) throw Error('Meta_Description_vector is required');
            data.metaDescriptionVector = source.Meta_Description_vector;
        }
        else if (body.type === 'sumOfAll') {
            if ((!source.Title_vector) && (!source.Meta_Description_vector) && (!source.H1_1_vector) && (!source.H1_2_vector)) throw Error(' Required Vectors are empty');
            data.titleVector = source.Title_vector;
            data.h11Vector = source.H1_1_vector;
            data.h12Vector = source.H1_2_vector;
            data.metaDescriptionVector = source.Meta_Description_vector;
        }
        else if (body.type === "maxOfAll") {
            if ((!source.Title_vector) && (!source.Meta_Description_vector) && (!source.H1_1_vector) && (!source.H1_2_vector)) throw Error(' Required Vectors are empty');
            data.titleVector = source.Title_vector;
            data.h11Vector = source.H1_1_vector;
            data.h12Vector = source.H1_2_vector;
            data.metaDescriptionVector = source.Meta_Description_vector;
        }

        const similarPageResult = await searchSimilarPageES(data);
        res.send({ total: similarPageResult.hits.total.value, data: similarPageResult.hits.hits, status: 'Success' });

    } catch (e) {
        console.log('error | ', e);
        res.status(500).send({ message: e.message, status: 'Error' });
    }
};