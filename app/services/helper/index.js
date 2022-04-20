const cosineSimilarity = {
    titleVector: {
        source: "(cosineSimilarity(params.title_vector, 'Title_vector') + 1.0)",
        fieldKey: 'Title_vector',
        sourceKey: 'title_vector',
        key: 'titleVector'
    },
    h11Vector: {
        source: "(cosineSimilarity(params.h1_1_vector, 'H1_1_vector') + 1.0)",
        sourceKey: 'h1_1_vector',
        fieldKey: 'H1_1_vector',
        key: 'h11Vector'
    },
    h12Vector: {
        source: "(cosineSimilarity(params.h1_2_vector, 'H1_2_vector') + 1.0)",
        sourceKey: 'h1_2_vector',
        fieldKey: 'H1_2_vector',
        key: 'h12Vector'
    },
    metaDescriptionVector: {
        source: "(cosineSimilarity(params.Meta_Description_vector, 'Meta_Description_vector') + 1.0)",
        sourceKey: 'Meta_Description_vector',
        fieldKey: 'Meta_Description_vector',
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
function createSimilarPageScript({ type, ...data } = {}) {

    const generateScript = (fields, resultType = 'sum') => {
        let params = {}, script = '';
        if (resultType == 'sum') {
            script = 'double value;';
            fields.map(key => {
                if (data[cosineSimilarity[key].key] && data[cosineSimilarity[key].key].length) {
                    params[cosineSimilarity[key].sourceKey] = data[cosineSimilarity[key].key];
                    script += `if(!doc['${cosineSimilarity[key].fieldKey}'].empty) {`;
                    script += `value = value + cosineSimilarity(params.${cosineSimilarity[key].sourceKey},'${cosineSimilarity[key].fieldKey}') + 1;}`;
                };
            });
            script += 'return value;'
        }
        else if (resultType == 'max') {
            script = 'def list = [];';
            fields.map(key => {
                if (data[cosineSimilarity[key].key] && data[cosineSimilarity[key].key].length) {
                    params[cosineSimilarity[key].sourceKey] = data[cosineSimilarity[key].key];
                    script += `if(!doc['${cosineSimilarity[key].fieldKey}'].empty) {`;
                    script += `list.add(cosineSimilarity(params.${cosineSimilarity[key].sourceKey},'${cosineSimilarity[key].fieldKey}') + 1);}`;
                };
            });
            script += `
            def largest = 0;
            for (def item : list) {
                if(item > largest){
                largest = item
                } 
            }
            return largest;
            `;
        }
        return {
            source: script,
            params
        };
    }

    if (type === 'sumOfAll') {
        return generateScript(Object.keys(cosineSimilarity));
    } else if (type == 'maxOfAll') {
        return generateScript(Object.keys(cosineSimilarity), 'max');
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