const path = require('path')


module.exports ={
    mode:'development',
    devtool: 'inline',
    output: {
        path: path.resolve(__dirname,'public_static'),
        filename: 'devery.js'
    },
    entry: [path.resolve(__dirname, 'index.js')]
}