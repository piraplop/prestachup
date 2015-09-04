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
// end load modules



/*
 * Custom routine to cancel gulp when jshint is failed
 * (Currently not implemented in gulp-jshint :/)
 */
var map = require('map-stream');
var exitOnJshintError = map(function (file, cb) {
    if (!file.jshint.success) {
        console.error('jshint failed');
        process.exit(1);
    }
});

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











// ------- tasks
gulp.task('css', handleCSS);
gulp.task('js', handleJS);

gulp.task('server', function () {

    connect.server({
        root:           '.',
        livereload:     true
    });

});

gulp.task('watch', function(){

    // launch server
    gulp.start('server');


    // js
    gulp.watch([
        config.src + '/js/*.js',
        config.src + '/js/**/*.js'
    ], ['js']);


    // css
    gulp.watch([
        config.src + '/sass/*.scss',
        config.src + '/sass/**/*.scss'
    ], ['css']);


    // gulpfiles
    gulp.watch(['./gulpfile.js'], ['dev']);


    // watch
    gulp.watch(config.livereload)
        .on('change', function (file) {
            gulp.src(file.path)
                .pipe(connect.reload())
                .pipe(notify(' Reload!'));

            // log
            gutil.log(gutil.colors.inverse('Reload!'));
        });

    gutil.log(gutil.colors.inverse('Ready to work!'));

});

// dev: Same when watch. (Without image copy and imagemin)
gulp.task('dev', function () {
    gulp.start('css', 'js');

    gulp.src('./').pipe(notify('Dev build complete!'));
    gutil.log(gutil.colors.inverse('Dev build complete!'));
});

// build: All with image copy and imagemin
gulp.task('build', function () {
    gulp.start('css', 'js', 'img');

    gulp.src('./').pipe(notify('Build complete!'));
    gutil.log(gutil.colors.inverse('Build complete!'));
});
// end tasks



// ------ functions
function handleCSS() {

    _.forEach(config.files.css, function(items, name) {

        gulp.src(config.src + '/sass/'+name+'.less')
            .pipe(sourcemaps.init())
            .pipe(less().on('error', gutil.log))
            .pipe(size())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.dist + '/css'));

    });
}


function handleJS() {

    _.forEach(config.files.js, function(items, name) {

        items = smrtr(items, config);

        for (var i = 0; i < items.length; i++) {
            items[ i ] = items[ i ].replace('%src%', config.src).replace('%bower_dir%', config.bower_dir)
        }

        // concat
        gulp.src(items)
            .pipe(expect(items))
            .pipe(include())
            .pipe(concat( name + '.js'))
            .pipe(gulp.dest(config.dist + '/js/'))
            .on('error', swallowErrors);

        // riot (compile tags)
        console.log( config.src + '/js/app/views/tabs.tag' );
        gulp.src(config.src + '/js/app/views/tabs.tag')
            .pipe(riot())
            .pipe(gulp.dest(config.dist + '/js/tags/'));

        // minify
        gulp.src(config.dist + '/js/'+name+'.js')
            .pipe(uglify({mangle:false}))
            .pipe(rename(name+'.min.js'))
            .pipe(gulp.dest(config.dist + '/js/'));
    });

}


function handleImg(){
    _.forEach(config.files.img, function (path, key) {
        config.files.img[key] = smrtr(path, config);
    });

    gulp.src(config.files.img)
        .pipe(gulp.dest(config.dist + '/img'));
}



// ------- helpers
function smrtr(arr, data) {

    // Little method to apply dynamic variables

    if (typeof arr === 'string') {
        return _.template(arr)(data);
    }

    return _.map(arr, function (item) {
        return smrtr(item, data);
    });
}


function swallowErrors(error) {

    // Little method to output better errors

    var message = '';

    if (error && error.toString()) {
        message = error.toString();
    }

    gutil.log(gutil.colors.red('✖', message));

    gulp.src('./').pipe(notify('✖ Error'));

    this.emit('end');
}
// end functions