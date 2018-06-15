const path = require('path')
var libraryName = 'devery';
var outputFile = libraryName + '.js';

module.exports ={
    mode:'development',
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'index.js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    entry: [path.resolve(__dirname, './index.js')]
}