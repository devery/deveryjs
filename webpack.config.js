const path = require('path')
const webpack = require('webpack')

var libraryName = 'devery';

module.exports = [{
    mode:'development',
    devtool: 'eval-source-map',
    target: 'node',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'index-node.js',
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
    entry: ["babel-polyfill", path.resolve(__dirname, './index.js')]
},{
    mode:'development',
    devtool: 'eval-source-map',
    target: 'web',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'index-web.js',
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
    entry: ["babel-polyfill", path.resolve(__dirname, './index.js')]
}]
