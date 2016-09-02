var path = require('path');
var webpack = require('webpack');

var config = {
    debug: false,
    displayErrorDetails: false,
    entry: { insales: './src/' }
};

config.output = {
    libraryTarget: 'var',
    path: path.join(__dirname, 'vendor', 'assets', 'javascripts', 'tinymce', 'plugins'),
    pathinfo: true,
    filename: '[name].js',
    chunkFilename: '[id].js'
};

config.module = {
    loaders: [
        { test: /\.coffee$/, loader: 'coffee' },
        { test: /\.json$/, loader: 'json' }
    ]
};

config.resolve = {
    extensions: ['', '.js', '.coffee'],
    alias: {
        'tinymce/tableplugin': path.join(__dirname, 'src/plugins/table_plugin')
    }
};

config.externals = [
    'tinymce',
    function(context, request, callback) {
        // resolve tinymce dependencies as externals
        if (/^tinymce\/(?!tableplugin)/.test(request)) {
            callback(null, 'var ' + request.split('/').join('.'));
            return;
        }
        callback();
    }
];

module.exports = config;
