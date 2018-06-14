const path = require('path')


module.exports ={
    mode:'development',
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'index.js',
        library: "devery",
        libraryTarget: "umd"
    },
    entry: [path.resolve(__dirname, './index.js')]
}