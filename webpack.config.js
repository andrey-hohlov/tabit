'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'development';

const plugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.LoaderOptionsPlugin({
    options: {
      eslint:
        {
          cache: true,
          configFile: './.eslintrc'
        },
    },
  }),
];

if (NODE_ENV !== 'development') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings:     false,
      drop_console: true,
      unsafe:       true
    }
  }));
}

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
  devtool: NODE_ENV == 'development' ? 'cheap-module-inline-source-map' : false,
  module:  {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { 'modules': false }],
          ],
          plugins: [],
        }
      },
    ]
  },
  plugins: plugins,
};
