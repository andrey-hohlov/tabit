const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const path = require('path');

const paths = {
  root: './',
  dist: './dist/',
  src:  './src/'
};

gulp.task('js', function () {
  return gulp.src(path.join(paths.src + 'Tabit.js'))
    .pipe(webpack({
      output: {
        library:       'Tabit',
        libraryTarget: 'umd',
        filename:      'tabit.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel?presets[]=es2015'
          },
        ]
      }
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('min', function () {
  return gulp.src(path.join(paths.dist, 'tabit.js'))
    .pipe(uglify())
    // .pipe(header(getLicense(), {
    //   version: packageInfo.version,
    //   build:   (new Date()).toUTCString()
    // }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.join(paths.dist)));
});
