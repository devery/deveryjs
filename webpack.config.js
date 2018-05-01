const path = require('path')


module.exports ={
    mode:'development',
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(__dirname,''),
        filename: 'transpiled.js'
    },
    entry: [path.resolve(__dirname, 'devery/devery.js')]
}