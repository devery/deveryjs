const path = require('path')
const webpack = require('webpack')

var libraryName = 'devery';

module.exports ={
    mode:'development',
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'index.js',
        library: libraryName,
        libraryTarget: "commonjs-module"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',

            }]
    },
    plugins:[new webpack.DefinePlugin({
        XMLHttpRequest: require('./helpers/node-xhr').XMLHttpRequest,

    })],
    entry: [path.resolve(__dirname, './index.js')]
}
