const {searchPageES} = require('../services/esSearch');
const {searchSimilarPageES} = require('../services/esSearch');
//const fs = require('fs');
// (request body contain)
// url,
// index,
// type,(title, h1, meta, sumOfAll, maxOfAll )


module.exports = async function getSimilarPages(req, res) {
  try {
    const body = req.body;
    if (!body.url) throw Error('URL is required');
    if (!body.type) throw Error('Type is required');
    if (!body.index) throw Error('Index is required');
    const searchPageResult = await searchPageES(body.url, body.index);
    if (searchPageResult.hits.total.value==0) throw Error('No match Found');

    const checkFields = (body, result) => {
      const source = result.hits.hits[0]._source;
      const data = {
        from: body.from,
        size: body.size,
        url: body.url,
        index: body.index,
        type: body.type,
        internalLink: source.internal_links,
      };
      if (body.type === 'title') {
        if (!source.Title) throw Error('Title not found');
        data.titleVector = source.Title_vector;
      } else if (body.type === 'h1') {
        if ((!source.H1_1) && (!source.H1_2)) throw Error('H1_1 or H1_2 not found');
        data.h11Vector = source.H1_1_vector;
        data.h12Vector = source.H1_2_vector;
      } else if (body.type === 'meta') {
        if (!source.Meta_Description) throw Error('Meta_Description not found');
        data.metaDescriptionVector = source.Meta_Description_vector;
      } else if (body.type === 'sumOfAll') {
        if ((!source.Title) && (!source.Meta_Description) && (!source.H1_1) && (!source.H1_2)) throw Error(' Required fields not found');
        data.titleVector = source.Title_vector;
        data.h11Vector = source.H1_1_vector;
        data.h12Vector = source.H1_2_vector;
        data.metaDescriptionVector = source.Meta_Description_vector;
      } else if (body.type === 'maxOfAll') {
        if ((!source.Title) && (!source.Meta_Description) && (!source.H1_1) && (!source.H1_2)) throw Error(' Required fields not found');
        data.titleVector = source.Title_vector;
        data.h11Vector = source.H1_1_vector;
        data.h12Vector = source.H1_2_vector;
        data.metaDescriptionVector = source.Meta_Description_vector;
      }
      return data;
    };

    const data = checkFields(body, searchPageResult);

    const similarPageResult = await searchSimilarPageES(data);

    const searchResult = {
      message: 'Success',
      data: {
        page: searchPageResult.hits.hits[0]._source,
        total: similarPageResult.hits.total.value,
        similarPages: similarPageResult.hits.hits,
      },
    };

    // const downloadCSV = (searchResult) => {
    //   const dataCSV = [];
    //   for (let index = 0; index < 20; index++) {
    //     dataCSV.push({
    //       Address: searchResult.data.similarPages[index]._source.Address,
    //       score: searchResult.data.similarPages[index]._score,
    //       title: searchResult.data.similarPages[index]._source.Title,
    //       h1_1: searchResult.data.similarPages[index]._source.H1_1,
    //       h1_2: searchResult.data.similarPages[index]._source.H1_2,
    //       meta: searchResult.data.similarPages[index]._source.Meta_Description,
    //     });
    //   }
    //   const convertToCsv = (arr) => {
    //     const keys = Object.keys(arr[0]);
    //     const replacer = (_key, value) => value === null ? '' : value;
    //     const processRow = ((row) => {
    //       keys.map((key) => JSON.stringify(row[key], replacer)).join(',');
    //     });
    //     return [keys.join(','), ...arr.map(processRow)].join('\r\n');
    //   };

    // //  const downloaddataCSV = convertToCsv(dataCSV);
    //   //  console.log(downloaddataCSV);
    //  // fs.writeFileSync('./downloaddataCSV.csv', downloaddataCSV);
    // };
    // downloadCSV(searchResult);

    res.send(searchResult);
  } catch (e) {
    console.log('error | ', e);
    res.status(500).send({message: e.message, status: 'Error'});
  }
};
