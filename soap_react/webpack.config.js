var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8081',
        'webpack/hot/only-dev-server',
        './src/index.jsx'
    ],
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.scss$/,
            loader: 'style!css!sass'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ]
};
