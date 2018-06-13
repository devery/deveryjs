const path = require('path')


module.exports ={
    mode:'development',
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(__dirname,''),
        filename: 'devery.dist.js'
    },
    entry: [path.resolve(__dirname, './index.js')]
}