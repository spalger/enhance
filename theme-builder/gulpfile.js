'use strict';

try{
// Load plugins
var gulp             = require('gulp');
var less             = require('gulp-less');
var autoprefixer     = require('gulp-autoprefixer');
var minifycss        = require('gulp-minify-css');
var jshint           = require('gulp-jshint');
var uglify           = require('gulp-uglify');
var rename           = require('gulp-rename');
var del              = require('del');
var concat           = require('gulp-concat');
var notify           = require('gulp-notify');
var debug            = require('gulp-debug');
var gulpthemeless    = require('gulp-theme-less');
var plumber          = require('gulp-plumber');
}catch (e) {

  console.log(e.toString());
  console.log('Please run `npm install`\n');
  process.exit(1);
 
}

gulp.task('global-styles', function(){
    return gulp.src("less/bootstrap.less")
    .pipe(plumber())
    .pipe(debug({verbose: true}))
    .pipe(concat('globals.css'))    
    .pipe(less({compatability: "*"}))
    .pipe(gulp.dest('globals'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('globals/'));
});

// WATCH TASKS

gulp.task('gcss', function(){
    gulp.watch(['theme/variables.less', 'less/custom.less'], ['global-styles']);
});


