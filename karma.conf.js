const path = require('path');
const webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['mocha', 'chai'],
    files: [
      'test/**/*.js',
      'test/**/*.html',
      'src/Tabit.js',
    ],
    exclude: [],
    preprocessors: {
      'test/**/*.html': ['html2js'],
      'test/**/*.js': ['babel'],
      'src/Tabit.js': ['webpack']
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015']
      }
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,
  });

  if (process.env.TRAVIS) {
    config.browsers = ['PhantomJS'];
  }
};
