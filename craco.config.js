const CracoLessPlugin = require('craco-less');
const CracoModuleFederation = require('craco-mf');

const USE_MF = process.env.REACT_USE_MF==='yes';

module.exports = {
    plugins: [
        ...[{
            plugin: CracoLessPlugin,
            //options: { lessLoaderOptions: { lessOptions: { javascriptEnabled: true }}},
        }],
        ...(USE_MF ? [{
            plugin: CracoModuleFederation,
            //options: {useNamedChunkIds: true}
        }] : []),
    ],
};