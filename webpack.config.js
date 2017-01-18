'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'development';

let plugins = [new webpack.NoErrorsPlugin()];

module.exports = {
  entry:   {
    Tabit: __dirname + '/src/Tabit.js'
  },
  output: {
    path:           __dirname + '/dist',
    library:        'Tabit',
    libraryTarget:  'umd',
    filename:       '[name].min.js'
  },
  watch: NODE_ENV == 'development',
  devtool: NODE_ENV == 'development' ? 'cheap-module-inline-source-map' : null,
  module:  {
    loaders: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      loader: 'babel?presets[]=es2015'
    }]
  },
  plugins: []
};

if (NODE_ENV !== 'development') {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings:     false,
      drop_console: true,
      unsafe:       true
    }
  }));
}
