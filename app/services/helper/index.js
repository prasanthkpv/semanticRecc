const cosineSimilarity = {
    titleVector: {
        source: "(cosineSimilarity(params.title_vector, 'Title_vector') + 1.0)",
        sourceKey: 'title_vector',
        key: 'titleVector'
    },
    h11Vector: {
        source: "(cosineSimilarity(params.h1_1_vector, 'H1_1_vector') + 1.0)",
        sourceKey: 'h1_1_vector',
        key: 'h11Vector'
    },
    h12Vector: {
        source: "(cosineSimilarity(params.h1_2_vector, 'H1_2_vector') + 1.0)",
        sourceKey: 'h1_2_vector',
        key: 'h12Vector'
    },
    metaDescriptionVector: {
        source: "(cosineSimilarity(params.Meta_Description_vector, 'Meta_Description_vector')",
        sourceKey: 'Meta_Description_vector',
        key: 'metaDescriptionVector'
    }
}
//...data
// {
//     titleVector = [],
//     h11Vector = [],
//     h12Vector = [],
//     metaDescriptionVector = []
// }
function createSimilarPageScript({ type = 'sumOfAll', ...data } = {}) {

    const generateScript = (fields = []) => {
        let source = [], params = {};
        fields.map(key => {
            source.push(cosineSimilarity[key].source);
            params[cosineSimilarity[key].sourceKey] = data[cosineSimilarity[key].key]
        });
        return {
            source: source.join(' + '),
            params
        };
    }

    if (type === 'sumOfAll') {
        return generateScript(Object.keys(cosineSimilarity));
    } else if (type == 'maxOfAll') {
        const script = generateScript(Object.keys(cosineSimilarity));
        script.source = 'Math.max(' + script.source + ')';
        return script;
    } else if (type == 'title') {
        return generateScript(['titleVector']);
    } else if (type == 'h1') {
        return generateScript(['h11Vector', 'h12Vector']);
    } else if (type == 'meta') {
        return generateScript(['metaDescriptionVector']);
    }
}

module.exports = {
    createSimilarPageScript
};