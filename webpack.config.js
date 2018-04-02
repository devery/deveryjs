const path = require('path')
const webpack = require('webpack')

module.exports ={
    mode:'development',
    output: {
        path: path.resolve(__dirname,'public_static'),
        filename: 'devery.js'
    },
    // module:{
    //     rules :[{
    //         test: /\.js$/,
    //         loader:'babel-loader',
    //         exclude: path.resolve(__dirname, 'node_modules')
    //     }]
    // },
    entry: [path.resolve(__dirname, 'devery/devery.js')]
}