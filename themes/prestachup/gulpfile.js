'use strict';

// ------ config
var config = {
    // folders
    css_folder:         './css',
    js_folder:          './js',
    sass_folder:        './sass',

    // directory
    bower_dir:          './bower_components',
    plugins_dir:        './plugins',
    vendor_dir:         './vendor',

    theme_folder:       'prestachup',

    // livereload
    livereload: ['./css/*.css']
};
// ------ end config

var paths = {
    prestashopSassFiles:    './themes/prestachup/sass/**/*.scss',
    prestashopCssDir:       './themes/prestachup/css',
    prestashopJsFiles:      './themes/prestachup/js/**/*.js',
    prestashopJsDir:        './themes/prestachup/js/'
};


// ------ SASS
var sassConfig = {
    style:      'expanded',
    compass:    true,
    loadPath:   [sass_folder]
};
// ------ SASS


// ------ load modules
var _               = require('lodash');
var browserify      = require('gulp-browserify');
var concat          = require('gulp-concat');
var connect         = require('gulp-connect');
var expect          = require('gulp-expect-file');
var fs              = require('fs');
var gulp            = require('gulp');
var gulpif          = require('gulp-if');
var gutil           = require('gulp-util');
var imagemin        = require('gulp-imagemin');
var include         = require('gulp-include');
var sass            = require('gulp-ruby-sass');
var notify          = require('gulp-notify');
var rename          = require('gulp-rename');
var size            = require('gulp-filesize');
var sourcemaps      = require('gulp-sourcemaps');
var watch           = require('gulp-watch');
var uglify          = require('gulp-uglify');
var changed         = require('gulp-changed');
var minifycss       = require('gulp-minify-css');
var path            = require('path');
// end load modules



// https://github.com/StarpTech/gulp-prestashop/blob/master/gulpfile.js


/* Task
 * Lint all prestashop theme javascript files
 */
gulp.task('lint', function() {
    return gulp.src(paths.prestashopJsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(exitOnJshintError);
});

/* Task
 * Compile our prestashop SASS files
 */
gulp.task('sass', function() {
    return gulp.src(paths.prestashopSassFiles)
        .pipe(changed(paths.prestashopCssDir,{ extension: '.css' }))
        .pipe(sass(sassConfig))
        .pipe(gulp.dest(paths.prestashopCssDir));
});

/* Task
 * Watch Files For Changes
 */
gulp.task('watch', function() {
    gulp.watch(paths.prestashopJsFiles, ['lint']);
    gulp.watch(paths.prestashopSassFiles, ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'watch']);